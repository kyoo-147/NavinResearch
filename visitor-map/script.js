const canvas = document.querySelector("#visitor-globe");
const context = canvas.getContext("2d");
const dateNode = document.querySelector("#date");
const countriesNode = document.querySelector("#countries");
const statusNode = document.querySelector("#status");
const demoBadge = document.querySelector("#demo-badge");
const totalVisitorsNode = document.querySelector("#total-visitors");
const totalCountriesNode = document.querySelector("#total-countries");
const countryCountNode = document.querySelector("#country-count");
const totalLabelNode = document.querySelector("#total-label");
const periodLabelNode = document.querySelector("#period-label");
const globePeriodNode = document.querySelector("#globe-period");
const dayPicker = document.querySelector("#day-picker");
const dateControl = document.querySelector(".date-control");
const rangeButtons = [...document.querySelectorAll("[data-range]")];
const dialog = document.querySelector("#country-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogTotal = document.querySelector("#dialog-total");
const dialogHistory = document.querySelector("#dialog-history");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let centroids = {};
let sourceRows = [];
let rows = [];
let activeRange = "all";
let rotation = 105;
let lastFrame = 0;
let previousTimestamp = 0;
let animationFrame = 0;

function project(longitude, latitude, centerX, centerY, radius) {
  const radians = Math.PI / 180;
  const lambda = (longitude - rotation) * radians;
  const phi = latitude * radians;
  const phi0 = 15 * radians;
  const cosPhi = Math.cos(phi);
  const visibility = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * cosPhi * Math.cos(lambda);
  return { visible: visibility > 0, x: centerX + radius * cosPhi * Math.sin(lambda), y: centerY - radius * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * cosPhi * Math.cos(lambda)) };
}

function drawLine(points, centerX, centerY, radius) {
  let drawing = false;
  context.beginPath();
  points.forEach(([longitude, latitude]) => {
    const point = project(longitude, latitude, centerX, centerY, radius);
    if (!point.visible) { drawing = false; return; }
    if (!drawing) context.moveTo(point.x, point.y); else context.lineTo(point.x, point.y);
    drawing = true;
  });
  context.stroke();
}

function draw(timestamp = 0) {
  const displaySize = canvas.getBoundingClientRect().width;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const pixelSize = Math.max(1, Math.round(displaySize * ratio));
  if (canvas.width !== pixelSize || canvas.height !== pixelSize) { canvas.width = pixelSize; canvas.height = pixelSize; }
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, displaySize, displaySize);
  const center = displaySize / 2;
  const radius = displaySize * 0.405;
  const gradient = context.createRadialGradient(center * .72, center * .68, radius * .06, center, center, radius);
  gradient.addColorStop(0, "#eafff8");
  gradient.addColorStop(.58, "#bfeae0");
  gradient.addColorStop(1, "#76c7b5");
  context.beginPath(); context.arc(center, center, radius, 0, Math.PI * 2); context.fillStyle = gradient; context.fill();
  context.strokeStyle = "rgba(8,119,76,.35)"; context.lineWidth = 1; context.stroke();
  context.save(); context.beginPath(); context.arc(center, center, radius, 0, Math.PI * 2); context.clip();
  context.strokeStyle = "rgba(8,119,76,.18)"; context.lineWidth = .75;
  for (let latitude = -60; latitude <= 60; latitude += 30) { const line = []; for (let longitude = -180; longitude <= 180; longitude += 3) line.push([longitude, latitude]); drawLine(line, center, center, radius); }
  for (let longitude = -180; longitude < 180; longitude += 30) { const line = []; for (let latitude = -88; latitude <= 88; latitude += 2) line.push([longitude, latitude]); drawLine(line, center, center, radius); }
  const max = Math.max(1, ...rows.map((row) => row.visitors));
  rows.forEach((row) => {
    const centroid = centroids[row.countryCode]; if (!centroid) return;
    const [latitude, longitude] = centroid; const point = project(longitude, latitude, center, center, radius); if (!point.visible) return;
    context.beginPath(); context.arc(point.x, point.y, 3 + Math.sqrt(row.visitors / max) * 7, 0, Math.PI * 2);
    context.fillStyle = "#08774c"; context.shadowColor = "rgba(8,119,76,.7)"; context.shadowBlur = 12; context.fill(); context.shadowBlur = 0;
  });
  context.restore();
}

