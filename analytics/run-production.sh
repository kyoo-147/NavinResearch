#!/usr/bin/env bash
set -euo pipefail

log_dir=/var/log/nginx
state_dir=/var/lib/navin-analytics
python=/opt/navin-analytics/.venv/bin/python
aggregate=/opt/navin-analytics/aggregate.py
mmdb="$state_dir/DBIP-City-Lite.mmdb"

logs=()
[[ -r "$log_dir/navinresearch.access.log.1" ]] && logs+=("$log_dir/navinresearch.access.log.1")
[[ -r "$log_dir/navinresearch.access.log" ]] && logs+=("$log_dir/navinresearch.access.log")
((${#logs[@]})) || { echo "no readable Navin access log" >&2; exit 1; }

cat "${logs[@]}" | "$python" "$aggregate" - \
  --db "$state_dir/visitors.sqlite3" \
  --mmdb "$mmdb" \
  --provider "DB-IP City Lite" \
  --public-json "$state_dir/public.json" \
  --private-json "$state_dir/private.json" \
  --retention-days 90 \
  --minimum 5

chown root:www-data "$state_dir/public.json" "$state_dir/private.json"
chmod 0644 "$state_dir/public.json"
chmod 0640 "$state_dir/private.json"
chmod 0600 "$state_dir/visitors.sqlite3"
