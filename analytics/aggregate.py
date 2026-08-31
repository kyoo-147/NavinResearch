#!/usr/bin/env python3
"""Build privacy-preserving daily visitor geography from a complete Nginx log.

The process holds IP addresses only in memory long enough to deduplicate a visitor
within one UTC/log day. SQLite stores aggregate location counts only. Reprocessing
the same complete log is idempotent because days present in the input are replaced.
"""
from __future__ import annotations

import argparse
import datetime as dt
import ipaddress
import json
import os
import re
import sqlite3
import sys
import tempfile
import uuid
from collections import defaultdict
from pathlib import Path

LOG_RE = re.compile(
    r'^(?P<ip>\S+) \S+ \S+ \[(?P<when>[^]]+)\] '
    r'"(?P<method>\S+) (?P<path>\S+)(?: HTTP/[^\"]+)?" '
    r'(?P<status>\d{3}) \S+(?: "(?P<ref>[^\"]*)" "(?P<ua>[^\"]*)")?'
)
STATIC = re.compile(
    r'\.(?:css|js|mjs|map|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|txt|xml|json|webmanifest)(?:\?|$)',
    re.IGNORECASE,
)
BOTS = re.compile(
    r'bot|crawler|spider|slurp|headless|curl|wget|uptime|monitor|lighthouse|preview',
    re.IGNORECASE,
)
DATE_FORMATS = ("%d/%b/%Y:%H:%M:%S %z", "%d/%b/%Y:%H:%M:%S")

SCHEMA = """CREATE TABLE IF NOT EXISTS daily_locations (
 day TEXT NOT NULL,
 country_code TEXT NOT NULL,
 country TEXT NOT NULL,
 region TEXT NOT NULL,
 city TEXT NOT NULL,
 visitors INTEGER NOT NULL CHECK(visitors >= 0),
 CHECK(length(day) = 10),
 CHECK(length(country_code) = 2 AND country_code = upper(country_code)),
 PRIMARY KEY(day, country_code, country, region, city)
)"""


def parse_line(line: str):
    """Return a candidate page request or None; raw fields are never persisted."""
    match = LOG_RE.match(line.rstrip("\n"))
    if not match:
        return None
    data = match.groupdict()
    if data["method"] not in {"GET", "HEAD"}:
        return None
    if not 200 <= int(data["status"]) < 400:
        return None
    path = data["path"].split("#", 1)[0]
    if STATIC.search(path) or BOTS.search(data.get("ua") or ""):
        return None
    try:
        address = ipaddress.ip_address(data["ip"])
    except ValueError:
        return None
    if not address.is_global:
        return None
    stamp = None
    for date_format in DATE_FORMATS:
        try:
            stamp = dt.datetime.strptime(data["when"], date_format)
            break
        except ValueError:
            continue
    if stamp is None:
        return None
    if stamp.tzinfo is not None:
        stamp = stamp.astimezone(dt.timezone.utc)
    return str(address), stamp.date().isoformat()


def lookup(ip: str, reader=None):
    if reader is None:
        return ("ZZ", "Unknown", "Unknown", "Unknown")
    try:
        record = reader.city(ip)
        country = record.country.name or "Unknown"
        candidate_code = (record.country.iso_code or "ZZ").upper()
        code = candidate_code if re.fullmatch(r"[A-Z]{2}", candidate_code) else "ZZ"
        region = record.subdivisions.most_specific.name or "Unknown"
        city = record.city.name or "Unknown"
        return code, country, region, city
    except Exception:
        return ("ZZ", "Unknown", "Unknown", "Unknown")


def open_db(path):
    database = sqlite3.connect(path)
    database.execute(SCHEMA)
    database.commit()
    return database


def ingest(lines, database, reader=None):
    """Replace chronological log days while retaining raw IPs for one day only."""
    current_day = None
    visitors = defaultdict(set)
    location_cache = {}
    total = 0

    def flush_day():
        nonlocal total
        if current_day is None:
            return
        database.execute("DELETE FROM daily_locations WHERE day = ?", (current_day,))
        database.executemany(
            "INSERT INTO daily_locations VALUES (?,?,?,?,?,?)",
            ((*key, len(unique_ips)) for key, unique_ips in visitors.items()),
        )
        total += sum(len(unique_ips) for unique_ips in visitors.values())

    try:
        database.execute("BEGIN")
        for line in lines:
            parsed = parse_line(line)
            if not parsed:
                continue
            ip, day = parsed
            if current_day is not None and day < current_day:
                raise ValueError("input log must be chronological by UTC day")
            if current_day is not None and day != current_day:
                flush_day()
                visitors.clear()
                location_cache.clear()
            current_day = day
            location = location_cache.setdefault(ip, lookup(ip, reader))
            visitors[(day, *location)].add(ip)
        flush_day()
        database.commit()
    except Exception:
        database.rollback()
        raise
    return total


def purge(database, retention_days: int, today=None):
    today = today or dt.datetime.now(dt.timezone.utc).date()
    cutoff = today - dt.timedelta(days=retention_days)
    with database:
        database.execute("DELETE FROM daily_locations WHERE day < ?", (cutoff.isoformat(),))