function animate(timestamp) {
  animationFrame = 0;
  if (reduceMotion || document.hidden) return;
  if (timestamp - lastFrame >= 32) {
    if (previousTimestamp) rotation = (rotation + (timestamp - previousTimestamp) * .0018) % 360;
    previousTimestamp = timestamp;
    lastFrame = timestamp;
    draw(timestamp);
  }
  animationFrame = window.requestAnimationFrame(animate);
}
function startAnimation() {
  if (!reduceMotion && !document.hidden && !animationFrame) animationFrame = window.requestAnimationFrame(animate);
}
function isValidDay(value) { if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false; const parsed = new Date(`${value}T00:00:00Z`); return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value; }
function isIsoTimestamp(value) { return typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value) && !Number.isNaN(Date.parse(value)); }

function validateData(data) {
  const providers = new Set(["demo", "none", "MaxMind GeoLite2 City", "DB-IP City Lite"]);
  if (!data || typeof data !== "object" || data.schemaVersion !== 1 || typeof data.batchId !== "string" || !data.batchId || !isIsoTimestamp(data.generatedAt) || typeof data.demo !== "boolean" || data.metric !== "unique visitors per log day" || !providers.has(data.geolocationProvider) || data.demo !== (data.geolocationProvider === "demo") || !Number.isInteger(data.minimumGroupSize) || data.minimumGroupSize < 1 || !Number.isInteger(data.withheldVisitors) || data.withheldVisitors < 0 || !data.privacy || typeof data.privacy !== "object" || !Array.isArray(data.rows)) throw new Error("invalid visitor data");
  const rowKeys = new Set();
  for (const row of data.rows) { const key = `${row.day}:${row.countryCode}`; if (!isValidDay(row.day) || !/^[A-Z]{2}$/.test(row.countryCode) || typeof row.country !== "string" || !row.country || row.country.length > 200 || !Number.isInteger(row.visitors) || row.visitors < data.minimumGroupSize || rowKeys.has(key)) throw new Error("invalid visitor row"); rowKeys.add(key); }
}
function validateCentroids(data) { if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("invalid centroids"); for (const [code, point] of Object.entries(data)) if (!/^[A-Z]{2}$/.test(code) || !Array.isArray(point) || point.length !== 2 || !Number.isFinite(point[0]) || !Number.isFinite(point[1]) || point[0] < -90 || point[0] > 90 || point[1] < -180 || point[1] > 180 || (point[0] === 0 && point[1] === 0)) throw new Error("invalid centroid"); }

