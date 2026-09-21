import json
from io import BytesIO
from unittest import mock

from botocore.exceptions import ClientError
from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from django.urls import reverse
from PIL import Image

from packages import models as pm

from . import r2
from .models import MediaAsset

User = get_user_model()

R2_TEST_SETTINGS = dict(
    R2_ENABLED=True,
    R2_ENDPOINT_URL="https://acct.r2.cloudflarestorage.com",
    R2_ACCESS_KEY_ID="key",
    R2_SECRET_ACCESS_KEY="secret",
    R2_BUCKET_NAME="test-bucket",
    R2_PUBLIC_URL="https://cdn.example.test",
    # These views extend admin templates that use {% static %}; the manifest
    # storage in base.py needs a collectstatic run that tests don't have.
    STORAGES={
        "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
        "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
    },
)


def png_bytes(size=(40, 30)):
    buf = BytesIO()
    Image.new("RGB", size, (200, 80, 20)).save(buf, format="PNG")
    return buf.getvalue()


def client_error(code="404"):
    return ClientError({"Error": {"Code": code, "Message": "x"}}, "HeadObject")


@override_settings(**R2_TEST_SETTINGS)
class MediaLibraryTests(TestCase):
    def setUp(self):
        self.staff = User.objects.create_user(username="staff", password="pw", is_staff=True)
        self.client.login(username="staff", password="pw")
        self.s3 = mock.MagicMock()
        patcher = mock.patch("medialib.r2.get_client", return_value=self.s3)
        patcher.start()
        self.addCleanup(patcher.stop)

    def post_json(self, name, payload):
        return self.client.post(reverse(name), json.dumps(payload), content_type="application/json")

    def make_asset(self, key="library/2026/09/abcd1234-photo.png", name="photo.png"):
        return MediaAsset.objects.create(key=key, original_name=name, content_type="image/png", size=1234, width=40, height=30)

    # -- access -----------------------------------------------------------

    def test_anonymous_is_redirected_to_login(self):
        self.client.logout()
        for name in ("medialib_library", "medialib_presign", "medialib_complete", "medialib_delete"):
            response = self.client.get(reverse(name))
            self.assertEqual(response.status_code, 302, name)
            self.assertIn("login", response.url)

    def test_non_staff_is_redirected_to_login(self):
        User.objects.create_user(username="reg", password="pw")
        self.client.login(username="reg", password="pw")
        self.assertEqual(self.client.get(reverse("medialib_library")).status_code, 302)

    # -- presign ----------------------------------------------------------

    def test_presign_returns_a_signed_url_and_a_safe_key(self):
        self.s3.generate_presigned_url.return_value = "https://signed.example/put"
        response = self.post_json("medialib_presign", {"filename": "My Hotel Lobby!!.JPG", "content_type": "image/jpeg", "size": 5000})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["upload_url"], "https://signed.example/put")
        self.assertEqual(data["headers"], {"Content-Type": "image/jpeg"})
        self.assertTrue(r2.is_valid_key(data["key"]), data["key"])
        self.assertTrue(data["key"].endswith("-my-hotel-lobby.jpg"))
        params = self.s3.generate_presigned_url.call_args.kwargs["Params"]
        self.assertEqual((params["Bucket"], params["Key"], params["ContentType"]), ("test-bucket", data["key"], "image/jpeg"))

    def test_presign_rejects_bad_input(self):
        cases = [
            ({"filename": "a.gif", "content_type": "image/gif", "size": 10}, "supported type"),
            ({"filename": "a.svg", "content_type": "image/svg+xml", "size": 10}, "supported type"),
            ({"filename": "a.png", "content_type": "image/png", "size": r2.MAX_BYTES + 1}, "limit"),
            ({"filename": "a.png", "content_type": "image/png", "size": 0}, "empty"),
            ({"filename": "", "content_type": "image/png", "size": 10}, "file name"),
            ({"filename": "a.png", "content_type": "image/png", "size": "10"}, "empty"),
        ]
        for payload, fragment in cases:
            response = self.post_json("medialib_presign", payload)
            self.assertEqual(response.status_code, 400, payload)
            self.assertIn(fragment, response.json()["error"])
        self.s3.generate_presigned_url.assert_not_called()

    def test_presign_is_post_only(self):
        self.assertEqual(self.client.get(reverse("medialib_presign")).status_code, 405)

    @override_settings(R2_ENABLED=False)
    def test_presign_reports_when_r2_is_not_configured(self):
        response = self.post_json("medialib_presign", {"filename": "a.png", "content_type": "image/png", "size": 10})
        self.assertEqual(response.status_code, 503)

    # -- complete ---------------------------------------------------------

    def prime_upload(self, body, content_type="image/png"):
        self.s3.head_object.return_value = {"ContentType": content_type, "ContentLength": len(body)}
        self.s3.get_object.return_value = {"Body": BytesIO(body)}

    def test_complete_records_a_verified_image(self):
        self.prime_upload(png_bytes((40, 30)))
        key = r2.build_key("photo.png", "image/png")
        response = self.post_json("medialib_complete", {"key": key, "original_name": "photo.png"})
        self.assertEqual(response.status_code, 200)
        asset = MediaAsset.objects.get(key=key)
        self.assertEqual((asset.width, asset.height, asset.content_type), (40, 30, "image/png"))
        self.assertEqual(asset.uploaded_by, self.staff)
        self.assertEqual(response.json()["url"], f"https://cdn.example.test/{key}")
        self.s3.delete_object.assert_not_called()

    def test_complete_is_idempotent(self):
        asset = self.make_asset()
        response = self.post_json("medialib_complete", {"key": asset.key, "original_name": "photo.png"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(MediaAsset.objects.count(), 1)
        self.s3.head_object.assert_not_called()

    def test_complete_rejects_keys_this_app_did_not_issue(self):
        for key in ("original_images/secret.png", "library/../../etc/passwd", "library/2026/09/abcd1234-x.exe", ""):
            response = self.post_json("medialib_complete", {"key": key, "original_name": "x"})
            self.assertEqual(response.status_code, 400, key)
        self.s3.head_object.assert_not_called()

    def test_complete_fails_cleanly_when_nothing_was_uploaded(self):
        self.s3.head_object.side_effect = client_error()
        response = self.post_json("medialib_complete", {"key": r2.build_key("a.png", "image/png"), "original_name": "a.png"})
        self.assertEqual(response.status_code, 400)
        self.assertFalse(MediaAsset.objects.exists())

    def test_complete_deletes_a_file_that_is_not_really_an_image(self):
        self.prime_upload(b"<html>definitely not a png</html>")
        key = r2.build_key("evil.png", "image/png")
        response = self.post_json("medialib_complete", {"key": key, "original_name": "evil.png"})
        self.assertEqual(response.status_code, 400)
        self.assertFalse(MediaAsset.objects.exists())
        self.s3.delete_object.assert_called_once_with(Bucket="test-bucket", Key=key)

    def test_complete_deletes_a_wrong_content_type(self):
        self.prime_upload(png_bytes(), content_type="text/html")
        key = r2.build_key("a.png", "image/png")
        response = self.post_json("medialib_complete", {"key": key, "original_name": "a.png"})
        self.assertEqual(response.status_code, 400)
        self.s3.delete_object.assert_called_once()

    def test_complete_deletes_an_oversized_file(self):
        self.s3.head_object.return_value = {"ContentType": "image/png", "ContentLength": r2.MAX_BYTES + 1}
        key = r2.build_key("big.png", "image/png")
        response = self.post_json("medialib_complete", {"key": key, "original_name": "big.png"})
        self.assertEqual(response.status_code, 400)
        self.s3.delete_object.assert_called_once()
        self.s3.get_object.assert_not_called()

    # -- browse / detail --------------------------------------------------

    def test_library_lists_and_searches_assets(self):
        self.make_asset(key="library/2026/09/aaaaaaaa-lobby.png", name="lobby.png")
        self.make_asset(key="library/2026/09/bbbbbbbb-kaaba.png", name="kaaba.png")
        page = self.client.get(reverse("medialib_library"))
        self.assertContains(page, "lobby.png")
        self.assertContains(page, "kaaba.png")
        self.assertContains(page, "https://cdn.example.test/library/2026/09/aaaaaaaa-lobby.png")
        searched = self.client.get(reverse("medialib_library"), {"q": "kaab"})
        self.assertContains(searched, "kaaba.png")
        self.assertNotContains(searched, "lobby.png")

    def test_detail_shows_metadata_and_where_the_image_is_used(self):
        asset = self.make_asset()
        country = pm.TourCountry.objects.create(slug="turkey", name="Turkey")
        pm.TourPackage.objects.create(
            slug="istanbul", name="Istanbul Week", country=country, strap="s", blurb="b", image_url=asset.url,
            duration_days=7, from_price_gbp="900.00", season="Spring",
        )
        page = self.client.get(reverse("medialib_detail", args=[asset.id]))
        self.assertContains(page, "photo.png")
        self.assertContains(page, "40 x 30")
        self.assertContains(page, asset.url)
        self.assertContains(page, "Istanbul Week")

    def test_detail_says_when_nothing_uses_the_image(self):
        asset = self.make_asset()
        page = self.client.get(reverse("medialib_detail", args=[asset.id]))
        self.assertContains(page, "Nothing in the package content points at this image")

    # -- delete -----------------------------------------------------------

    def test_delete_asks_for_confirmation_before_touching_anything(self):
        asset = self.make_asset()
        response = self.client.post(reverse("medialib_delete"), {"ids": [str(asset.id)]})
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Delete 1 image")
        self.assertTrue(MediaAsset.objects.filter(pk=asset.pk).exists())
        self.s3.delete_object.assert_not_called()

    def test_delete_confirmation_warns_about_images_still_in_use(self):
        asset = self.make_asset()
        country = pm.TourCountry.objects.create(slug="turkey", name="Turkey")
        pm.TourPackage.objects.create(
            slug="istanbul", name="Istanbul Week", country=country, strap="s", blurb="b", image_url=asset.url,
            duration_days=7, from_price_gbp="900.00", season="Spring",
        )
        response = self.client.post(reverse("medialib_delete"), {"ids": [str(asset.id)]})
        self.assertContains(response, "Still used by")
        self.assertContains(response, "Istanbul Week")

    def test_confirmed_delete_removes_the_object_and_the_row(self):
        a, b = self.make_asset(), self.make_asset(key="library/2026/09/eeeeeeee-two.png", name="two.png")
        response = self.client.post(reverse("medialib_delete"), {"ids": [str(a.id), str(b.id)], "confirm": "1"})
        self.assertRedirects(response, reverse("medialib_library"), fetch_redirect_response=False)
        self.assertFalse(MediaAsset.objects.exists())
        deleted_keys = {c.kwargs["Key"] for c in self.s3.delete_object.call_args_list}
        self.assertEqual(deleted_keys, {a.key, b.key})

    def test_a_failed_storage_delete_keeps_the_row(self):
        asset = self.make_asset()
        self.s3.delete_object.side_effect = client_error("500")
        self.client.post(reverse("medialib_delete"), {"ids": [str(asset.id)], "confirm": "1"})
        self.assertTrue(MediaAsset.objects.filter(pk=asset.pk).exists())

    def test_delete_with_nothing_selected_does_not_call_storage(self):
        response = self.client.post(reverse("medialib_delete"), {"confirm": "1"})
        self.assertRedirects(response, reverse("medialib_library"), fetch_redirect_response=False)
        self.s3.delete_object.assert_not_called()


class KeyTests(TestCase):
    def test_keys_are_url_safe_and_unique(self):
        keys = {r2.build_key("Weird  Name (1).PNG", "image/png") for _ in range(20)}
        self.assertEqual(len(keys), 20)
        for key in keys:
            self.assertTrue(r2.is_valid_key(key), key)
            self.assertTrue(key.endswith("-weird-name-1.png"))

    def test_an_unnameable_file_still_gets_a_key(self):
        self.assertTrue(r2.is_valid_key(r2.build_key("日本語.jpg", "image/jpeg")))

    def test_r2_is_never_enabled_under_the_test_runner(self):
        from django.conf import settings
        self.assertFalse(settings.R2_ENABLED)


# -- migrate_images_to_r2 --------------------------------------------------

import tempfile  # noqa: E402
from io import StringIO  # noqa: E402
from pathlib import Path  # noqa: E402

from django.core.management import call_command  # noqa: E402
from django.core.management.base import CommandError  # noqa: E402

PHOTO_A = "photo-1513072064285-240f87fa81e8"
PHOTO_B = "photo-1584186028062-637e3e77318d"
FETCH = "medialib.management.commands.migrate_images_to_r2.fetch_image"


def unsplash(photo_id, w=1200, h=900):
    return f"https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w={w}&h={h}&q=70"


@override_settings(**R2_TEST_SETTINGS)
class MigrateImagesTests(TestCase):
    def setUp(self):
        self.s3 = mock.MagicMock()
        self.s3.head_object.side_effect = client_error()  # nothing in the bucket yet
        patcher = mock.patch("medialib.r2.get_client", return_value=self.s3)
        patcher.start()
        self.addCleanup(patcher.stop)

        country = pm.TourCountry.objects.create(slug="turkey", name="Turkey")
        self.tour = pm.TourPackage.objects.create(
            slug="istanbul", name="Istanbul", country=country, strap="s", blurb="b", image_url=unsplash(PHOTO_A),
            duration_days=7, from_price_gbp="900.00", season="Spring",
        )
        pm.TourGalleryImage.objects.create(package=self.tour, sort_order=0, image_url=unsplash(PHOTO_B, 900, 700))
        self.own = pm.TourPackage.objects.create(
            slug="own", name="Own photo", country=country, strap="s", blurb="b",
            image_url="https://cdn.example.test/library/2026/09/abcd1234-mine.jpg",
            duration_days=3, from_price_gbp="500.00", season="Summer",
        )
        self.scan = tempfile.TemporaryDirectory()
        self.addCleanup(self.scan.cleanup)

    def run_command(self, *args):
        out = StringIO()
        call_command("migrate_images_to_r2", "--scan-dir", self.scan.name, *args, stdout=out, stderr=StringIO())
        return out.getvalue()

    def uploaded(self):
        return {c.kwargs["Key"]: c.kwargs for c in self.s3.put_object.call_args_list}

    def test_uploads_three_webp_sizes_per_photo_with_long_cache(self):
        with mock.patch(FETCH, return_value=png_bytes((3000, 2000))):
            self.run_command()
        uploaded = self.uploaded()
        self.assertEqual(len(uploaded), 6)  # 2 photos x 3 widths
        for width in r2.PHOTO_WIDTHS:
            call = uploaded[r2.photo_key(PHOTO_A, width)]
            self.assertEqual(call["ContentType"], "image/webp")
            self.assertIn("immutable", call["CacheControl"])
            image = Image.open(BytesIO(call["Body"]))
            self.assertEqual((image.format, image.width, image.height), ("WEBP", width, round(2000 * width / 3000)))

    def test_small_sources_are_never_upscaled(self):
        with mock.patch(FETCH, return_value=png_bytes((500, 300))):
            self.run_command()
        for width in r2.PHOTO_WIDTHS:
            self.assertEqual(Image.open(BytesIO(self.uploaded()[r2.photo_key(PHOTO_A, width)]["Body"])).size, (500, 300))

    def test_records_one_library_entry_per_photo(self):
        with mock.patch(FETCH, return_value=png_bytes((3000, 2000))):
            self.run_command()
        asset = MediaAsset.objects.get(key=r2.photo_key(PHOTO_A))
        self.assertEqual((asset.width, asset.height, asset.content_type), (2400, 1600, "image/webp"))
        self.assertEqual(MediaAsset.objects.count(), 2)

    def test_rewrites_database_urls_and_leaves_other_urls_alone(self):
        with mock.patch(FETCH, return_value=png_bytes((3000, 2000))):
            self.run_command()
        self.tour.refresh_from_db()
        self.own.refresh_from_db()
        self.assertEqual(self.tour.image_url, f"https://cdn.example.test/photos/{PHOTO_A}/2400.webp")
        self.assertEqual(self.tour.gallery.get().image_url, f"https://cdn.example.test/photos/{PHOTO_B}/2400.webp")
        self.assertEqual(self.own.image_url, "https://cdn.example.test/library/2026/09/abcd1234-mine.jpg")

    def test_is_idempotent_and_does_not_redownload(self):
        with mock.patch(FETCH, return_value=png_bytes((3000, 2000))) as fetch:
            self.run_command()
            self.assertEqual(fetch.call_count, 2)
            self.s3.head_object.side_effect = None
            self.s3.head_object.return_value = {"ContentLength": 1000}
            self.s3.put_object.reset_mock()
            out = self.run_command()
        self.assertEqual(fetch.call_count, 2)
        self.s3.put_object.assert_not_called()
        self.assertEqual(MediaAsset.objects.count(), 2)
        self.assertIn("rewrote 0 database URL", out)

    def test_dry_run_changes_nothing(self):
        with mock.patch(FETCH) as fetch:
            out = self.run_command("--dry-run")
        fetch.assert_not_called()
        self.s3.put_object.assert_not_called()
        self.assertFalse(MediaAsset.objects.exists())
        self.tour.refresh_from_db()
        self.assertIn("images.unsplash.com", self.tour.image_url)
        self.assertIn("would upload 2 photo(s)", out)
        self.assertIn("rewrite 2 database URL", out)

    def test_a_failed_download_is_reported_and_leaves_that_url_alone(self):
        def fetch(photo_id):
            if photo_id == PHOTO_B:
                raise CommandError("boom")
            return png_bytes((3000, 2000))

        with mock.patch(FETCH, side_effect=fetch):
            with self.assertRaises(CommandError) as ctx:
                self.run_command()
        self.assertIn(PHOTO_B, str(ctx.exception))
        self.tour.refresh_from_db()
        self.assertIn("cdn.example.test/photos", self.tour.image_url)
        self.assertIn("images.unsplash.com", self.tour.gallery.get().image_url)

    def test_photo_ids_in_source_files_are_migrated_even_if_not_in_the_database(self):
        (Path(self.scan.name) / "page.tsx").write_text('stock("photo-1500534623283-312aade485b7", 900, 700)')
        (Path(self.scan.name) / "node_modules").mkdir()
        (Path(self.scan.name) / "node_modules" / "skip.ts").write_text('"photo-1111111111111-aaaaaaaaaaaa"')
        with mock.patch(FETCH, return_value=png_bytes((3000, 2000))):
            self.run_command()
        keys = set(self.uploaded())
        self.assertIn(r2.photo_key("photo-1500534623283-312aade485b7", 640), keys)
        self.assertNotIn(r2.photo_key("photo-1111111111111-aaaaaaaaaaaa", 640), keys)

    @override_settings(R2_ENABLED=False)
    def test_refuses_to_run_without_r2_unless_dry_run(self):
        with self.assertRaises(CommandError):
            self.run_command()
        self.run_command("--dry-run")


@override_settings(**R2_TEST_SETTINGS)
class MigratedPhotoLifecycleTests(TestCase):
    def setUp(self):
        self.staff = User.objects.create_user(username="staff", password="pw", is_staff=True)
        self.client.login(username="staff", password="pw")
        self.s3 = mock.MagicMock()
        patcher = mock.patch("medialib.r2.get_client", return_value=self.s3)
        patcher.start()
        self.addCleanup(patcher.stop)

    def test_helpers(self):
        self.assertEqual(r2.photo_key(PHOTO_A), f"photos/{PHOTO_A}/2400.webp")
        self.assertEqual(r2.photo_url(PHOTO_A), f"https://cdn.example.test/photos/{PHOTO_A}/2400.webp")
        self.assertEqual(r2.keys_to_delete("library/2026/09/abcd1234-x.png"), ["library/2026/09/abcd1234-x.png"])
        self.assertEqual(
            r2.keys_to_delete(r2.photo_key(PHOTO_A)), [r2.photo_key(PHOTO_A, w) for w in (640, 1280, 2400)],
        )
        self.assertTrue(r2.is_photo_variant(r2.photo_key(PHOTO_A, 640)))
        self.assertFalse(r2.is_photo_variant(r2.photo_key(PHOTO_A, 2400)))

    def test_deleting_a_migrated_photo_removes_every_size(self):
        asset = MediaAsset.objects.create(
            key=r2.photo_key(PHOTO_A), original_name=f"{PHOTO_A}.webp", content_type="image/webp", size=10,
        )
        self.client.post(reverse("medialib_delete"), {"ids": [str(asset.id)], "confirm": "1"})
        deleted = {c.kwargs["Key"] for c in self.s3.delete_object.call_args_list}
        self.assertEqual(deleted, {r2.photo_key(PHOTO_A, w) for w in (640, 1280, 2400)})
        self.assertFalse(MediaAsset.objects.exists())

    def test_sync_adopts_only_the_largest_size_of_a_migrated_photo(self):
        self.s3.get_paginator.return_value.paginate.return_value = [{"Contents": [
            {"Key": r2.photo_key(PHOTO_A, 640), "Size": 1},
            {"Key": r2.photo_key(PHOTO_A, 1280), "Size": 2},
            {"Key": r2.photo_key(PHOTO_A, 2400), "Size": 3},
            {"Key": "original_images/wagtail.png", "Size": 4},
            {"Key": "dashboard-upload.jpg", "Size": 5},
        ]}]
        call_command("sync_media_library", stdout=StringIO())
        self.assertEqual(
            set(MediaAsset.objects.values_list("key", flat=True)), {r2.photo_key(PHOTO_A, 2400), "dashboard-upload.jpg"},
        )
