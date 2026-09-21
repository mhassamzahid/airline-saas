"""
One-time migration of the currently-hardcoded package content (previously
src/data/{umrah,hajj,tours,pakistan-tours}.ts) into the `packages` app's
tables. Safe to re-run: every row is `update_or_create`d, keyed by slug.
"""

from django.core.management.base import BaseCommand

from packages.models import (
    UmrahCategory, UmrahHotel, UmrahRoomSharingOption, UmrahTransportTier,
    UmrahAddOnService, UmrahPricingSettings, UmrahPackage, UmrahPackageInclusion,
    UmrahPackageAddon,
    HajjPackage, HajjAccommodation, HajjItineraryStep, HajjGalleryImage,
    TourCountry, TourPackage, TourPackageGroupType, TourInclusion, TourExclusion,
    TourHotelStay, TourItineraryStep, TourGalleryImage,
    PakistanRegion, PakistanTourPackage, PakistanTourPackageGroupType,
    PakistanTourInclusion, PakistanTourStay, PakistanTourItineraryStep,
    PakistanTourGalleryImage,
)


def stock(image_id, w=1200, h=1400):
    # Once `migrate_images_to_r2` has copied a photo into the bucket, seed with
    # the R2 URL so re-running this command doesn't put the Unsplash link back.
    from medialib import r2
    from medialib.models import MediaAsset

    if MediaAsset.objects.filter(key=r2.photo_key(image_id)).exists():
        return r2.photo_url(image_id)
    return f"https://images.unsplash.com/{image_id}?auto=format&fit=crop&w={w}&h={h}&q=70"


