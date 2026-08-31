const nodes = {
  date: document.querySelector("#date"), locations: document.querySelector("#locations"), allLocations: document.querySelector("#all-locations"), status: document.querySelector("#status"), demo: document.querySelector("#demo-badge"), total: document.querySelector("#total-visitors"), locationCount: document.querySelector("#total-locations"), countryCount: document.querySelector("#total-countries"), totalLabel: document.querySelector("#total-label"), periodLabel: document.querySelector("#period-label"), dayCount: document.querySelector("#day-count"), chart: document.querySelector("#daily-chart"), picker: document.querySelector("#day-picker"), dateControl: document.querySelector(".date-control"), dialog: document.querySelector("#locations-dialog"), search: document.querySelector("#location-search"),
};
const rangeButtons = [...document.querySelectorAll("[data-range]")];
let sourceRows = [];
let renderedRows = [];
let activeRange = "all";

function isValidDay(value) { if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false; const parsed = new Date(`${value}T00:00:00Z`); return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value; }
function isValidRow(row) { return isValidDay(row.day) && /^[A-Z]{2}$/.test(row.countryCode) && [row.country, row.region, row.city].every((label) => typeof label === "string" && label.length > 0 && label.length <= 200) && Number.isInteger(row.visitors) && row.visitors >= 0; }
function validateData(data) {
  const providers = new Set(["demo", "none", "MaxMind GeoLite2 City", "DB-IP City Lite"]);
  if (!data || typeof data !== "object" || data.schemaVersion !== 1 || typeof data.batchId !== "string" || !data.batchId || typeof data.generatedAt !== "string" || Number.isNaN(Date.parse(data.generatedAt)) || typeof data.demo !== "boolean" || data.metric !== "unique visitors per log day" || !providers.has(data.geolocationProvider) || data.demo !== (data.geolocationProvider === "demo") || !data.privacy || typeof data.privacy !== "object" || !Array.isArray(data.rows)) throw new Error("invalid private aggregate");
  const keys = new Set(); for (const row of data.rows) { const key = `${row.day}:${row.countryCode}:${row.country}:${row.region}:${row.city}`; if (!isValidRow(row) || keys.has(key)) throw new Error("invalid private aggregate row"); keys.add(key); }
}
function readableDay(day) { return new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${day}T00:00:00Z`)); }
function locationKey(row) { return `${row.countryCode}\u0000${row.country}\u0000${row.region}\u0000${row.city}`; }
function aggregate(rows) {
  const grouped = new Map();
  rows.forEach((row) => { const key = locationKey(row); const current = grouped.get(key) || { countryCode: row.countryCode, country: row.country, region: row.region, city: row.city, visitors: 0 }; current.visitors += row.visitors; grouped.set(key, current); });
  return [...grouped.values()].sort((a, b) => b.visitors - a.visitors || a.country.localeCompare(b.country) || a.city.localeCompare(b.city));
}
function createLocationRow(row, detailed = false) {
  const tr = document.createElement("tr");
  if (detailed) {
    [row.city, row.region, row.country].forEach((value) => { const td = document.createElement("td"); td.textContent = value; tr.append(td); });
  } else {
    const place = document.createElement("td"); const city = document.createElement("span"); city.className = "location-primary"; city.textContent = row.city; const region = document.createElement("span"); region.className = "location-secondary"; region.textContent = row.region; place.append(city, region); const country = document.createElement("td"); country.textContent = row.country; tr.append(place, country);
  }
  const total = document.createElement("td"); total.textContent = row.visitors.toLocaleString(); tr.append(total); return tr;
}
function renderDirectory(query = "") {
  const term = query.trim().toLocaleLowerCase(); const filtered = term ? renderedRows.filter((row) => [row.city, row.region, row.country].some((value) => value.toLocaleLowerCase().includes(term))) : renderedRows;
  nodes.allLocations.replaceChildren(); filtered.forEach((row) => nodes.allLocations.append(createLocationRow(row, true)));
}
function setDay(day) {
  activeRange = "day"; nodes.picker.value = day; nodes.dateControl.hidden = false;
  rangeButtons.forEach((button) => { const active = button.dataset.range === "day"; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); }); render();
}
function renderChart() {
  const totals = new Map(); sourceRows.forEach((row) => totals.set(row.day, (totals.get(row.day) || 0) + row.visitors)); const entries = [...totals].sort(([a], [b]) => a.localeCompare(b)); const max = Math.max(1, ...entries.map(([, total]) => total)); nodes.dayCount.textContent = `${entries.length} days`; nodes.chart.replaceChildren();
  entries.forEach(([day, total]) => { const bar = document.createElement("button"); bar.type = "button"; bar.className = "daily-bar"; bar.style.setProperty("--bar-height", `${Math.max(2, (total / max) * 100)}%`); bar.dataset.label = `${readableDay(day)} · ${total.toLocaleString()}`; bar.setAttribute("aria-label", `View ${total.toLocaleString()} visitors on ${readableDay(day)}`); bar.addEventListener("click", () => setDay(day)); nodes.chart.append(bar); });
}
function render() {
  const days = [...new Set(sourceRows.map((row) => row.day))].sort(); const latest = days.at(-1) || ""; if (!nodes.picker.value || !days.includes(nodes.picker.value)) nodes.picker.value = latest; nodes.picker.min = days[0] || ""; nodes.picker.max = latest;
  const selected = activeRange === "all" ? sourceRows : sourceRows.filter((row) => row.day === nodes.picker.value); renderedRows = aggregate(selected); const total = renderedRows.reduce((sum, row) => sum + row.visitors, 0);
  nodes.total.textContent = total.toLocaleString(); nodes.locationCount.textContent = renderedRows.length.toLocaleString(); nodes.countryCount.textContent = new Set(renderedRows.map((row) => row.countryCode)).size.toLocaleString(); nodes.totalLabel.textContent = activeRange === "all" ? "Total recorded visitors" : "Visitors that day"; nodes.periodLabel.textContent = activeRange === "all" ? (days.length ? `${readableDay(days[0])} — ${readableDay(latest)}` : "Across all available days") : readableDay(nodes.picker.value);
  nodes.locations.replaceChildren(); renderedRows.slice(0, 12).forEach((row) => nodes.locations.append(createLocationRow(row))); nodes.status.hidden = renderedRows.length > 0; nodes.status.textContent = renderedRows.length ? "" : "No aggregate locations are available for this period."; renderDirectory(nodes.search.value);
}
rangeButtons.forEach((button) => button.addEventListener("click", () => { activeRange = button.dataset.range; rangeButtons.forEach((item) => { const active = item === button; item.classList.toggle("is-active", active); item.setAttribute("aria-pressed", String(active)); }); nodes.dateControl.hidden = activeRange !== "day"; render(); }));
nodes.picker.addEventListener("change", render);
nodes.search.addEventListener("input", () => renderDirectory(nodes.search.value));
document.querySelector("#open-all").addEventListener("click", () => { nodes.search.value = ""; renderDirectory(); nodes.dialog.showModal(); nodes.search.focus(); });

fetch("/visitor-insights/data.json", { cache: "no-store" }).then((response) => { if (!response.ok) throw new Error("private aggregate unavailable"); return response.json(); }).then((data) => { validateData(data); sourceRows = data.rows; nodes.date.textContent = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(data.generatedAt)); nodes.demo.hidden = !data.demo; renderChart(); render(); }).catch(() => { nodes.status.hidden = false; nodes.status.textContent = "Private aggregate data is unavailable."; });
