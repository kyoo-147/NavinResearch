# Deployment boundary

The production Nginx vhost must:

1. use a dedicated Navin access log;
2. serve `/visitor-map/` publicly with short-cache aggregate JSON;
3. protect every `/visitor-insights/` file with authentication and `no-store`;
4. keep raw logs, SQLite, GeoLite2, credentials, and operator scripts outside the web root;
5. preserve the ACME challenge route and current security headers;
6. stage a complete release, validate it, and atomically switch both the `current` and `ecosystem-current` symlinks to the same release.

`nginx.conf` is an include-style example, not a full replacement for the production server block.

## Public release artifact

Never archive or copy the repository wholesale. After `npm test`, build the public artifact from the reviewed allowlist:

```bash
npm run release:build -- release/candidate
npm run release:verify -- release/candidate
```

`scripts/build-release.mjs` derives generated parent URLs from the root sitemap, product pages from `products/site-manifest.json`, and adds only explicit runtime assets. It requires tracked regular files, compares every artifact file byte-for-byte with its source, rejects missing or extra files, and fails closed on source modules, operator code, internal Markdown, credentials, databases, logs, demo analytics JSON, and source design PNGs. The self-test is part of `npm test` and proves that an injected internal file is rejected.

Archive the contents of the verified candidate directory, not its parent and not the Git checkout. On the server, extract into a new immutable release directory, verify the expected public file inventory before switching either symlink, then point both `current` and `ecosystem-current` to the same release. Production analytics JSON remains outside the release and is served by the exact Nginx aliases in `nginx.conf`.

## Aggregate schedule

`navin-analytics.service` and `navin-analytics.timer` are hardened systemd examples for a five-minute aggregate refresh over the previous rotated Navin log plus the active log. Install the aggregator, production runner, DB-IP updater, and a dedicated virtual environment under `/opt/navin-analytics`, then install all four analytics units under `/etc/systemd/system`.

The service is condition-gated until all operator prerequisites exist:

- `/var/lib/navin-analytics/DBIP-City-Lite.mmdb`
- `/var/log/nginx/navinresearch.access.log`
- `/opt/navin-analytics/.venv/bin/python`
- `/opt/navin-analytics/run-production.sh`

Keep the server and daily log rotation aligned to UTC; otherwise a rotated local-day log may split a UTC deduplication day. The public and private JSON paths, MMDB, SQLite database, and raw logs stay operator-owned and outside immutable releases. Never seed production with the repository demo JSON.
