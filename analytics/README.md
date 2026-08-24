# Lightweight visitor geography

This is an **offline batch pipeline**, not an always-on analytics application. It reads one complete Navin Research Nginx access log, resolves an optional operator-supplied GeoLite2 City database, and writes privacy-preserving daily aggregates to SQLite and static JSON.

## Privacy boundary

- IP addresses exist only in process memory while the input log is parsed.
- A visitor is deduplicated by exact IP within a single log day; no IP or hash is written to SQLite.
- The database stores only daily location counts.
- Public JSON contains country totals only when the country/day group has at least `k=5` visitors.
- Private JSON contains daily country/region/city aggregates, never individual records, and must remain behind authentication.
- Nginx raw logs remain the most sensitive artifact. Restrict them to root/analytics operators and rotate/delete them quickly.

On the current direct-to-origin VPS, Nginx `$remote_addr` is the client address. If a CDN or reverse proxy is introduced, configure `set_real_ip_from` only for that provider's exact trusted CIDRs and use its verified client-address header before collecting data. A catch-all trusted proxy would allow spoofed addresses and invalid analytics.

IP geolocation is approximate and must not be used to identify a person, household, or street address.

## Run

Use a complete Navin-specific log whose accepted requests are chronological by UTC day. Every day present must include all log fragments for that UTC day; if rotation or parallel collection splits a day, concatenate and sort those fragments before running the batch. The importer validates this precondition and rolls back the entire database transaction on out-of-order input, so failed runs do not publish partial output. Reprocessing the same complete log is idempotent for every day present in that file.

```bash
uv run --with 'geoip2>=4.8,<5' analytics/aggregate.py \
  /var/log/nginx/navinresearch.access.log \
  --db /var/lib/navin-analytics/visitors.sqlite3 \
  --mmdb /var/lib/navin-analytics/GeoLite2-City.mmdb \
  --public-json /var/lib/navin-analytics/public.json \
  --private-json /var/lib/navin-analytics/private.json \
  --retention-days 90 \
  --minimum 5
```

The exporter writes each JSON file through a same-directory temporary file and atomic `os.replace`. Public and private payloads share `schemaVersion`, `batchId`, and `generatedAt` metadata from one database snapshot. Their final renames are necessarily sequential; the two audiences do not depend on cross-file consistency, and operators should alert on a batch-ID mismatch if they compare them. Production Nginx serves these stable operator-owned files through exact `alias` locations, so analytics refreshes never mutate an immutable site release.

## GeoLite2

The database is not included in git. Create a MaxMind account, accept the current GeoLite EULA, download `GeoLite2-City.mmdb` directly from MaxMind, keep it updated, and never expose or redistribute the MMDB.

Official references:

- https://dev.maxmind.com/geoip/geolite2-free-geolocation-data/
- https://www.maxmind.com/en/geolite/eula
- https://support.maxmind.com/knowledge-base/articles/sell-or-display-data-from-geolite-databases-and-web-services

When GeoLite2 powers the public map, keep the visible attribution:

> This product includes GeoLite2 Data created by MaxMind, available from https://www.maxmind.com.

## Why polling instead of WebSockets

A static JSON refresh every few minutes is enough for coarse visitor geography. It removes an always-on application server, WebSocket state, reconnection logic, and a larger attack surface. The public map polls a cacheable aggregate, never an individual event stream.

## Tests

```bash
uv run python -m unittest analytics.test_aggregate -v
node --check visitor-map/script.js
node --check visitor-insights/script.js
```
