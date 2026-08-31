import datetime as datetime_module
import json
import tempfile
import unittest
from datetime import date
from pathlib import Path
from unittest.mock import patch

from analytics.aggregate import export, ingest, open_db, parse_line, purge


class AggregateTests(unittest.TestCase):
    def log_line(self, ip="8.8.8.8", path="/research", user_agent="Mozilla/5.0", status=200):
        return (
            f'{ip} - - [14/Feb/2026:12:00:00 +0000] '
            f'"GET {path} HTTP/1.1" {status} 12 "-" "{user_agent}"\n'
        )

    def test_parser_filters_assets_bots_private_ips_and_bad_requests(self):
        self.assertEqual(parse_line(self.log_line())[0], "8.8.8.8")
        self.assertIsNone(parse_line(self.log_line(path="/app.js")))
        self.assertIsNone(parse_line(self.log_line(user_agent="Googlebot")))
        self.assertIsNone(parse_line(self.log_line(status=404)))
        self.assertIsNone(parse_line(self.log_line(ip="127.0.0.1")))
        self.assertIsNone(parse_line("not nginx"))
        shifted = self.log_line().replace("14/Feb/2026:12:00:00 +0000", "01/Mar/2026:00:30:00 +1400")
        self.assertEqual(parse_line(shifted)[1], "2026-02-28")

    def test_unique_visitors_are_idempotent_and_no_identifier_is_stored(self):
        with tempfile.TemporaryDirectory() as temporary:
            database = open_db(Path(temporary) / "visitors.sqlite3")
            lines = [self.log_line(path="/"), self.log_line(path="/research/"), self.log_line(ip="1.1.1.1")]
            with patch("analytics.aggregate.lookup", return_value=("VN", "Vietnam", "Unknown", "Unknown")):
                self.assertEqual(ingest(lines, database), 2)
                self.assertEqual(ingest(lines, database), 2)
            row = database.execute("SELECT visitors FROM daily_locations").fetchone()
            self.assertEqual(row[0], 2)
            columns = [item[1] for item in database.execute("PRAGMA table_info(daily_locations)")]
            self.assertNotIn("ip", columns)
            self.assertNotIn("hash", columns)
            self.assertNotIn("url", columns)
            database.close()

    def test_provider_label_is_preserved_without_demo_state(self):
        with tempfile.TemporaryDirectory() as temporary:
            database = open_db(Path(temporary) / "visitors.sqlite3")
            database.execute(
                "INSERT INTO daily_locations VALUES (?,?,?,?,?,?)",
                ("2026-02-14", "VN", "Vietnam", "Hanoi", "Hanoi", 5),
            )
            database.commit()
            output = Path(temporary) / "public.json"
            export(database, output, provider="DB-IP City Lite")
            payload = json.loads(output.read_text(encoding="utf-8"))
            self.assertFalse(payload["demo"])
            self.assertEqual(payload["geolocationProvider"], "DB-IP City Lite")
            self.assertEqual(payload["rows"][0]["countryCode"], "VN")
            database.close()

    def test_public_export_includes_single_visitor_country_groups(self):
        with tempfile.TemporaryDirectory() as temporary:
            database = open_db(Path(temporary) / "visitors.sqlite3")
            database.execute(
                "INSERT INTO daily_locations VALUES (?,?,?,?,?,?)",
                ("2026-02-14", "VN", "Vietnam", "Unknown", "Unknown", 4),
            )
            database.commit()
            output = Path(temporary) / "public.json"
            export(database, output, minimum=1)
            payload = json.loads(output.read_text(encoding="utf-8"))
            self.assertEqual(payload["rows"][0]["visitors"], 4)
            self.assertEqual(payload["withheldVisitors"], 0)
            self.assertEqual(payload["metric"], "unique visitors per log day")
            self.assertEqual(payload["schemaVersion"], 1)
            self.assertRegex(payload["batchId"], r"^[0-9a-f]{32}$")
            self.assertTrue(payload["generatedAt"].endswith("Z"))
            with self.assertRaises(ValueError):
                export(database, output, minimum=0)
            database.close()

    def test_out_of_order_input_rolls_back_the_whole_ingest(self):
        with tempfile.TemporaryDirectory() as temporary:
            database = open_db(Path(temporary) / "visitors.sqlite3")
            database.execute(
                "INSERT INTO daily_locations VALUES ('2026-02-13','VN','Vietnam','Unknown','Unknown',9)"
            )
            database.commit()
            later = self.log_line().replace("14/Feb/2026", "15/Feb/2026")
            earlier = self.log_line().replace("14/Feb/2026", "13/Feb/2026")
            with patch("analytics.aggregate.lookup", return_value=("VN", "Vietnam", "Unknown", "Unknown")):
                with self.assertRaises(ValueError):
                    ingest([later, earlier], database)
            self.assertEqual(
                database.execute("SELECT day, visitors FROM daily_locations").fetchall(),
                [("2026-02-13", 9)],
            )
            database.close()

    def test_export_rejects_invalid_stored_schema(self):
        with tempfile.TemporaryDirectory() as temporary:
            database = open_db(Path(temporary) / "visitors.sqlite3")
            database.execute(
                "INSERT INTO daily_locations VALUES ('2026-99-99','VN','Vietnam','Unknown','Unknown',5)"
            )
            database.commit()
            with self.assertRaises(ValueError):
                export(database, Path(temporary) / "public.json")
            database.close()

    def test_cli_default_retains_complete_history(self):
        from analytics.aggregate import main

        with tempfile.TemporaryDirectory() as temporary:
            database_path = Path(temporary) / "visitors.sqlite3"
            public_path = Path(temporary) / "public.json"
            private_path = Path(temporary) / "private.json"
            database = open_db(database_path)
            database.execute(
                "INSERT INTO daily_locations VALUES ('2025-01-01','VN','Vietnam','Unknown','Unknown',3)"
            )
            database.commit()
            database.close()
            log_path = Path(temporary) / "access.log"
            log_path.write_text(self.log_line(), encoding="utf-8")
            with patch("analytics.aggregate.lookup", return_value=("VN", "Vietnam", "Unknown", "Unknown")):
                main([
                    str(log_path),
                    "--db", str(database_path),
                    "--public-json", str(public_path),
                    "--private-json", str(private_path),
                ])
            database = open_db(database_path)
            self.assertEqual(
                database.execute("SELECT day FROM daily_locations ORDER BY day").fetchall(),
                [("2025-01-01",), ("2026-02-14",)],
            )
            database.close()

    def test_retention_purges_old_buckets(self):
        with tempfile.TemporaryDirectory() as temporary:
            database = open_db(Path(temporary) / "visitors.sqlite3")
            database.execute(
                "INSERT INTO daily_locations VALUES ('2026-01-01','VN','Vietnam','Unknown','Unknown',3)"
            )
            database.execute(
                "INSERT INTO daily_locations VALUES ('2026-02-14','VN','Vietnam','Unknown','Unknown',3)"
            )
            database.commit()
            purge(database, 30, date(2026, 2, 20))
            self.assertEqual(database.execute("SELECT COUNT(*) FROM daily_locations").fetchone()[0], 1)
            real_datetime = datetime_module.datetime

            class BoundaryDateTime(real_datetime):
                @classmethod
                def now(cls, timezone):
                    self.assertEqual(timezone, datetime_module.timezone.utc)
                    return cls(2026, 3, 17, 0, 5, tzinfo=timezone)

            with patch("analytics.aggregate.dt.datetime", BoundaryDateTime):
                purge(database, 30)
            self.assertEqual(database.execute("SELECT COUNT(*) FROM daily_locations").fetchone()[0], 0)
            database.close()


if __name__ == "__main__":
    unittest.main()
