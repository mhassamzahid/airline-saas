import os

from .base import *  # noqa: F401,F403

DEBUG = False

# Required: base.py defines no SECRET_KEY, only dev.py does (a throwaway
# value for local dev). Fails loudly on a missing/empty var rather than
# silently booting with an insecure default.
SECRET_KEY = os.environ["SECRET_KEY"]

ALLOWED_HOSTS = [h.strip() for h in os.environ.get("ALLOWED_HOSTS", "").split(",") if h.strip()]

# When deployed as a Vercel Service alongside the Next.js frontend
# (see ../../../vercel.json), Vercel injects the shared production domain as
# VERCEL_PROJECT_PRODUCTION_URL (or VERCEL_URL for preview deployments) --
# trust that host automatically so ALLOWED_HOSTS doesn't need to duplicate it.
_vercel_host = os.environ.get("VERCEL_PROJECT_PRODUCTION_URL") or os.environ.get("VERCEL_URL")
if _vercel_host and _vercel_host not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(_vercel_host)

try:
    from .local import *  # noqa: F401,F403
except ImportError:
    pass
