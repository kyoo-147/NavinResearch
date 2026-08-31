# Lightweight visitor geography

This is a **real, privacy-preserving production pipeline**, not a demo feed or an event-level tracking application. It reads Navin Research Nginx access logs, resolves an operator-installed MMDB, and writes daily aggregates to SQLite and static JSON. Production refreshes every five minutes from the previous rotated log plus the active log, so the current day converges as requests arrive without storing an individual trail.

## Privacy boundary

- IP addresses exist only in process memory while the input log is parsed.
- A visitor is deduplicated by exact IP within a single log day; no IP or hash is written to SQLite.
- The database stores only daily location counts.
- Public JSON contains every country/day total, including countries with one visitor.
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
  --mmdb /var/lib/navin-analytics/DBIP-City-Lite.mmdb \
  --provider "DB-IP City Lite" \
  --public-json /var/lib/navin-analytics/public.json \
  --private-json /var/lib/navin-analytics/private.json \
  --retention-days 0 \
  --minimum 1
```

`--retention-days 0` preserves the complete aggregate history and is the production default. A positive value remains available for an explicit operator retention policy. The dashboards default to all-time totals by summing daily unique counts; this is intentionally described as recorded visitors rather than cross-day unique people because no stable identifier is retained.

The exporter writes each JSON file through a same-directory temporary file and atomic `os.replace`. Public and private payloads share `schemaVersion`, `batchId`, and `generatedAt` metadata from one database snapshot. Their final renames are necessarily sequential; the two audiences do not depend on cross-file consistency, and operators should alert on a batch-ID mismatch if they compare them. Production Nginx serves these stable operator-owned files through exact `alias` locations, so analytics refreshes never mutate an immutable site release.

## Geolocation databases

The database is not included in git or the web release. Production uses **DB-IP City Lite**, downloaded directly from DB-IP and stored as `/var/lib/navin-analytics/DBIP-City-Lite.mmdb`. It is approximate, updated monthly, and licensed under CC BY 4.0. `analytics/update-dbip-city.sh` performs a validated atomic refresh; the public map provides the required DB-IP attribution.

MaxMind GeoLite2 City remains supported when an operator supplies it and accepts its license obligations. Pass the matching `--provider` value so exported data never misstates its source.

Official references:

- https://db-ip.com/db/lite.php
- https://db-ip.com/db/download/ip-to-city-lite

- https://dev.maxmind.com/geoip/geolite2-free-geolocation-data/
- https://www.maxmind.com/en/geolite/eula
- https://support.maxmind.com/knowledge-base/articles/sell-or-display-data-from-geolite-databases-and-web-services

When GeoLite2 powers the public map, preserve this attribution in the project notices:

> This product includes GeoLite2 Data created by MaxMind, available from https://www.maxmind.com.

When DB-IP City Lite powers the map, preserve this attribution in the project notices:

> IP Geolocation by DB-IP — https://db-ip.com

## Production schedule

`analytics/run-production.sh` concatenates the previous uncompressed rotated log, when present, and the active Navin log in chronological order. The importer replaces days represented in that input, so repeated five-minute runs are idempotent and the active day updates without accumulating raw identifiers. `navin-analytics.timer` drives this refresh; `navin-analytics-db.timer` refreshes DB-IP City Lite monthly.

Production readiness requires all of the following:

- `demo` is `false` in both published JSON files;
- both files share the latest `batchId` and `generatedAt`;
- `geolocationProvider` names the installed database;
- the service and timer are active and the last service result succeeded;
- `/visitor-insights/data.json` remains authenticated and `no-store`.

## Why polling instead of WebSockets

A static JSON refresh every few minutes is enough for coarse visitor geography. It removes an always-on application server, WebSocket state, reconnection logic, and a larger attack surface. The public map polls a cacheable aggregate, never an individual event stream.

## Tests

```bash
uv run python -m unittest analytics.test_aggregate -v
node --check visitor-map/script.js
node --check visitor-insights/script.js
```
