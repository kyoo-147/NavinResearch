const canvas = document.querySelector("#visitor-globe");
const context = canvas.getContext("2d");
const dateNode = document.querySelector("#date");
const countriesNode = document.querySelector("#countries");
const statusNode = document.querySelector("#status");
const demoBadge = document.querySelector("#demo-badge");
const attribution = document.querySelector("#attribution");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let centroids = {};
let rows = [];
let rotation = -20;
let lastFrame = 0;
let previousTimestamp = 0;

function project(longitude, latitude, centerX, centerY, radius) {
  const radians = Math.PI / 180;
  const lambda = (longitude - rotation) * radians;
  const phi = latitude * radians;
  const phi0 = 15 * radians;
  const cosPhi = Math.cos(phi);
  const visibility = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * cosPhi * Math.cos(lambda);
  return {
    visible: visibility > 0,
    x: centerX + radius * cosPhi * Math.sin(lambda),
    y: centerY - radius * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * cosPhi * Math.cos(lambda)),
  };
}

function drawLine(points, centerX, centerY, radius) {
  let drawing = false;
  context.beginPath();
  points.forEach(([longitude, latitude]) => {
    const point = project(longitude, latitude, centerX, centerY, radius);
    if (!point.visible) {
      drawing = false;
      return;
    }
    if (!drawing) context.moveTo(point.x, point.y);
    else context.lineTo(point.x, point.y);
    drawing = true;
  });
  context.stroke();
}

function draw(timestamp = 0) {
  const displaySize = canvas.getBoundingClientRect().width;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const pixelSize = Math.max(1, Math.round(displaySize * ratio));
  if (canvas.width !== pixelSize || canvas.height !== pixelSize) {
    canvas.width = pixelSize;
    canvas.height = pixelSize;
  }
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, displaySize, displaySize);

  const center = displaySize / 2;
  const radius = displaySize * 0.39;
  const gradient = context.createRadialGradient(center * 0.75, center * 0.65, radius * 0.05, center, center, radius);
  gradient.addColorStop(0, "rgba(217,255,87,.19)");
  gradient.addColorStop(1, "rgba(4,31,21,.9)");
  context.beginPath();
  context.arc(center, center, radius, 0, Math.PI * 2);
  context.fillStyle = gradient;
  context.fill();
  context.strokeStyle = "rgba(217,255,87,.6)";
  context.lineWidth = 1;
  context.stroke();

  context.save();
  context.beginPath();
  context.arc(center, center, radius, 0, Math.PI * 2);
  context.clip();

  context.strokeStyle = "rgba(244,247,236,.12)";
  context.lineWidth = 0.8;
  for (let latitude = -60; latitude <= 60; latitude += 30) {
    const line = [];
    for (let longitude = -180; longitude <= 180; longitude += 3) line.push([longitude, latitude]);
    drawLine(line, center, center, radius);
  }
  for (let longitude = -180; longitude < 180; longitude += 30) {
    const line = [];
    for (let latitude = -88; latitude <= 88; latitude += 2) line.push([longitude, latitude]);
    drawLine(line, center, center, radius);
  }

  rows.forEach((row) => {
    const centroid = centroids[row.countryCode];
    if (!centroid) return;
    const [latitude, longitude] = centroid;
    const point = project(longitude, latitude, center, center, radius);
    if (!point.visible) return;
    context.beginPath();
    context.arc(point.x, point.y, Math.min(8, 3 + Math.sqrt(row.visitors)), 0, Math.PI * 2);
    context.fillStyle = "#d9ff57";
    context.shadowColor = "rgba(217,255,87,.85)";
    context.shadowBlur = 14;
    context.fill();
    context.shadowBlur = 0;
  });
  context.restore();

  if (!reduceMotion && !document.hidden) {
    if (previousTimestamp) rotation = (rotation + (timestamp - previousTimestamp) * 0.0022) % 360;
    previousTimestamp = timestamp;
    window.requestAnimationFrame(animate);
  }
}

function animate(timestamp) {
  if (timestamp - lastFrame < 32) {
    window.requestAnimationFrame(animate);
    return;
  }
  lastFrame = timestamp;
  draw(timestamp);
}

