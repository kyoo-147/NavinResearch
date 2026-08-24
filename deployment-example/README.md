# Deployment example

Serve `visitor-map/` publicly. Protect `visitor-insights/` with nginx Basic Auth or an equivalent private network/auth boundary. Never expose `analytics/visitors.sqlite3`, a MaxMind MMDB, `.htpasswd`, or raw logs. Use a least-privilege scheduled account, rotate logs, and set a retention policy appropriate to your privacy notice.

The example config is illustrative; validate with `nginx -t` before reload. Create credentials outside git with `htpasswd` (or your platform's secret manager). The public file is a static aggregate and can be cached; regenerate it periodically rather than running a WebSocket or always-on app.