function aggregate(selectedRows) {
  const grouped = new Map();
  selectedRows.forEach((row) => { const current = grouped.get(row.countryCode) || { countryCode: row.countryCode, country: row.country, visitors: 0 }; current.visitors += row.visitors; grouped.set(row.countryCode, current); });
  return [...grouped.values()].sort((a, b) => b.visitors - a.visitors || a.country.localeCompare(b.country));
}
function readableDay(day) { return new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${day}T00:00:00Z`)); }

function openCountry(code) {
  const countryRows = sourceRows.filter((row) => row.countryCode === code).sort((a, b) => b.day.localeCompare(a.day));
  dialogTitle.textContent = countryRows[0]?.country || code;
  dialogTotal.textContent = countryRows.reduce((sum, row) => sum + row.visitors, 0).toLocaleString();
  dialogHistory.replaceChildren();
  countryRows.forEach((row) => { const item = document.createElement("div"); item.className = "dialog-history-row"; const day = document.createElement("span"); day.textContent = readableDay(row.day); const total = document.createElement("strong"); total.textContent = row.visitors.toLocaleString(); item.append(day, total); dialogHistory.append(item); });
  dialog.showModal();
}

function render() {
  const days = [...new Set(sourceRows.map((row) => row.day))].sort();
  const latest = days.at(-1) || "";
  if (!dayPicker.value || !days.includes(dayPicker.value)) dayPicker.value = latest;
  dayPicker.min = days[0] || ""; dayPicker.max = latest;
  const selectedRows = activeRange === "all" ? sourceRows : sourceRows.filter((row) => row.day === dayPicker.value);
  rows = aggregate(selectedRows);
  const total = rows.reduce((sum, row) => sum + row.visitors, 0);
  totalVisitorsNode.textContent = total.toLocaleString(); totalCountriesNode.textContent = rows.length.toLocaleString(); countryCountNode.textContent = `${rows.length} countries`;
  totalLabelNode.textContent = activeRange === "all" ? "Total recorded visitors" : "Visitors that day";
  periodLabelNode.textContent = activeRange === "all" ? (days.length ? `${readableDay(days[0])} — ${readableDay(latest)}` : "Across all available days") : readableDay(dayPicker.value);
  globePeriodNode.textContent = activeRange === "all" ? "All-time totals" : readableDay(dayPicker.value);
  countriesNode.replaceChildren(); const maximum = Math.max(1, ...rows.map((row) => row.visitors));
  rows.forEach((row, index) => { const item = document.createElement("li"); const button = document.createElement("button"); button.type = "button"; button.className = "country-row"; button.setAttribute("aria-label", `${row.country}, ${row.visitors.toLocaleString()} recorded visitors, open daily history`); button.addEventListener("click", () => openCountry(row.countryCode)); const rank = document.createElement("b"); rank.textContent = String(index + 1).padStart(2, "0"); const country = document.createElement("span"); country.textContent = row.country; const visitors = document.createElement("small"); visitors.textContent = row.visitors.toLocaleString(); const meter = document.createElement("meter"); meter.min = 0; meter.max = maximum; meter.value = row.visitors; meter.setAttribute("aria-hidden", "true"); button.append(rank, country, visitors, meter); item.append(button); countriesNode.append(item); });
  statusNode.hidden = rows.length > 0; statusNode.textContent = rows.length ? "" : "No visitor data is available for this period."; draw();
}

rangeButtons.forEach((button) => button.addEventListener("click", () => { activeRange = button.dataset.range; rangeButtons.forEach((item) => { const active = item === button; item.classList.toggle("is-active", active); item.setAttribute("aria-pressed", String(active)); }); dateControl.hidden = activeRange !== "day"; render(); }));
dayPicker.addEventListener("change", render);
window.addEventListener("resize", draw);
document.addEventListener("visibilitychange", () => {
  if (document.hidden && animationFrame) { window.cancelAnimationFrame(animationFrame); animationFrame = 0; }
  if (!document.hidden) { previousTimestamp = 0; startAnimation(); }
});

async function load() {
  try {
    const [centroidResponse, dataResponse] = await Promise.all([fetch("/visitor-map/country-centroids.json", { cache: "force-cache" }), fetch("/visitor-map/data.json", { cache: "no-store" })]);
    if (!centroidResponse.ok || !dataResponse.ok) throw new Error("visitor map data unavailable");
    const [countryCentroids, data] = await Promise.all([centroidResponse.json(), dataResponse.json()]); validateCentroids(countryCentroids); validateData(data); centroids = countryCentroids; sourceRows = data.rows; dateNode.textContent = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(data.generatedAt)); demoBadge.hidden = !data.demo; render(); startAnimation();
  } catch { statusNode.hidden = false; statusNode.textContent = "Visitor data is temporarily unavailable."; draw(); }
}
load();
