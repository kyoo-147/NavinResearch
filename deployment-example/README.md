# Deployment boundary

The production Nginx vhost must:

1. use a dedicated Navin access log;
2. serve `/visitor-map/` publicly with short-cache aggregate JSON;
3. protect every `/visitor-insights/` file with authentication and `no-store`;
4. keep raw logs, SQLite, GeoLite2, credentials, and operator scripts outside the web root;
5. preserve the ACME challenge route and current security headers;
6. stage a complete release, validate it, and atomically switch the `current` symlink.

`nginx.conf` is an include-style example, not a full replacement for the production server block.

## Aggregate schedule

`navin-analytics.service` and `navin-analytics.timer` are hardened systemd examples for a five-minute aggregate refresh over the previous rotated Navin log plus the active log. Install the aggregator, production runner, DB-IP updater, and a dedicated virtual environment under `/opt/navin-analytics`, then install all four analytics units under `/etc/systemd/system`.

The service is condition-gated until all operator prerequisites exist:

- `/var/lib/navin-analytics/DBIP-City-Lite.mmdb`
- `/var/log/nginx/navinresearch.access.log`
- `/opt/navin-analytics/.venv/bin/python`
- `/opt/navin-analytics/run-production.sh`

Keep the server and daily log rotation aligned to UTC; otherwise a rotated local-day log may split a UTC deduplication day. The public and private JSON paths, MMDB, SQLite database, and raw logs stay operator-owned and outside immutable releases. Never seed production with the repository demo JSON.
