import json
import sqlite3
import tempfile
import unittest
from datetime import date
from pathlib import Path
from analytics.aggregate import export, ingest, open_db, parse_line, purge

class AggregateTests(unittest.TestCase):
    def test_parser_filters_assets_bots_and_bad_requests(self):
        good='203.0.113.4 - - [14/Feb/2026:12:00:00 +0000] "GET /research HTTP/1.1" 200 12 "-" "Mozilla/5.0"'
        self.assertEqual(parse_line(good)[0], '203.0.113.4')
        self.assertIsNone(parse_line(good.replace('/research','/app.js')))
        self.assertIsNone(parse_line(good.replace('Mozilla/5.0','Googlebot')))
        self.assertIsNone(parse_line(good.replace(' 200 ', '404 ')))
        self.assertIsNone(parse_line('not nginx'))

    def test_db_does_not_store_ip_and_public_threshold_hides_small_groups(self):
        with tempfile.TemporaryDirectory() as tmp:
            db = open_db(Path(tmp)/'v.sqlite')
            line='198.51.100.9 - - [14/Feb/2026:12:00:00 +0000] "GET / HTTP/1.1" 200 12 "-" "Mozilla"\n'
            ingest([line]*4, db)
            output=Path(tmp)/'public.json'; export(db, output, minimum=5)
            payload=json.loads(output.read_text())
            self.assertEqual(payload['rows'], [])
            self.assertEqual(payload['withheldVisits'], 4)
            columns=[r[1] for r in db.execute('pragma table_info(visits)')]
            self.assertNotIn('ip', columns)
            self.assertNotIn('url', columns)
            db.close()

    def test_retention_purges_old_buckets(self):
        with tempfile.TemporaryDirectory() as tmp:
            db=open_db(Path(tmp)/'v.sqlite')
            db.execute("insert into visits values ('2026-01-01','VN','Vietnam','Unknown','Unknown',3)")
            db.execute("insert into visits values ('2026-02-14','VN','Vietnam','Unknown','Unknown',3)")
            db.commit(); purge(db, 30, date(2026,2,20))
            self.assertEqual(db.execute('select count(*) from visits').fetchone()[0], 1)
            db.close()

if __name__ == '__main__': unittest.main()
