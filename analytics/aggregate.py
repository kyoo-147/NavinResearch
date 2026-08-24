#!/usr/bin/env python3
"""Offline, privacy-first Nginx access-log aggregator.

Raw log lines are streamed and discarded. SQLite stores only time bucket + GeoLite
labels and counts; it never stores an IP address, URL, user agent, or trajectory.
"""
from __future__ import annotations
import argparse, datetime as dt, json, re, sqlite3, sys
from pathlib import Path

LOG_RE = re.compile(r'^(?P<ip>\S+) \S+ \S+ \[(?P<when>[^]]+)\] "(?P<method>\S+) (?P<path>\S+)(?: HTTP/[^\"]+)?" (?P<status>\d{3}) \S+ "(?P<ref>[^\"]*)" "(?P<ua>[^\"]*)"')
COMBINED_RE = re.compile(r'^(?P<ip>\S+) \S+ \S+ \[(?P<when>[^]]+)\] "(?P<method>\S+) (?P<path>\S+)(?: HTTP/[^\"]+)?" (?P<status>\d{3})')
STATIC = re.compile(r'\.(?:css|js|mjs|map|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|txt|xml|json|webmanifest)(?:\?|$)', re.I)
BOTS = re.compile(r'bot|crawler|spider|slurp|headless|curl|wget|uptime|monitor|lighthouse', re.I)
DATE_FORMATS = ("%d/%b/%Y:%H:%M:%S %z", "%d/%b/%Y:%H:%M:%S")

SCHEMA = """CREATE TABLE IF NOT EXISTS visits (
 day TEXT NOT NULL, country_code TEXT NOT NULL, country TEXT NOT NULL,
 region TEXT NOT NULL, city TEXT NOT NULL, count INTEGER NOT NULL,
 PRIMARY KEY(day, country_code, country, region, city)
)"""

def parse_line(line: str):
    match = LOG_RE.match(line.rstrip("\n")) or COMBINED_RE.match(line.rstrip("\n"))
    if not match: return None
    data = match.groupdict()
    if data["method"] not in {"GET", "HEAD"} or not (200 <= int(data["status"]) < 400): return None
    if STATIC.search(data["path"].split("#", 1)[0]) or BOTS.search(data.get("ua") or ""): return None
    for fmt in DATE_FORMATS:
        try: stamp = dt.datetime.strptime(data["when"], fmt); break
        except ValueError: stamp = None
    if stamp is None: return None
    return data["ip"], stamp.date().isoformat(), data["path"].split("?", 1)[0]

def lookup(ip: str, reader=None):
    if reader is None: return ("ZZ", "Unknown", "Unknown", "Unknown")
    try:
        record = reader.city(ip)
        country = record.country.name or "Unknown"
        code = (record.country.iso_code or "ZZ").upper()
        region = record.subdivisions.most_specific.name or "Unknown"
        city = record.city.name or "Unknown"
        return code, country, region, city
    except Exception:
        return ("ZZ", "Unknown", "Unknown", "Unknown")

def open_db(path):
    db = sqlite3.connect(path); db.execute(SCHEMA); db.commit(); return db

def ingest(lines, db, reader=None):
    counts = {}
    for line in lines:
        parsed = parse_line(line)
        if not parsed: continue
        ip, day, _ = parsed
        key = (day, *lookup(ip, reader)); counts[key] = counts.get(key, 0) + 1
    db.executemany(
        "INSERT INTO visits VALUES (?,?,?,?,?,?) ON CONFLICT(day,country_code,country,region,city) DO UPDATE SET count=count+excluded.count",
        ((*key, value) for key, value in counts.items()),
    )
    db.commit(); return sum(counts.values())

def purge(db, retention_days: int, today=None):
    today = today or dt.date.today(); cutoff = today - dt.timedelta(days=retention_days)
    db.execute("DELETE FROM visits WHERE day < ?", (cutoff.isoformat(),)); db.commit()

def export(db, destination, minimum=5, detailed=False):
    rows = db.execute("SELECT day,country_code,country,region,city,count FROM visits ORDER BY day,country").fetchall()
    if detailed:
        payload = {"demo": False, "privacy": {"contains": ["daily location counts"], "excludes": ["raw IP", "URL", "user agent", "individual trajectory"]}, "rows": [dict(zip(("day","countryCode","country","region","city","visits"), row)) for row in rows]}
    else:
        by_country = {}
        for day, code, country, region, city, count in rows:
            key = (day, code, country); by_country[key] = by_country.get(key, 0) + count
        visible = [dict(day=d, countryCode=c, country=n, visits=v) for (d,c,n),v in by_country.items() if v >= minimum]
        withheld = sum(v for (d,c,n),v in by_country.items() if v < minimum)
        payload = {"demo": False, "minimumGroupSize": minimum, "privacy": {"contains": ["daily country aggregates meeting threshold"], "excludes": ["raw IP", "city", "region", "URL", "user agent", "individual trajectory"]}, "withheldVisits": withheld, "rows": visible}
    Path(destination).write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")

def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("log", help="Nginx log file, or - for stdin")
    ap.add_argument("--db", default="analytics/visitors.sqlite3")
    ap.add_argument("--public-json", default="visitor-map/data.json")
    ap.add_argument("--private-json", default="visitor-insights/data.json")
    ap.add_argument("--mmdb", help="optional user-supplied GeoLite2-City.mmdb")
    ap.add_argument("--retention-days", type=int, default=90)
    ap.add_argument("--minimum", type=int, default=5)
    args = ap.parse_args(argv)
    reader = None
    if args.mmdb:
        try:
            from geoip2.database import Reader
            reader = Reader(args.mmdb)
        except ImportError: ap.error("--mmdb requires the optional geoip2 package")
    db = open_db(args.db)
    source = sys.stdin if args.log == "-" else open(args.log, encoding="utf-8", errors="replace")
    try: ingest(source, db, reader)
    finally:
        if source is not sys.stdin: source.close()
        if reader: reader.close()
    purge(db, args.retention_days); export(db, args.public_json, args.minimum); export(db, args.private_json, detailed=True); db.close()

if __name__ == "__main__": main()
