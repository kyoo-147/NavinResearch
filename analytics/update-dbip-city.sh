#!/usr/bin/env bash
set -euo pipefail

state_dir=/var/lib/navin-analytics
python=/opt/navin-analytics/.venv/bin/python
release="${1:-$(date -u +%Y-%m)}"
url="https://download.db-ip.com/free/dbip-city-lite-${release}.mmdb.gz"
temporary="$(mktemp --tmpdir="$state_dir" .DBIP-City-Lite.XXXXXX.mmdb)"
compressed="${temporary}.gz"
trap 'rm -f "$temporary" "$compressed"' EXIT

curl --fail --location --silent --show-error \
  --user-agent 'NavinResearch-Analytics/1.0' \
  --referer 'https://db-ip.com/db/download/ip-to-city-lite' \
  "$url" -o "$compressed"
gzip -t "$compressed"
gzip -dc "$compressed" > "$temporary"

"$python" - "$temporary" <<'PY'
import sys
from geoip2.database import Reader
with Reader(sys.argv[1]) as reader:
    if "City" not in reader.metadata().database_type:
        raise SystemExit("download is not a city MMDB")
PY

chown root:root "$temporary"
chmod 0640 "$temporary"
mv -f "$temporary" "$state_dir/DBIP-City-Lite.mmdb"