function isValidDay(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

function isIsoTimestamp(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value) && !Number.isNaN(Date.parse(value));
}

function validateData(data) {
  const providers = new Set(["demo", "none", "MaxMind GeoLite2 City"]);
  if (
    !data ||
    typeof data !== "object" ||
    data.schemaVersion !== 1 ||
    typeof data.batchId !== "string" ||
    !data.batchId ||
    !isIsoTimestamp(data.generatedAt) ||
    typeof data.demo !== "boolean" ||
    data.metric !== "unique visitors per log day" ||
    !providers.has(data.geolocationProvider) ||
    (data.demo !== (data.geolocationProvider === "demo")) ||
    !Number.isInteger(data.minimumGroupSize) ||
    data.minimumGroupSize < 5 ||
    !Number.isInteger(data.withheldVisitors) ||
    data.withheldVisitors < 0 ||
    !data.privacy ||
    typeof data.privacy !== "object" ||
    !Array.isArray(data.rows)
  ) {
    throw new Error("invalid visitor data");
  }
  const rowKeys = new Set();
  for (const row of data.rows) {
    const key = `${row.day}:${row.countryCode}`;
    if (
      !isValidDay(row.day) ||
      !/^[A-Z]{2}$/.test(row.countryCode) ||
      typeof row.country !== "string" ||
      !row.country ||
      row.country.length > 200 ||
      !Number.isInteger(row.visitors) ||
      row.visitors < data.minimumGroupSize ||
      rowKeys.has(key)
    ) {
      throw new Error("invalid visitor row");
    }
    rowKeys.add(key);
  }
}

function validateCentroids(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("invalid centroids");
  for (const [code, point] of Object.entries(data)) {
    if (
      !/^[A-Z]{2}$/.test(code) ||
      !Array.isArray(point) ||
      point.length !== 2 ||
      !Number.isFinite(point[0]) ||
      !Number.isFinite(point[1]) ||
      point[0] < -90 ||
      point[0] > 90 ||
      point[1] < -180 ||
      point[1] > 180 ||
      (point[0] === 0 && point[1] === 0)
    ) {
      throw new Error("invalid centroid");
    }
  }
}

function renderData(data) {
  validateData(data);
  const allRows = Array.isArray(data.rows) ? data.rows : [];
  const latest = allRows.map((row) => row.day).sort().pop();
  rows = allRows.filter((row) => row.day === latest).sort((left, right) => right.visitors - left.visitors);
  dateNode.textContent = latest || "—";
  countriesNode.replaceChildren();

  rows.forEach((row, index) => {
    const item = document.createElement("li");
    const rank = document.createElement("b");
    rank.textContent = String(index + 1).padStart(2, "0");
    const country = document.createElement("span");
    country.textContent = row.country;
    const visitors = document.createElement("small");
    visitors.textContent = `${row.visitors.toLocaleString()} visitors`;
    item.append(rank, country, visitors);
    countriesNode.append(item);
  });

  demoBadge.hidden = !data.demo;
  attribution.hidden = !String(data.geolocationProvider || "").startsWith("MaxMind");
  const withheld = data.withheldVisitors;
  statusNode.textContent = rows.length
    ? `${withheld} visitors withheld below the minimum group size. Updated periodically; not a live individual feed.`
    : "No publishable aggregate data is available yet.";
}

async function load() {
  try {
    const [centroidResponse, dataResponse] = await Promise.all([
      fetch("/visitor-map/country-centroids.json", { cache: "force-cache" }),
      fetch("/visitor-map/data.json", { cache: "no-store" }),
    ]);
    if (!centroidResponse.ok || !dataResponse.ok) throw new Error("visitor map data unavailable");
    const [countryCentroids, data] = await Promise.all([centroidResponse.json(), dataResponse.json()]);
    validateCentroids(countryCentroids);
    centroids = countryCentroids;
    renderData(data);
    draw();
  } catch {
    statusNode.textContent = "Aggregate data is temporarily unavailable.";
    draw();
  }
}

window.addEventListener("resize", () => draw());
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && !reduceMotion) {
    previousTimestamp = 0;
    window.requestAnimationFrame(animate);
  }
});

load();
