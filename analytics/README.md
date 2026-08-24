# Visitor geography analytics

This is an **offline** batch pipeline: it reads Nginx logs during a scheduled run, resolves an optional user-supplied GeoLite2 City MMDB, writes counts to SQLite, purges old rows, and emits JSON. There is no WebSocket or always-on analytics service; periodic static JSON is cheaper, easier to audit, and keeps the public surface cacheable.

Raw IPs, URLs, user agents, and event timestamps are not stored. The public export groups by country and suppresses each day/country group below `k=5`. The private export contains daily region/city counts and must be protected by Basic Auth (or equivalent). Demo JSON is synthetic and clearly marked.

```bash
python analytics/aggregate.py /var/log/nginx/access.log \
  --db /srv/navin/visitors.sqlite3 --mmdb /srv/private/GeoLite2-City.mmdb \
  --public-json visitor-map/data.json --private-json visitor-insights/data.json
```

GeoLite2 City is an optional MaxMind product. Download it directly from MaxMind, keep the database out of git, and review MaxMind's current license/EULA. If used, publish the required attribution: `This product includes GeoLite2 City data created by MaxMind, available from https://www.maxmind.com`. Do not redistribute the MMDB.