class Command(BaseCommand):
    help = "Seeds Umrah/Hajj/Tours/Pakistan Tours package data from the original hardcoded content."

    def handle(self, *args, **options):
        self.seed_umrah()
        self.seed_hajj()
        self.seed_tours()
        self.seed_pakistan_tours()
        self.stdout.write(self.style.SUCCESS("Seeded packages app."))

    # -- Umrah ------------------------------------------------------------

    def seed_umrah(self):
        categories = {}
        for slug, name, strap, description in [
            ("economy", "Economy", "Everything you need, nothing you don't",
             "3-star hotels a short walk or shuttle from the Haram, shared transport, visa handled."),
            ("standard", "Standard", "The one most travellers choose",
             "4-star hotels closer to both mosques, a choice of room sharing, and priority visa processing."),
            ("premium", "Premium", "5-star, throughout",
             "5-star hotels within a few minutes' walk of the Haram, private transport, and a dedicated guide."),
        ]:
            categories[slug], _ = UmrahCategory.objects.update_or_create(
                slug=slug, defaults=dict(name=name, strap=strap, description=description),
            )

        hotels = {}
        hotel_rows = [
            ("makkah-ajyad-heritage", "Ajyad Heritage Hotel", "Makkah", "800m from the Haram", 800, 3, 45,
             ["economy"], "photo-1591604129939-f1efa4d9f7fa"),
            ("makkah-zam-residence", "Zam Residence", "Makkah", "450m from the Haram", 450, 4, 85,
             ["economy", "standard"], "photo-1584186028062-637e3e77318d"),
            ("makkah-grand-plaza", "Makkah Grand Plaza", "Makkah", "250m from the Haram", 250, 4, 120,
             ["standard"], "photo-1650446647974-451d05d2136d"),
            ("makkah-al-haram-view", "Al Haram View Towers", "Makkah", "100m from the Haram", 100, 5, 240,
             ["premium"], "photo-1565330770968-0240c0046ce3"),
            ("makkah-kaaba-vista", "Kaaba Vista Suites", "Makkah", "50m from the Haram", 50, 5, 310,
             ["premium"], "photo-1591604129939-f1efa4d9f7fa"),
            ("madinah-ansar", "Al Ansar Courtyard", "Madinah", "700m from the Masjid", 700, 3, 38,
             ["economy"], "photo-1513072064285-240f87fa81e8"),
            ("madinah-rawdah", "Rawdah Hotel", "Madinah", "350m from the Masjid", 350, 4, 75,
             ["economy", "standard"], "photo-1591604129939-f1efa4d9f7fa"),
            ("madinah-taiba-grand", "Taiba Grand", "Madinah", "200m from the Masjid", 200, 4, 105,
             ["standard"], "photo-1650446647974-451d05d2136d"),
            ("madinah-nabawi-suites", "Al Masjid Nabawi Suites", "Madinah", "80m from the Masjid", 80, 5, 210,
             ["premium"], "photo-1584186028062-637e3e77318d"),
            ("madinah-rawdah-royal", "Rawdah Royal Residence", "Madinah", "40m from the Masjid", 40, 5, 265,
             ["premium"], "photo-1513072064285-240f87fa81e8"),
        ]
        for slug, name, city, dist_label, dist_m, stars, price, cats, img in hotel_rows:
            hotel, _ = UmrahHotel.objects.update_or_create(
                slug=slug,
                defaults=dict(
                    name=name, city=city, distance_label=dist_label, distance_meters=dist_m,
                    star_rating=stars, price_per_night_gbp=price, image_url=stock(img, 900, 700),
                ),
            )
            hotel.categories.set([categories[c] for c in cats])
            hotels[slug] = hotel

        room_sharing = {}
        for slug, label, note, divisor in [
            ("quad", "Quad sharing", "4 to a room, the lowest cost per person", 4),
            ("triple", "Triple sharing", "3 to a room", 3),
            ("double", "Double sharing", "2 to a room", 2),
            ("single", "Single room", "The whole room to yourself", 1),
        ]:
            room_sharing[slug], _ = UmrahRoomSharingOption.objects.update_or_create(
                slug=slug, defaults=dict(label=label, note=note, divisor=divisor),
            )

        transport = {}
        for slug, label, note, price in [
            ("shared", "Shared coach", "Air-conditioned group coach between cities", 35),
            ("private", "Private car", "A car for your party only", 110),
            ("luxury", "Luxury SUV", "A premium vehicle, for a smaller party", 220),
        ]:
            transport[slug], _ = UmrahTransportTier.objects.update_or_create(
                slug=slug, defaults=dict(label=label, note=note, price_gbp=price),
            )

        addons = {}
        for key, title, note, price, unit in [
            ("insurance", "Travel insurance", "Medical cover and trip protection for the whole party", 22, "person"),
            ("sim", "Local SIM card", "Data and calls from landing to departure", 12, "person"),
            ("laundry", "Laundry service", "Handled at the hotel every few days", 30, "booking"),
            ("guide", "Guide services", "A guide with your group for the rites, not shared", 60, "booking"),
            ("mealUpgrade", "Meal plan upgrade", "Half board upgraded to full board, both hotels", 18, "day"),
        ]:
            addons[key], _ = UmrahAddOnService.objects.update_or_create(
                slug=key, defaults=dict(title=title, note=note, price_gbp=price, pricing_unit=unit),
            )

        UmrahPricingSettings.load()

        packages = [
            dict(slug="standard", name="Standard", strap="The one most families choose",
                 blurb="10 nights, 4-star hotels a short walk from both mosques, shared transport throughout.",
                 image="photo-1591604129939-f1efa4d9f7fa", popular=True, from_price=1499, season="Year-round",
                 category="standard", duration=10, makkah="makkah-zam-residence", madinah="madinah-rawdah",
                 room="quad", transport_tier="shared", addon_keys=[],
                 inclusions=["Umrah visa processing", "4-star hotels in Makkah and Madinah, quad sharing",
                             "Shared airport and intercity transport", "Group Ziyarat tour"]),
            dict(slug="premium", name="Premium", strap="A week, done properly",
                 blurb="7 nights, 5-star hotels within a few minutes of the Haram, private intercity transport, triple sharing.",
                 image="photo-1565330770968-0240c0046ce3", popular=False, from_price=2199, season="Winter",
                 category="premium", duration=7, makkah="makkah-al-haram-view", madinah="madinah-nabawi-suites",
                 room="triple", transport_tier="private", addon_keys=[],
                 inclusions=["Everything in Standard", "5-star hotels within a few minutes of both Harams, triple sharing",
                             "Private intercity transport", "Priority visa processing"]),
            dict(slug="deluxe", name="Deluxe", strap="5-star, throughout",
                 blurb="7 nights, 5-star hotels within a few minutes of the Haram, a private guide, and every transfer handled.",
                 image="photo-1650446647974-451d05d2136d", popular=False, from_price=3499, season="Year-round",
                 category="premium", duration=7, makkah="makkah-al-haram-view", madinah="madinah-nabawi-suites",
                 room="double", transport_tier="luxury", addon_keys=["guide"],
                 inclusions=["Everything in Premium", "5-star hotels within a few minutes of both Harams, double sharing",
                             "Luxury private transport throughout", "A dedicated guide for the whole trip"]),
            dict(slug="economy-7-quad", name="Economy Essentials", strap="Everything you need, nothing you don't",
                 blurb="7 nights, 3-star hotels a short walk or shuttle from both mosques, quad sharing, shared transport.",
                 image="photo-1513072064285-240f87fa81e8", popular=False, from_price=949, season="Summer",
                 category="economy", duration=7, makkah="makkah-ajyad-heritage", madinah="madinah-ansar",
                 room="quad", transport_tier="shared", addon_keys=[],
                 inclusions=["Umrah visa processing", "3-star hotels in Makkah and Madinah, quad sharing",
                             "Shared airport and intercity transport"]),
            dict(slug="economy-21-triple", name="Economy Extended", strap="Three weeks, comfortably paced",
                 blurb="21 nights, 4-star hotels a short walk from both mosques, triple sharing, shared transport.",
                 image="photo-1584186028062-637e3e77318d", popular=False, from_price=1650, season="Autumn",
                 category="economy", duration=21, makkah="makkah-zam-residence", madinah="madinah-rawdah",
                 room="triple", transport_tier="shared", addon_keys=[],
                 inclusions=["Umrah visa processing", "4-star hotels in Makkah and Madinah, triple sharing",
                             "Shared airport and intercity transport"]),
            dict(slug="economy-30-quad", name="Economy Extended, 30 nights", strap="The lowest cost per night",
                 blurb="30 nights, 3-star hotels a short walk or shuttle from both mosques, quad sharing, shared transport.",
                 image="photo-1513072064285-240f87fa81e8", popular=False, from_price=1899, season="Winter",
                 category="economy", duration=30, makkah="makkah-ajyad-heritage", madinah="madinah-ansar",
                 room="quad", transport_tier="shared", addon_keys=[],
                 inclusions=["Umrah visa processing", "3-star hotels in Makkah and Madinah, quad sharing",
                             "Shared airport and intercity transport"]),
            dict(slug="economy-15-ramadan", name="Economy Ramadan, 15 nights", strap="A budget-conscious Ramadan Umrah",
                 blurb="15 nights over Ramadan, 4-star hotels a short walk from both mosques, quad sharing, shared transport.",
                 image="photo-1584186028062-637e3e77318d", popular=False, from_price=1799, season="Ramadan",
                 category="economy", duration=15, makkah="makkah-zam-residence", madinah="madinah-rawdah",
                 room="quad", transport_tier="shared", addon_keys=[],
                 inclusions=["Umrah visa processing", "4-star hotels in Makkah and Madinah, quad sharing",
                             "Shared airport and intercity transport"]),
            dict(slug="standard-15-double", name="Standard, 15 nights", strap="A fortnight, closer in",
                 blurb="15 nights, 4-star hotels within a few minutes of both mosques, double sharing, shared transport.",
                 image="photo-1650446647974-451d05d2136d", popular=False, from_price=2299, season="Spring",
                 category="standard", duration=15, makkah="makkah-grand-plaza", madinah="madinah-taiba-grand",
                 room="double", transport_tier="shared", addon_keys=[],
                 inclusions=["Umrah visa processing", "4-star hotels in Makkah and Madinah, double sharing",
                             "Shared airport and intercity transport"]),
            dict(slug="standard-21-triple", name="Standard Extended, 21 nights", strap="Three weeks, closer in",
                 blurb="21 nights, 4-star hotels a short walk from both mosques, triple sharing, private transport.",
                 image="photo-1591604129939-f1efa4d9f7fa", popular=False, from_price=2650, season="Autumn",
                 category="standard", duration=21, makkah="makkah-zam-residence", madinah="madinah-rawdah",
                 room="triple", transport_tier="private", addon_keys=[],
                 inclusions=["Umrah visa processing", "4-star hotels in Makkah and Madinah, triple sharing",
                             "Private intercity transport"]),
            dict(slug="premium-15-single", name="Premium, 15 nights, single room", strap="The whole room to yourself",
                 blurb="15 nights, 5-star hotels within 50m of both mosques, a private room, luxury transport throughout.",
                 image="photo-1565330770968-0240c0046ce3", popular=False, from_price=4899, season="Winter",
                 category="premium", duration=15, makkah="makkah-kaaba-vista", madinah="madinah-rawdah-royal",
                 room="single", transport_tier="luxury", addon_keys=[],
                 inclusions=["Everything in Premium", "5-star hotels within 50m of both Harams, a private room",
                             "Luxury private transport throughout"]),
            dict(slug="premium-10-ramadan", name="Premium Ramadan, 10 nights", strap="5-star, over Ramadan",
                 blurb="10 nights over Ramadan, 5-star hotels within a few minutes of the Haram, private transport, double sharing.",
                 image="photo-1650446647974-451d05d2136d", popular=False, from_price=3299, season="Ramadan",
                 category="premium", duration=10, makkah="makkah-al-haram-view", madinah="madinah-nabawi-suites",
                 room="double", transport_tier="private", addon_keys=[],
                 inclusions=["Everything in Premium", "5-star hotels within a few minutes of both Harams, double sharing",
                             "Private intercity transport", "Priority visa processing"]),
        ]

        for p in packages:
            pkg, _ = UmrahPackage.objects.update_or_create(
                slug=p["slug"],
                defaults=dict(
                    name=p["name"], strap=p["strap"], blurb=p["blurb"],
                    image_url=stock(p["image"], 1200, 900),
                    category=categories[p["category"]], duration_days=p["duration"],
                    makkah_hotel=hotels[p["makkah"]], madinah_hotel=hotels[p["madinah"]],
                    room_sharing=room_sharing[p["room"]], transport_tier=transport[p["transport_tier"]],
                    season=p["season"], from_price_gbp=p["from_price"], popular=p["popular"],
                ),
            )
            pkg.inclusions.all().delete()
            UmrahPackageInclusion.objects.bulk_create([
                UmrahPackageInclusion(package=pkg, sort_order=i, text=t)
                for i, t in enumerate(p["inclusions"])
            ])
            pkg.default_addons.all().delete()
            UmrahPackageAddon.objects.bulk_create([
                UmrahPackageAddon(package=pkg, addon_service=addons[k]) for k in p["addon_keys"]
            ])

        self.stdout.write("Seeded Umrah: %d categories, %d hotels, %d packages" % (
            len(categories), len(hotels), len(packages)))

    # -- Hajj ---------------------------------------------------------------

    def seed_hajj(self):
        standard_itinerary = [
            ("Arrival & Madinah", "Land in Jeddah or Madinah and settle in for a few days of prayer at Masjid an-Nabawi before the rites begin."),
            ("Move to Makkah", "Transfer to Makkah, perform Umrah, and rest ahead of the 8th of Dhul Hijjah."),
            ("Mina & Arafat", "Move to Mina on the 8th, spend the Day of Arafat in prayer on the 9th, then continue to Muzdalifah overnight."),
            ("Jamarat & Eid", "Stone the Jamarat, sacrifice, and shave or trim hair to exit Ihram over the days of Eid al-Adha."),
            ("Return to Makkah", "Perform Tawaf al-Ifadah and the farewell Tawaf before the journey home."),
        ]

        packages = [
            dict(slug="government-scheme", name="Government Scheme Hajj", package_type="Government Scheme",
                 strap="The regulated quota route",
                 blurb="Allocated through the government Hajj quota rather than a private operator: larger groups, a longer stay, and the lowest cost per place, with every stage handled by an accredited group leader.",
                 image="photo-1650446647974-451d05d2136d",
                 gallery=["photo-1584186028062-637e3e77318d", "photo-1513072064285-240f87fa81e8", "photo-1591604129939-f1efa4d9f7fa"],
                 nights=35, from_price=4200, quota="500 places", deadline="4 months before the season",
                 transport="Government-organised coach transfers between all sites",
                 meals="Full board, standard set menu",
                 guide="A government-appointed group leader shared across the wider party",
                 accommodation=[
                     ("Makkah", "Shared government-allocated housing, around 1.2km from the Haram"),
                     ("Madinah", "Shared housing, around 900m from Masjid an-Nabawi"),
                     ("Mina", "Government-allocated tents, shared with the wider group"),
                     ("Arafat", "Shared canopy camp, allocated by zone"),
                 ]),
            dict(slug="private-economy", name="Private Economy Hajj", package_type="Private Economy",
                 strap="The one most pilgrims choose",
                 blurb="A private-operator package at a shorter duration than the government route: closer hotels, a smaller group, and a dedicated guide throughout, without the premium of a five-star tier.",
                 image="photo-1584186028062-637e3e77318d",
                 gallery=["photo-1650446647974-451d05d2136d", "photo-1565330770968-0240c0046ce3", "photo-1603491656337-3b491147917c"],
                 nights=15, from_price=5600, quota="150 places", deadline="6 months before the season",
                 transport="Private coach transfers, smaller group than the government scheme",
                 meals="Full board, buffet",
                 guide="A dedicated guide with the group for the whole trip",
                 accommodation=[
                     ("Makkah", "Quad-share hotel, around 500m from the Haram"),
                     ("Madinah", "Quad-share hotel, around 400m from Masjid an-Nabawi"),
                     ("Mina", "Air-conditioned tents, shared"),
                     ("Arafat", "Shaded canopy with seating, shared"),
                 ]),
            dict(slug="private-premium", name="Private Premium Hajj", package_type="Private Premium",
                 strap="Five-star, throughout",
                 blurb="Five-star hotels within a short walk of both mosques, upgraded and less crowded tents at Mina and Arafat, and private transfers rather than shared coaches, for the shortest and most comfortable route through the rites.",
                 image="photo-1565330770968-0240c0046ce3",
                 gallery=["photo-1513072064285-240f87fa81e8", "photo-1591604129939-f1efa4d9f7fa", "photo-1584186028062-637e3e77318d"],
                 nights=12, from_price=9800, quota="60 places", deadline="8 months before the season",
                 transport="Private vehicles between every site, no shared coaches",
                 meals="Full board, à la carte where the site allows",
                 guide="A dedicated personal guide, plus scholar-led sessions",
                 accommodation=[
                     ("Makkah", "5-star hotel, within 200m of the Haram"),
                     ("Madinah", "5-star hotel, within 150m of Masjid an-Nabawi"),
                     ("Mina", "Upgraded, less crowded air-conditioned tents"),
                     ("Arafat", "Private canopy with premium catering"),
                 ]),
        ]

        for p in packages:
            pkg, _ = HajjPackage.objects.update_or_create(
                slug=p["slug"],
                defaults=dict(
                    name=p["name"], package_type=p["package_type"], strap=p["strap"], blurb=p["blurb"],
                    image_url=stock(p["image"], 1200, 800), nights=p["nights"], from_price_gbp=p["from_price"],
                    quota_text=p["quota"], application_deadline=p["deadline"], transport_text=p["transport"],
                    meals_text=p["meals"], guide_text=p["guide"],
                ),
            )
            pkg.accommodation.all().delete()
            HajjAccommodation.objects.bulk_create([
                HajjAccommodation(package=pkg, sort_order=i, location=loc, detail=detail)
                for i, (loc, detail) in enumerate(p["accommodation"])
            ])
            pkg.itinerary.all().delete()
            HajjItineraryStep.objects.bulk_create([
                HajjItineraryStep(package=pkg, sort_order=i, day_label="", title=title, body=body)
                for i, (title, body) in enumerate(standard_itinerary)
            ])
            pkg.gallery.all().delete()
            HajjGalleryImage.objects.bulk_create([
                HajjGalleryImage(package=pkg, sort_order=i, image_url=stock(img, 1200, 900))
                for i, img in enumerate(p["gallery"])
            ])

        self.stdout.write("Seeded Hajj: %d packages" % len(packages))

    # -- International Tours -------------------------------------------------

    def seed_tours(self):
        countries = {}
        for name in ["Turkey", "Thailand", "Dubai", "Malaysia", "Europe", "Egypt", "Maldives", "Indonesia"]:
            slug = name.lower().replace(" ", "-")
            countries[name], _ = TourCountry.objects.update_or_create(slug=slug, defaults=dict(name=name))

        packages = [
            dict(slug="istanbul-cappadocia-explorer", name="Istanbul & Cappadocia Explorer", country="Turkey",
                 strap="Two icons, one week",
                 blurb="From the Hagia Sophia and Blue Mosque to a sunrise hot-air balloon over Cappadocia's fairy chimneys, a week that pairs Istanbul's history with Anatolia's landscape.",
                 image="photo-1524231757912-21f4fe3a7200",
                 gallery=["photo-1541432901042-2d8bd64b4a9b", "photo-1522083165195-3424ed129620"],
                 duration=7, from_price=1150, group_types=["Individual", "Couple", "Family"], season="Spring", featured=True,
                 inclusions=["Return flights from London Gatwick", "6 nights across Istanbul and Cappadocia", "Daily breakfast",
                             "Bosphorus sunset cruise", "Cappadocia hot-air balloon ride", "Airport transfers"],
                 exclusions=["Lunches and dinners (except where noted)", "Turkey e-visa fee", "Travel insurance", "Personal spending"],
                 hotels=[("Istanbul", "Sultanahmet Heritage Hotel", 4, "A 5-minute walk from the Blue Mosque, in the heart of the old city."),
                         ("Cappadocia", "Cave Suites Göreme", 4, "Traditional cave-style rooms with balloon-launch views.")],
                 itinerary=[("Day 1", "Arrival in Istanbul", "Land in Istanbul and transfer to your hotel in Sultanahmet, with the evening free to explore."),
                            ("Days 2–3", "Old city & Bosphorus", "Visit the Hagia Sophia, Blue Mosque and Topkapi Palace, then cruise the Bosphorus at sunset."),
                            ("Day 4", "Fly to Cappadocia", "Morning flight to Cappadocia and an afternoon exploring the Göreme Open-Air Museum."),
                            ("Day 5", "Sunrise balloon flight", "An early hot-air balloon ride over the fairy chimneys, followed by a free afternoon."),
                            ("Days 6–7", "Underground city & departure", "Visit an underground city and Uçhisar Castle before flying home via Istanbul.")]),
            dict(slug="bangkok-phuket-getaway", name="Bangkok & Phuket Getaway", country="Thailand",
                 strap="Temples, then beaches",
                 blurb="Five days of temples, markets and street food in Bangkok, then five days unwinding on Phuket's beaches.",
                 image="photo-1508009603885-50cf7c579365",
                 gallery=["photo-1552465011-b4e21bf6e79a", "photo-1517090504586-fde19ea6066f"],
                 duration=10, from_price=1550, group_types=["Couple", "Family"], season="Winter", featured=True,
                 inclusions=["Return flights from London Gatwick", "4 nights in Bangkok, 5 nights in Phuket", "Daily breakfast",
                             "Grand Palace & Wat Arun guided tour", "Island-hopping speedboat trip", "Airport and inter-city transfers"],
                 exclusions=["Lunches and dinners (except where noted)", "Thailand entry requirements/fees", "Travel insurance", "Optional spa treatments"],
                 hotels=[("Bangkok", "Riverside Bangkok Hotel", 4, "On the Chao Phraya river, a short boat ride from the Grand Palace."),
                         ("Phuket", "Patong Beachfront Resort", 4, "Steps from Patong Beach, with a pool facing the Andaman Sea.")],
                 itinerary=[("Day 1", "Arrival in Bangkok", "Land in Bangkok and settle in along the river, with the night market close by."),
                            ("Days 2–3", "Temples & river", "Visit the Grand Palace, Wat Arun and Wat Pho, then a longtail boat ride through the klongs."),
                            ("Day 4", "Floating markets", "A morning at the Damnoen Saduak floating market before an afternoon at leisure."),
                            ("Day 5", "Fly to Phuket", "Short flight south to Phuket and check-in at your beachfront resort."),
                            ("Days 6–8", "Islands & beaches", "Island-hopping by speedboat to Phi Phi and James Bond Island, with beach days between."),
                            ("Days 9–10", "Free time & departure", "A final day at leisure before flying home.")]),
            dict(slug="dubai-city-desert-escape", name="Dubai City & Desert Escape", country="Dubai",
                 strap="Skyline by day, dunes by night",
                 blurb="A short break pairing Dubai's skyline and souks with an evening desert safari under open sky.",
                 image="photo-1512453979798-5ea266f8880c",
                 gallery=["photo-1451337516015-6b6e9a44a8a3", "photo-1522083165195-3424ed129620"],
                 duration=5, from_price=780, group_types=["Individual", "Couple"], season="Year-round", featured=False,
                 inclusions=["Return flights from London Gatwick", "4 nights in a central Dubai hotel", "Daily breakfast",
                             "Burj Khalifa \"At the Top\" entry", "Desert safari with BBQ dinner", "Airport transfers"],
                 exclusions=["Lunches and dinners (except the desert safari)", "UAE tourist visa fee", "Travel insurance", "Optional Dubai Mall aquarium / Ski Dubai"],
                 hotels=[("Dubai", "Downtown Dubai Hotel", 4, "Walking distance to the Dubai Mall and Burj Khalifa fountains.")],
                 itinerary=[("Day 1", "Arrival in Dubai", "Land in Dubai and check in downtown, with the fountain show a short walk away in the evening."),
                            ("Day 2", "Burj Khalifa & Old Dubai", "Morning at the top of the Burj Khalifa, afternoon in the souks and an abra crossing of Dubai Creek."),
                            ("Day 3", "Desert safari", "Dune bashing, camel riding and a BBQ dinner under the stars in the Arabian desert."),
                            ("Day 4", "Free day", "A day at leisure for the beach, the Mall, or an optional excursion."),
                            ("Day 5", "Departure", "Free morning before your onward flight.")]),
            dict(slug="kuala-lumpur-langkawi", name="Kuala Lumpur & Langkawi", country="Malaysia",
                 strap="City towers, island beaches",
                 blurb="Three nights in Kuala Lumpur beneath the Petronas Towers, then four on Langkawi's beaches.",
                 image="photo-1596422846543-75c6fc197f07",
                 gallery=["photo-1520454974749-611b7248ffdb", "photo-1517090504586-fde19ea6066f"],
                 duration=7, from_price=1050, group_types=["Family", "Group"], season="Summer", featured=False,
                 inclusions=["Return flights from London Gatwick", "3 nights in Kuala Lumpur, 4 nights in Langkawi", "Daily breakfast",
                             "Petronas Towers observation deck", "Langkawi cable car & island-hopping tour", "Airport and inter-city transfers"],
                 exclusions=["Lunches and dinners (except where noted)", "Malaysia entry requirements/fees", "Travel insurance", "Optional watersports"],
                 hotels=[("Kuala Lumpur", "KLCC Tower Hotel", 4, "Facing the Petronas Towers and KLCC park."),
                         ("Langkawi", "Pantai Cenang Beach Resort", 4, "Beachfront on Pantai Cenang, Langkawi's liveliest stretch.")],
                 itinerary=[("Day 1", "Arrival in Kuala Lumpur", "Land in KL and settle in near the Petronas Towers."),
                            ("Days 2–3", "City & culture", "Visit the Petronas Towers observation deck, Batu Caves and the Central Market."),
                            ("Day 4", "Fly to Langkawi", "Short flight to Langkawi and an afternoon on Pantai Cenang beach."),
                            ("Days 5–6", "Cable car & islands", "Ride the SkyCab to Gunung Mat Cincang, then a boat trip through the Kilim Geoforest mangroves."),
                            ("Day 7", "Departure", "A final morning at the beach before flying home.")]),
            dict(slug="classic-europe-grand-tour", name="Classic Europe: Paris, Rome & Barcelona", country="Europe",
                 strap="Three cities, one grand tour",
                 blurb="A two-week grand tour by rail and air: Paris's boulevards, Rome's ruins, and Barcelona's Gaudí skyline.",
                 image="photo-1502602898657-3e91760cbb34",
                 gallery=["photo-1552832230-c0197dd311b5", "photo-1522083165195-3424ed129620"],
                 duration=14, from_price=2200, group_types=["Individual", "Group"], season="Summer", featured=True,
                 inclusions=["Return flights from London Gatwick + inter-city travel", "4 nights each in Paris, Rome and Barcelona", "Daily breakfast",
                             "Eiffel Tower summit access", "Colosseum skip-the-line tour", "Sagrada Família entry"],
                 exclusions=["Lunches and dinners (except where noted)", "Schengen visa fee where applicable", "Travel insurance", "Optional day trips"],
                 hotels=[("Paris", "Le Marais Boutique Hotel", 4, "A short walk from Notre-Dame and the Seine."),
                         ("Rome", "Trastevere Residenza", 4, "In Rome's most walkable neighbourhood, near the river."),
                         ("Barcelona", "Eixample Design Hotel", 4, "Close to the Sagrada Família and Passeig de Gràcia.")],
                 itinerary=[("Days 1–4", "Paris", "The Louvre, the Eiffel Tower, Montmartre and a Seine river cruise."),
                            ("Day 5", "Travel to Rome", "Fly from Paris to Rome and settle into Trastevere."),
                            ("Days 6–9", "Rome", "The Colosseum and Roman Forum, the Vatican Museums and Sistine Chapel, and a day trip to Pompeii."),
                            ("Day 10", "Travel to Barcelona", "Fly on to Barcelona for the final leg."),
                            ("Days 11–13", "Barcelona", "Gaudí's Sagrada Família and Park Güell, the Gothic Quarter and a beach afternoon."),
                            ("Day 14", "Departure", "Fly home from Barcelona.")]),
            dict(slug="cairo-nile-cruise", name="Cairo & Nile Cruise", country="Egypt",
                 strap="Pyramids to Aswan, by river",
                 blurb="The Giza Pyramids and the Egyptian Museum in Cairo, then four nights cruising the Nile from Luxor to Aswan.",
                 image="photo-1568322445389-f64ac2515020",
                 gallery=["photo-1517090504586-fde19ea6066f", "photo-1522083165195-3424ed129620"],
                 duration=10, from_price=1650, group_types=["Family", "Group"], season="Autumn", featured=False,
                 inclusions=["Return flights from London Gatwick", "3 nights in Cairo, 4-night Nile cruise (full board), 2 nights in Luxor",
                             "Giza Pyramids & Sphinx tour", "Valley of the Kings entry", "Karnak & Philae Temple visits", "Airport and rail transfers"],
                 exclusions=["Drinks on the cruise", "Egypt visa fee", "Travel insurance", "Optional Abu Simbel excursion"],
                 hotels=[("Cairo", "Giza View Hotel", 4, "Rooftop views of the Pyramids from central Giza."),
                         ("Nile Cruise", "MS Nile Premium", 4, "A four-night full-board cruise between Luxor and Aswan.")],
                 itinerary=[("Days 1–3", "Cairo & Giza", "The Pyramids of Giza, the Sphinx, and the treasures of the Egyptian Museum."),
                            ("Day 4", "Fly to Luxor", "Fly south to Luxor and board your Nile cruise ship."),
                            ("Days 5–8", "Nile cruise", "Sail from Luxor to Aswan, stopping at the Valley of the Kings, Karnak Temple and Kom Ombo."),
                            ("Day 9", "Aswan & High Dam", "Visit the Aswan High Dam and the Philae Temple before disembarking."),
                            ("Day 10", "Departure", "Fly home via Cairo.")]),
            dict(slug="maldives-overwater-escape", name="Maldives Overwater Escape", country="Maldives",
                 strap="Five nights, one lagoon",
                 blurb="An overwater villa on a private atoll, built entirely around doing as little as possible.",
                 image="photo-1573843981267-be1999ff37cd",
                 gallery=["photo-1522083165195-3424ed129620", "photo-1517090504586-fde19ea6066f"],
                 duration=5, from_price=2400, group_types=["Couple"], season="Year-round", featured=False,
                 inclusions=["Return flights + seaplane transfer", "5 nights in an overwater villa", "Half board", "Snorkelling equipment", "One sunset dolphin cruise"],
                 exclusions=["Spa treatments", "Motorised watersports", "Alcoholic drinks", "Travel insurance"],
                 hotels=[("South Ari Atoll", "Lagoon Overwater Villas", 5, "Private-pool overwater villas reached by a 30-minute seaplane.")],
                 itinerary=[("Day 1", "Arrival by seaplane", "Land in Malé and take a scenic seaplane transfer straight to the resort."),
                            ("Days 2–4", "At leisure", "Days built around the lagoon: snorkelling, a sunset dolphin cruise, and time on the villa deck."),
                            ("Day 5", "Departure", "Seaplane back to Malé for your flight home.")]),
            dict(slug="bali-retreat-ubud-culture", name="Bali Retreat & Ubud Culture", country="Indonesia",
                 strap="Rice terraces and temple gates",
                 blurb="Four nights among Ubud's rice terraces and temples, then three unwinding on Seminyak's beaches.",
                 image="photo-1518548419970-58e3b4079ab2",
                 gallery=["photo-1537996194471-e657df975ab4", "photo-1522083165195-3424ed129620"],
                 duration=7, from_price=1300, group_types=["Individual", "Couple"], season="Winter", featured=False,
                 inclusions=["Return flights from London Gatwick", "4 nights in Ubud, 3 nights in Seminyak", "Daily breakfast",
                             "Tegallalang rice terrace & temple tour", "One yoga class", "Airport transfers"],
                 exclusions=["Lunches and dinners (except where noted)", "Bali visa-on-arrival fee", "Travel insurance", "Spa treatments"],
                 hotels=[("Ubud", "Ubud Rice Terrace Villas", 4, "Private villas set among working rice paddies."),
                         ("Seminyak", "Seminyak Beach Hotel", 4, "A short walk to Seminyak's beach clubs and sunset bars.")],
                 itinerary=[("Day 1", "Arrival in Ubud", "Land in Bali and transfer to Ubud, with the evening free."),
                            ("Days 2–3", "Rice terraces & temples", "Visit the Tegallalang rice terraces, the Sacred Monkey Forest and Tirta Empul water temple."),
                            ("Day 4", "Yoga & culture", "A morning yoga class, then an afternoon exploring Ubud's art markets."),
                            ("Day 5", "Transfer to Seminyak", "Drive south to Seminyak and settle in by the beach."),
                            ("Days 6–7", "Beach & departure", "Beach days and sunset drinks before flying home.")]),
        ]

        for p in packages:
            pkg, _ = TourPackage.objects.update_or_create(
                slug=p["slug"],
                defaults=dict(
                    name=p["name"], country=countries[p["country"]], strap=p["strap"], blurb=p["blurb"],
                    image_url=stock(p["image"], 1200, 800), duration_days=p["duration"], from_price_gbp=p["from_price"],
                    season=p["season"], featured=p["featured"],
                ),
            )
            pkg.group_types.all().delete()
            TourPackageGroupType.objects.bulk_create([
                TourPackageGroupType(package=pkg, group_type=g) for g in p["group_types"]
            ])
            pkg.inclusions.all().delete()
            TourInclusion.objects.bulk_create([
                TourInclusion(package=pkg, sort_order=i, text=t) for i, t in enumerate(p["inclusions"])
            ])
            pkg.exclusions.all().delete()
            TourExclusion.objects.bulk_create([
                TourExclusion(package=pkg, sort_order=i, text=t) for i, t in enumerate(p["exclusions"])
            ])
            pkg.hotels.all().delete()
            TourHotelStay.objects.bulk_create([
                TourHotelStay(package=pkg, sort_order=i, city=c, hotel_name=n, rating=r, detail=d)
                for i, (c, n, r, d) in enumerate(p["hotels"])
            ])
            pkg.itinerary.all().delete()
            TourItineraryStep.objects.bulk_create([
                TourItineraryStep(package=pkg, sort_order=i, day_label=day, title=title, body=body)
                for i, (day, title, body) in enumerate(p["itinerary"])
            ])
            pkg.gallery.all().delete()
            TourGalleryImage.objects.bulk_create([
                TourGalleryImage(package=pkg, sort_order=i, image_url=stock(img, 1200, 900))
                for i, img in enumerate(p["gallery"])
            ])

        self.stdout.write("Seeded Tours: %d countries, %d packages" % (len(countries), len(packages)))

    # -- Pakistan Tours -------------------------------------------------------

    def seed_pakistan_tours(self):
        regions = {}
        for name in ["Hunza/Skardu", "Swat", "Murree", "Naran/Kaghan", "Northern Areas", "Neelum Valley", "Fairy Meadows", "Kalash Valley"]:
            slug = name.lower().replace("/", "-").replace(" ", "-")
            regions[name], _ = PakistanRegion.objects.update_or_create(slug=slug, defaults=dict(name=name))

        packages = [
            dict(slug="hunza-skardu-valley-explorer", name="Hunza & Skardu Valley Explorer", region="Hunza/Skardu",
                 strap="Glacial lakes and switchback roads",
                 blurb="The Karakoram Highway into Hunza's terraced orchards, then on to Skardu's glacial lakes and cold desert, on Pakistan's most dramatic mountain road.",
                 image="photo-1571401835393-8c5f35328320",
                 gallery=["photo-1635016288720-c52507b9a717", "photo-1603491656337-3b491147917c"],
                 duration=7, from_price=950, group_types=["Individual", "Group"], card_tag="Group", season="Summer", featured=True,
                 inclusions=["Return flights to Islamabad", "6 nights across Hunza and Skardu", "Private 4x4 transport on the Karakoram Highway",
                             "Daily breakfast", "Attabad Lake boat ride", "Local guide throughout"],
                 stays=[("Hunza", "Hotel", "Karakoram View Hotel", 4, "Orchard-facing rooms looking out over the Hunza valley."),
                        ("Skardu", "Guesthouse", "Shangrila-area Guesthouse", 3, "A short drive from Shangrila Resort and Upper Kachura Lake.")],
                 itinerary=[("Day 1", "Fly to Islamabad", "Land in Islamabad and rest overnight before the mountain drive."),
                            ("Days 2–3", "Karakoram Highway to Hunza", "Drive the Karakoram Highway via Besham and Chilas, stopping at the Nanga Parbat viewpoint, into Hunza."),
                            ("Day 4", "Hunza sightseeing", "Baltit Fort, Attabad Lake and the Hunza viewpoint at Eagle's Nest."),
                            ("Days 5–6", "On to Skardu", "Cross into Skardu on the Karakoram Highway, visiting Upper Kachura Lake and Shangrila."),
                            ("Day 7", "Return flight", "Fly back from Skardu to Islamabad and onward home.")]),
            dict(slug="swat-valley-family-retreat", name="Swat Valley Family Retreat", region="Swat",
                 strap="Pakistan's Switzerland, for the whole family",
                 blurb="Green valleys, orchards and the Mingora bazaar, at a gentle pace built for travelling with kids and grandparents alike.",
                 image="photo-1500534623283-312aade485b7",
                 gallery=["photo-1602740337312-e28c0b7d27f9", "photo-1635016288720-c52507b9a717"],
                 duration=5, from_price=520, group_types=["Family"], card_tag="Family", season="Spring", featured=True,
                 inclusions=["Return flights to Islamabad", "4 nights in Swat", "Private family-sized transport",
                             "Daily breakfast", "Malam Jabba chairlift ride", "Kalam & Mahodand Lake day trip"],
                 stays=[("Mingora", "Hotel", "Swat Continental Hotel", 4, "Family rooms with a garden and playground on site.")],
                 itinerary=[("Day 1", "Arrival in Swat", "Drive up from Islamabad into the Swat valley, with the afternoon free to settle in."),
                            ("Day 2", "Malam Jabba", "A chairlift ride and easy walks at Malam Jabba, Pakistan's best-known hill resort."),
                            ("Days 3–4", "Kalam & Mahodand Lake", "A day trip north to Kalam and the turquoise waters of Mahodand Lake."),
                            ("Day 5", "Mingora & departure", "A morning at the Mingora bazaar and Swat Museum before the drive back to Islamabad.")]),
            dict(slug="murree-hills-honeymoon-escape", name="Murree Hills Honeymoon Escape", region="Murree",
                 strap="Pine forests, close to home",
                 blurb="A short, easy break in the pine-covered hills above Islamabad, timed for winter snow on the Mall Road and the Patriata chairlift.",
                 image="photo-1441974231531-c6227db76b6e",
                 gallery=["photo-1635016288720-c52507b9a717", "photo-1602740337312-e28c0b7d27f9"],
                 duration=3, from_price=340, group_types=["Couple"], card_tag="Honeymoon", season="Winter", featured=False,
                 inclusions=["Return flights to Islamabad", "2 nights in Murree", "Private transfers", "Daily breakfast",
                             "Patriata (New Murree) chairlift tickets"],
                 stays=[("Murree", "Resort", "Pine View Couples Resort", 4, "A quiet resort just off Mall Road with valley-facing rooms.")],
                 itinerary=[("Day 1", "Arrival in Murree", "Drive up from Islamabad into the hills and settle in, with Mall Road a short walk away."),
                            ("Day 2", "Patriata & viewpoints", "Ride the Patriata chairlift and visit the Kashmir Point and Pindi Point viewpoints."),
                            ("Day 3", "Departure", "A final morning on Mall Road before the drive back to Islamabad.")]),
            dict(slug="naran-kaghan-saiful-malook", name="Naran, Kaghan & Saif-ul-Malook", region="Naran/Kaghan",
                 strap="Alpine lakes and glacier views",
                 blurb="The Kaghan valley's alpine lakes, ending at Saif-ul-Malook beneath the Malika Parbat glacier, jeep ride included.",
                 image="photo-1439853949127-fa647821eba0",
                 gallery=["photo-1635016288720-c52507b9a717", "photo-1603491656337-3b491147917c"],
                 duration=5, from_price=610, group_types=["Family", "Group"], card_tag="Family", season="Summer", featured=True,
                 inclusions=["Return flights to Islamabad", "4 nights across Kaghan and Naran", "Private transport + jeep transfer to Saif-ul-Malook",
                             "Daily breakfast", "Shogran & Siri Paye chairlift"],
                 stays=[("Naran", "Hotel", "Lake View Naran Hotel", 3, "Riverside rooms in the centre of Naran bazaar."),
                        ("Saif-ul-Malook", "Camping", "Lakeside Camp", None, "Tented camp on the shore, for the one night closest to the lake.")],
                 itinerary=[("Day 1", "Arrival in Kaghan", "Drive up from Islamabad through Balakot into the Kaghan valley."),
                            ("Day 2", "Shogran & Siri Paye", "A chairlift and jeep trip up to the alpine meadows of Siri Paye."),
                            ("Days 3–4", "Naran & Saif-ul-Malook", "Jeep up to Lake Saif-ul-Malook beneath Malika Parbat, with a night camping by the lake."),
                            ("Day 5", "Departure", "Drive back down through Balakot to Islamabad.")]),
            dict(slug="grand-northern-areas-circuit", name="Grand Northern Areas Circuit", region="Northern Areas",
                 strap="Everything, in ten days",
                 blurb="A full loop of the north: Naran, Hunza, Skardu and the Karakoram Highway, for groups who want the whole circuit in one trip.",
                 image="photo-1519681393784-d120267933ba",
                 gallery=["photo-1602740337312-e28c0b7d27f9", "photo-1635016288720-c52507b9a717"],
                 duration=10, from_price=1250, group_types=["Group"], card_tag="Group", season="Summer", featured=False,
                 inclusions=["Return flights to Islamabad", "9 nights across Naran, Hunza and Skardu", "Private 4x4 convoy throughout",
                             "Daily breakfast", "Attabad Lake, Khunjerab Pass and Saif-ul-Malook visits", "Dedicated group guide"],
                 stays=[("Naran", "Hotel", "Lake View Naran Hotel", 3, "Riverside rooms in the centre of Naran bazaar."),
                        ("Hunza", "Hotel", "Karakoram View Hotel", 4, "Orchard-facing rooms looking out over the Hunza valley."),
                        ("Skardu", "Guesthouse", "Shangrila-area Guesthouse", 3, "A short drive from Shangrila Resort and Upper Kachura Lake.")],
                 itinerary=[("Days 1–2", "Islamabad to Naran", "Drive north via Balakot into Kaghan, with a jeep trip to Saif-ul-Malook."),
                            ("Days 3–4", "Naran to Hunza", "Continue on the Karakoram Highway via Chilas and the Nanga Parbat viewpoint into Hunza."),
                            ("Day 5", "Hunza sightseeing", "Baltit Fort, Attabad Lake and a drive toward the Khunjerab Pass."),
                            ("Days 6–7", "Hunza to Skardu", "Cross into Skardu, visiting Upper Kachura Lake and Shangrila."),
                            ("Days 8–9", "Skardu exploring", "The Deosai Plains or Shigar Fort, depending on the season and road conditions."),
                            ("Day 10", "Fly home", "Fly from Skardu back to Islamabad and onward home.")]),
            dict(slug="neelum-valley-honeymoon-trail", name="Neelum Valley Honeymoon Trail", region="Neelum Valley",
                 strap="Pine forests along the Neelum river",
                 blurb="A quieter alternative to Kaghan: the Neelum river valley's forests and waterfalls, timed for autumn colour.",
                 image="photo-1506905925346-21bda4d32df4",
                 gallery=["photo-1603491656337-3b491147917c", "photo-1602740337312-e28c0b7d27f9"],
                 duration=5, from_price=580, group_types=["Couple"], card_tag="Honeymoon", season="Autumn", featured=False,
                 inclusions=["Return flights to Islamabad", "4 nights in Neelum Valley", "Private transport",
                             "Daily breakfast", "Ratti Gali Lake jeep & trek day"],
                 stays=[("Kel", "Guesthouse", "Neelum Riverside Guesthouse", 3, "Wooden cabins on the riverbank, a short walk from the bazaar.")],
                 itinerary=[("Day 1", "Arrival in Neelum Valley", "Drive from Islamabad via Muzaffarabad into the Neelum valley."),
                            ("Days 2–3", "Sharda & Kel", "Visit Sharda's ruins and continue up-valley to Kel, along the Neelum river."),
                            ("Day 4", "Ratti Gali Lake", "A jeep ride and short trek up to the alpine Ratti Gali Lake."),
                            ("Day 5", "Departure", "Drive back to Islamabad via Muzaffarabad.")]),
            dict(slug="fairy-meadows-trek-camp", name="Fairy Meadows Trek & Camp", region="Fairy Meadows",
                 strap="Camping beneath Nanga Parbat",
                 blurb="A jeep track and a short trek to a meadow camp facing Nanga Parbat, the world's ninth-highest peak, for travellers happy to rough it for one incredible view.",
                 image="photo-1464822759023-fed622ff2c3b",
                 gallery=["photo-1635016288720-c52507b9a717", "photo-1603491656337-3b491147917c"],
                 duration=3, from_price=420, group_types=["Individual", "Couple"], card_tag="", season="Summer", featured=False,
                 inclusions=["Return flights to Islamabad", "2 nights camping at Fairy Meadows", "Jeep transfer from Raikot Bridge",
                             "All meals while camping", "Local guide for the trek"],
                 stays=[("Fairy Meadows", "Camping", "Nanga Parbat View Camp", None, "Tented camp with Nanga Parbat directly in view, no road access beyond Raikot Bridge.")],
                 itinerary=[("Day 1", "Drive & jeep to Fairy Meadows", "Drive the Karakoram Highway to Raikot Bridge, then jeep and a short trek up to the meadow."),
                            ("Day 2", "At the meadow", "A full day with Nanga Parbat views, and an optional hike to Beyal Camp for a closer glacier view."),
                            ("Day 3", "Descent & departure", "Trek and jeep back down to the highway for the return drive.")]),
            dict(slug="kalash-valleys-culture-tour", name="Kalash Valleys Culture Tour", region="Kalash Valley",
                 strap="Pakistan's most distinct culture",
                 blurb="Chitral and the three Kalash valleys, home to one of Pakistan's smallest and most distinct indigenous communities, timed around the autumn harvest.",
                 image="photo-1470770903676-69b98201ea1c",
                 gallery=["photo-1602740337312-e28c0b7d27f9", "photo-1635016288720-c52507b9a717"],
                 duration=7, from_price=780, group_types=["Individual", "Group"], card_tag="Group", season="Autumn", featured=False,
                 inclusions=["Return flights to Islamabad or Chitral", "6 nights across Chitral and the Kalash valleys", "Private transport",
                             "Daily breakfast", "Local Kalash guide"],
                 stays=[("Chitral", "Hotel", "Chitral Fort View Hotel", 3, "Overlooking the Chitral Fort and the Hindu Kush skyline."),
                        ("Bumburet", "Guesthouse", "Kalash Valley Guesthouse", 3, "Family-run guesthouse in the Bumburet valley.")],
                 itinerary=[("Days 1–2", "Fly to Chitral", "Fly into Chitral (weather permitting) or drive via the Lowari Tunnel, and settle in beneath the fort."),
                            ("Days 3–5", "The three Kalash valleys", "Visit Bumburet, Rumbur and Birir, the three Kalash valleys, with a local guide throughout."),
                            ("Day 6", "Chitral town", "Chitral Fort, the Shahi Mosque and the local bazaar."),
                            ("Day 7", "Departure", "Fly or drive back to Islamabad.")]),
        ]

        for p in packages:
            pkg, _ = PakistanTourPackage.objects.update_or_create(
                slug=p["slug"],
                defaults=dict(
                    name=p["name"], region=regions[p["region"]], strap=p["strap"], blurb=p["blurb"],
                    image_url=stock(p["image"], 1200, 800), duration_days=p["duration"], from_price_gbp=p["from_price"],
                    season=p["season"], featured=p["featured"], card_tag=p["card_tag"],
                ),
            )
            pkg.group_types.all().delete()
            PakistanTourPackageGroupType.objects.bulk_create([
                PakistanTourPackageGroupType(package=pkg, group_type=g) for g in p["group_types"]
            ])
            pkg.inclusions.all().delete()
            PakistanTourInclusion.objects.bulk_create([
                PakistanTourInclusion(package=pkg, sort_order=i, text=t) for i, t in enumerate(p["inclusions"])
            ])
            pkg.stays.all().delete()
            PakistanTourStay.objects.bulk_create([
                PakistanTourStay(package=pkg, sort_order=i, location=loc, stay_type=stype, name=name, rating=rating, detail=detail)
                for i, (loc, stype, name, rating, detail) in enumerate(p["stays"])
            ])
            pkg.itinerary.all().delete()
            PakistanTourItineraryStep.objects.bulk_create([
                PakistanTourItineraryStep(package=pkg, sort_order=i, day_label=day, title=title, body=body)
                for i, (day, title, body) in enumerate(p["itinerary"])
            ])
            pkg.gallery.all().delete()
            PakistanTourGalleryImage.objects.bulk_create([
                PakistanTourGalleryImage(package=pkg, sort_order=i, image_url=stock(img, 1200, 900))
                for i, img in enumerate(p["gallery"])
            ])

        self.stdout.write("Seeded Pakistan Tours: %d regions, %d packages" % (len(regions), len(packages)))
