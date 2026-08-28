FROM python:3.11-slim

WORKDIR /app/backend

# System deps for `playwright install --with-deps chromium` are pulled in by
# that command itself; git is used by remediation/ for local diffing.
RUN apt-get update && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Chromium is what report/pdf.py drives for PDF export — installed with its
# OS-level deps since the slim base is missing the shared libraries a
# headless browser needs to launch at all.
RUN playwright install --with-deps chromium

COPY . .

# db.py's DB_PATH is backend/data/sentinels.db, resolved relative to this
# file — get_connection() creates the directory on first use, so this only
# needs to exist as a mount point for the platform's persistent disk.
RUN mkdir -p /app/backend/data

EXPOSE 8000

# $PORT is injected by the host at runtime (Render, and most other PaaS) —
# never hardcode a port a health check might not actually be listening on.
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
