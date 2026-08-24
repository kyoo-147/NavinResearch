# Deployment boundary

The production Nginx vhost must:

1. use a dedicated Navin access log;
2. serve `/visitor-map/` publicly with short-cache aggregate JSON;
3. protect every `/visitor-insights/` file with authentication and `no-store`;
4. keep raw logs, SQLite, GeoLite2, credentials, and operator scripts outside the web root;
5. preserve the ACME challenge route and current security headers;
6. stage a complete release, validate it, and atomically switch the `current` symlink.

`nginx.conf` is an include-style example, not a full replacement for the production server block.
