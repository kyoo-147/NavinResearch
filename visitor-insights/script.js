function isValidDay(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

function isValidRow(row) {
  return (
    isValidDay(row.day) &&
    /^[A-Z]{2}$/.test(row.countryCode) &&
    [row.country, row.region, row.city].every(
      (label) => typeof label === "string" && label.length > 0 && label.length <= 200,
    ) &&
    Number.isInteger(row.visitors) &&
    row.visitors >= 0
  );
}

function validateData(data) {
  const providers = new Set(["demo", "none", "MaxMind GeoLite2 City", "DB-IP City Lite"]);
  if (
    !data ||
    typeof data !== "object" ||
    data.schemaVersion !== 1 ||
    typeof data.batchId !== "string" ||
    !data.batchId ||
    typeof data.generatedAt !== "string" ||
    Number.isNaN(Date.parse(data.generatedAt)) ||
    typeof data.demo !== "boolean" ||
    data.metric !== "unique visitors per log day" ||
    !providers.has(data.geolocationProvider) ||
    (data.demo !== (data.geolocationProvider === "demo")) ||
    !data.privacy ||
    typeof data.privacy !== "object" ||
    !Array.isArray(data.rows)
  ) {
    throw new Error("invalid private aggregate");
  }
  const rowKeys = new Set();
  for (const row of data.rows) {
    const key = `${row.day}:${row.countryCode}:${row.country}:${row.region}:${row.city}`;
    if (!isValidRow(row) || rowKeys.has(key)) throw new Error("invalid private aggregate row");
    rowKeys.add(key);
  }
}

const dateNode = document.querySelector("#date");
const locationsNode = document.querySelector("#locations");
const statusNode = document.querySelector("#status");
const demoBadge = document.querySelector("#demo-badge");
const totalVisitorsNode = document.querySelector("#total-visitors");
const totalLocationsNode = document.querySelector("#total-locations");
const totalCountriesNode = document.querySelector("#total-countries");
const rowCountNode = document.querySelector("#row-count");

fetch("/visitor-insights/data.json", { cache: "no-store" })
  .then((response) => {
    if (!response.ok) throw new Error("private aggregate unavailable");
    return response.json();
  })
  .then((data) => {
    validateData(data);
    const rows = data.rows;
    const latest = rows.map((row) => row.day).sort().pop();
    dateNode.textContent = latest || "—";
    demoBadge.hidden = !data.demo;
    const latestRows = rows
      .filter((row) => row.day === latest)
      .sort((left, right) => right.visitors - left.visitors || left.country.localeCompare(right.country));
    const totalVisitors = latestRows.reduce((total, row) => total + row.visitors, 0);
    totalVisitorsNode.textContent = totalVisitors.toLocaleString();
    totalLocationsNode.textContent = latestRows.length.toLocaleString();
    totalCountriesNode.textContent = new Set(latestRows.map((row) => row.countryCode)).size.toLocaleString();
    rowCountNode.textContent = `${latestRows.length.toLocaleString()} locations`;
    locationsNode.replaceChildren();
    latestRows.forEach((row) => {
      const item = document.createElement("tr");
      for (const value of [row.city, row.region, row.country]) {
        const cell = document.createElement("td");
        cell.textContent = value;
        item.append(cell);
      }
      const visitors = document.createElement("td");
      visitors.textContent = row.visitors.toLocaleString();
      visitors.className = "visitor-count";
      item.append(visitors);
      locationsNode.append(item);
    });
    statusNode.hidden = true;
    statusNode.textContent = "";
  })
  .catch(() => {
    statusNode.hidden = false;
    statusNode.textContent = "Private aggregate data is unavailable.";
  });