def validate_rows(rows):
    """Reject malformed aggregate rows before publishing either JSON contract."""
    for day, code, country, region, city, visitors in rows:
        try:
            parsed_day = dt.date.fromisoformat(day)
        except (TypeError, ValueError) as error:
            raise ValueError(f"invalid aggregate day: {day!r}") from error
        if parsed_day.isoformat() != day:
            raise ValueError(f"invalid aggregate day: {day!r}")
        if not isinstance(code, str) or not re.fullmatch(r"[A-Z]{2}", code):
            raise ValueError(f"invalid country code: {code!r}")
        if not all(isinstance(label, str) and 0 < len(label) <= 200 for label in (country, region, city)):
            raise ValueError("invalid aggregate location label")
        if not isinstance(visitors, int) or isinstance(visitors, bool) or visitors < 0:
            raise ValueError(f"invalid visitor count: {visitors!r}")


def export(
    database,
    destination,
    minimum=1,
    detailed=False,
    provider="none",
    batch_id=None,
    generated_at=None,
):
    if minimum < 1:
        raise ValueError("minimum public group size must be at least 1")
    rows = database.execute(
        "SELECT day,country_code,country,region,city,visitors FROM daily_locations ORDER BY day,country"
    ).fetchall()
    validate_rows(rows)
    privacy = {
        "excludes": ["raw IP", "IP hash", "URL", "user agent", "individual trajectory"],
        "retentionUnit": "daily aggregate",
    }
    batch_id = batch_id or uuid.uuid4().hex
    generated_at = generated_at or dt.datetime.now(dt.timezone.utc).isoformat().replace("+00:00", "Z")
    base = {
        "schemaVersion": 1,
        "batchId": batch_id,
        "generatedAt": generated_at,
        "demo": False,
        "metric": "unique visitors per log day",
        "geolocationProvider": provider,
        "privacy": privacy,
    }

    if detailed:
        payload = {
            **base,
            "privacy": {**privacy, "contains": ["daily country, region, and city aggregates"]},
            "rows": [
                dict(zip(("day", "countryCode", "country", "region", "city", "visitors"), row))
                for row in rows
            ],
        }
    else:
        by_country = defaultdict(int)
        for day, code, country, _region, _city, visitors_count in rows:
            by_country[(day, code, country)] += visitors_count
        visible = [
            {"day": day, "countryCode": code, "country": country, "visitors": visitors_count}
            for (day, code, country), visitors_count in sorted(by_country.items())
            if visitors_count >= minimum
        ]
        withheld = sum(
            visitors_count
            for (_day, code, _country), visitors_count in by_country.items()
            if visitors_count < minimum
        )
        payload = {
            **base,
            "minimumGroupSize": minimum,
            "privacy": {**privacy, "contains": ["daily country aggregates"]},
            "withheldVisitors": withheld,
            "rows": visible,
        }

    destination_path = Path(destination)
    destination_path.parent.mkdir(parents=True, exist_ok=True)
    encoded = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
    temporary_name = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w",
            encoding="utf-8",
            dir=destination_path.parent,
            prefix=f".{destination_path.name}.",
            suffix=".tmp",
            delete=False,
        ) as temporary:
            temporary_name = temporary.name
            temporary.write(encoded)
            temporary.flush()
            os.fsync(temporary.fileno())
        os.replace(temporary_name, destination_path)
    finally:
        if temporary_name and os.path.exists(temporary_name):
            os.unlink(temporary_name)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("log", help="complete Nginx log file, or - for stdin")
    parser.add_argument("--db", default="analytics/visitors.sqlite3")
    parser.add_argument("--public-json", default="visitor-map/data.json")
    parser.add_argument("--private-json", default="visitor-insights/data.json")
    parser.add_argument("--mmdb", help="user-supplied GeoLite2-City.mmdb")
    parser.add_argument(
        "--provider",
        choices=("MaxMind GeoLite2 City", "DB-IP City Lite"),
        help="truthful provider label for the supplied MMDB (defaults to MaxMind for compatibility)",
    )
    parser.add_argument(
        "--retention-days",
        type=int,
        default=0,
        help="days of aggregates to retain; 0 keeps the complete available history",
    )
    parser.add_argument("--minimum", type=int, default=1)
    args = parser.parse_args(argv)

    if args.minimum < 1:
        parser.error("--minimum must be at least 1")
    if args.retention_days < 0:
        parser.error("--retention-days must be at least 0")

    reader = None
    provider = "none"
    if args.provider and not args.mmdb:
        parser.error("--provider requires --mmdb")
    if args.mmdb:
        try:
            from geoip2.database import Reader
        except ImportError:
            parser.error("--mmdb requires the optional geoip2 package")
        reader = Reader(args.mmdb)
        provider = args.provider or "MaxMind GeoLite2 City"

    database = open_db(args.db)
    source = sys.stdin if args.log == "-" else open(args.log, encoding="utf-8", errors="replace")
    try:
        ingest(source, database, reader)
    finally:
        if source is not sys.stdin:
            source.close()
        if reader:
            reader.close()

    if args.retention_days:
        purge(database, args.retention_days)
    batch_id = uuid.uuid4().hex
    generated_at = dt.datetime.now(dt.timezone.utc).isoformat().replace("+00:00", "Z")
    export(
        database,
        args.public_json,
        args.minimum,
        provider=provider,
        batch_id=batch_id,
        generated_at=generated_at,
    )
    export(
        database,
        args.private_json,
        detailed=True,
        provider=provider,
        batch_id=batch_id,
        generated_at=generated_at,
    )
    database.close()


if __name__ == "__main__":
    main()
