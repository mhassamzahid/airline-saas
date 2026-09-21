import uuid

from django.conf import settings
from django.db import models
from django.template.defaultfilters import filesizeformat

from . import r2


class MediaAsset(models.Model):
    """One image in the R2 bucket, recorded when it's uploaded through the
    library so listing, search and "who uploaded it" don't need a bucket scan."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    key = models.CharField(max_length=512, unique=True, help_text="Object key in the R2 bucket.")
    original_name = models.CharField(max_length=255)
    content_type = models.CharField(max_length=100)
    size = models.PositiveBigIntegerField(help_text="Bytes.")
    width = models.PositiveIntegerField(null=True, blank=True)
    height = models.PositiveIntegerField(null=True, blank=True)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="+",
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]
        verbose_name = "image"
        verbose_name_plural = "images"

    def __str__(self):
        return self.original_name

    @property
    def url(self) -> str:
        return r2.public_url(self.key)

    @property
    def human_size(self) -> str:
        return filesizeformat(self.size)

    @property
    def dimensions(self) -> str:
        return f"{self.width} x {self.height}" if self.width and self.height else "unknown"
