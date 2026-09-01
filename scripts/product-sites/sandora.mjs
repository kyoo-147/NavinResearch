import { escapeHtml, headMarkup } from "../product-renderer-helpers.mjs";

const e = escapeHtml;
const pathOf = (value = "/") => value === "/404.html" ? value : (`/${String(value).replace(/^\/+|\/+$/g, "")}/`).replace("//", "/");
const ext = (href = "") => /^https?:|^mailto:/.test(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
const state = (value = "CONCEPT-STAGE") => `<span class="sd-state">${e(value)}</span>`;

function nav(site, path) {
  return site.navigation.map((item) => {
    const href = item.href || item.children?.[0]?.href || "/";
    const current = pathOf(href) === path || item.children?.some((child) => pathOf(child.href) === path);
    if (!item.children?.length) return `<a class="sd-nav-link" href="${e(href)}"${current ? ' aria-current="page"' : ""}${ext(href)}>${e(item.label)}</a>`;
    const midpoint = Math.ceil(item.children.length / 2);
    const groups = [item.children.slice(0, midpoint), item.children.slice(midpoint)].filter((group) => group.length);
    return `<details class="sd-nav-cluster"${current ? " data-current" : ""}><summary>${e(item.label)}<i aria-hidden="true"></i></summary><div class="sd-mega"><header><span>${e(item.label)}</span><p>Navigate the operating model without hiding its boundaries.</p></header>${groups.map((group) => `<nav aria-label="${e(item.label)} links">${group.map((child) => `<a href="${e(child.href)}"${pathOf(child.href) === path ? ' aria-current="page"' : ""}${ext(child.href)}><span>${e(child.label)}</span><small>${child.href.replaceAll("/", " ").trim() || "overview"}</small></a>`).join("")}</nav>`).join("")}</div></details>`;
  }).join("");
}

function mediaFigure(page, className = "") {
  if (!page.media?.src) return "";
  const priority = className.includes("hero") || className.includes("route");
  const [width, height] = page.media.src.endsWith("hero-atlas.webp") ? [1915, 821] : [1672, 941];
  const compactSrc = page.media.src.replace(/\.webp$/, "-960.webp");
  const sizes = priority ? "(max-width: 1100px) calc(100vw - 2rem), 55vw" : className.includes("wide") ? "calc(100vw - 2rem)" : "(max-width: 700px) calc(100vw - 2rem), 65vw";
  return `<figure class="sd-media ${e(className)}"><div><img src="${e(page.media.src)}" srcset="${e(compactSrc)} 960w, ${e(page.media.src)} ${width}w" sizes="${sizes}" alt="${e(page.media.alt)}" width="${width}" height="${height}"${priority ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"></div><figcaption><span>ORIGINAL / SANDORA</span>${e(page.media.caption)}</figcaption></figure>`;
}

function truthRail(product) {
  return `<section class="sd-modules sd-truth" aria-label="Product evidence status">${product.evidence.map((item, index) => `<div><span>${String(index + 1).padStart(2, "0")} / ${e(item.label)}</span><strong>${e(item.value)}</strong>${state(item.state)}</div>`).join("")}</section>`;
}

function home(product, site, page) {
  const departments = [
    ["Operations", "Routes repeatable work through explicit owners and review points."],
    ["Research", "Keeps questions, source trails, and unknowns distinct from findings."],
    ["Knowledge", "Attaches scoped context and provenance to the task that uses it."],
    ["Communications", "Prepares material while leaving consequential publication decisions to people."],
    ["Finance", "Frames review boundaries without claiming autonomous authority or deployment."]
  ];
  return `<section class="sd-hero"><div class="sd-hero__copy"><p class="sd-overline"><span>AI DEPARTMENT OS</span><span>CONCEPT / HUMAN-GOVERNED</span></p><h1>An operating system for an AI department.</h1><p class="sd-hero__lede">Map roles, route work, and keep consequential decisions with people.</p><div class="sd-actions"><a href="/product/">Explore the system</a><a href="/docs/">Read the field guide</a></div></div>${mediaFigure(page, "sd-media--hero")}</section>
  ${truthRail(product)}
  <section class="sd-thesis"><div><span>OPERATING THESIS</span><h2>Responsibility before automation.</h2></div><div><p>${e(product.intro)}</p><p>${e(product.proofNote)}</p><a href="/approvals/">Read the governance model</a></div></section>
  <section class="sd-home-atlas"><div class="sd-section-head"><span>DEPARTMENT TERRITORIES</span><h2>Organize work around visible boundaries.</h2><p>These are illustrative department shapes, not deployed teams or customer configurations.</p></div>${mediaFigure({ ...page, media: { src: "/products/media/sandora/departments-atlas.webp", alt: "Five original abstract department territories connected by routing lines", caption: "Original department atlas — illustrative organization model" } }, "sd-media--wide")}<div class="sd-department-index">${departments.map(([title, body], index) => `<a href="/departments/"><span>${String(index + 1).padStart(2, "0")}</span><h3>${e(title)}</h3><p>${e(body)}</p><strong>DESIGN SCOPE</strong></a>`).join("")}</div></section>
  <section class="sd-flow-chapter"><div class="sd-flow-chapter__copy"><span>WORKFLOW / HANDOFF</span><h2>Automate the route, not the judgment.</h2><p>A proposed workflow moves through named stages, carries context, and stops where human review is required.</p><ol><li>Intake</li><li>Delegate</li><li>Execute</li><li>Review</li><li>Record</li></ol><a href="/workflows/">Inspect the workflow model</a></div>${mediaFigure({ ...page, media: { src: "/products/media/sandora/workflow-river.webp", alt: "Original branching workflow route with checkpoints and an amber approval gate", caption: "Original workflow trace — illustrative sequence, not a live run" } }, "sd-media--flow")}</section>
  <section class="sd-platform-chapter">${mediaFigure({ ...page, media: { src: "/products/media/sandora/runtime-observatory.webp", alt: "Original abstract runtime observatory connected across an operational map", caption: "Original platform study — not production telemetry" } }, "sd-media--platform")}<div><span>RUNTIME / OBSERVABILITY</span><h2>The work should leave a readable trace.</h2><p>Sandora’s proposed control plane makes states, events, unresolved questions, and review points part of the operating surface.</p><div class="sd-platform-links"><a href="/runtime/">Runtime <b>01</b></a><a href="/observability/">Observability <b>02</b></a><a href="/memory/">Memory <b>03</b></a><a href="/approvals/">Approvals <b>04</b></a></div></div></section>
  <section class="sd-governance-chapter"><div><span>HUMAN AUTHORITY</span><h2>The stop is part of the system.</h2><p>Approval is modeled as an accountable state transition. Sandora does not claim autonomous authority, production enforcement, or completed security validation.</p><a href="/security/">Review the boundary</a></div>${mediaFigure({ ...page, media: { src: "/products/media/sandora/approvals-boundary.webp", alt: "Original concentric operational boundary with a central amber authorization point", caption: "Original approval-boundary study — no enforcement claim" } }, "sd-media--approval")}</section>
  <section class="sd-close"><span>ORIGINAL FIELD NOTE / 2026</span><h2>Build the department you can inspect.</h2><p>Start with roles, limits, and decisions. The automation comes after the map.</p><a href="${e(site.primaryCta.href)}"${ext(site.primaryCta.href)}>${e(site.primaryCta.label)}</a></section>`;
}

function routeLead(page, mode) {
  return `<section class="sd-route-lead sd-route-lead--${e(mode)}"><div class="sd-route-lead__copy"><span>${e(page.eyebrow || `SANDORA / ${mode.toUpperCase()}`)}</span><h1>${e(page.headline || page.title)}</h1><p>${e(page.lede || page.description)}</p><dl><div><dt>OWNER</dt><dd>HUMAN</dd></div><div><dt>STATE</dt><dd>EXPLICIT</dd></div><div><dt>EVIDENCE</dt><dd>BOUNDED</dd></div></dl></div>${mediaFigure(page, "sd-media--route")}</section>`;
}

function departmentDirectory(page) {
  const units = [
    ["Operations", "Process ownership", "Route work through named roles, checkpoints, and accountable handoffs."],
    ["Research", "Evidence discipline", "Separate source, observation, inference, and unresolved questions."],
    ["Knowledge", "Scoped context", "Keep provenance and task context attached to the work that needs it."],
    ["Communications", "Review before release", "Prepare material while preserving a clear publication decision."],
    ["Finance", "Consequential review", "Escalate actions that require human authority; no autonomous-control claim."]
  ];
  return `<section class="sd-directory"><header><span>DEPARTMENT DIRECTORY</span><h2>Five illustrative territories.</h2><p>Each unit is framed by its problem, proposed controls, deployment context, and human outcome. No configured department is claimed.</p></header><div>${units.map(([name, scope, body], index) => `<article><span>${String(index + 1).padStart(2, "0")}</span><div><h2>${e(name)}</h2><strong>${e(scope)}</strong></div><p>${e(body)}</p>${state("DESIGN INTENT")}</article>`).join("")}</div></section>`;
}

function agentBands() {
  const bands = [
    ["Named role", "An agent begins as a responsibility with a visible boundary, not a personality."],
    ["Persistent context", "Working context remains scoped to the department or workflow that uses it."],
    ["Scheduled work", "Repeatability is a proposed workflow property; scheduling availability is not announced."],
    ["Channels", "A role may receive work from bounded channels without turning every message into authority."],
    ["Tools", "Capabilities, credentials, and returned records should be inspectable at the connector boundary."],
    ["Human review", "Consequential output pauses at an explicit gate owned by a person."]
  ];
  return `<section class="sd-agent-bands">${bands.map(([title, body], index) => `<article><span>${String(index + 1).padStart(2, "0")}</span><h2>${e(title)}</h2><p>${e(body)}</p>${state(index === 5 ? "HUMAN OWNER" : "CONCEPT-STAGE")}</article>`).join("")}</section>`;
}

function workflow(page) {
  const steps = [
    ["Intake", "Record the request, source, and missing context before assignment."],
    ["Delegate", "Choose a named role and preserve the reason for the handoff."],
    ["Execute", "Proposed actions produce events and returned records, not hidden progress."],
    ["Review", "Pause where authority, uncertainty, or consequence requires a person."],
    ["Complete", "Attach the decision and next state to the workflow record."]
  ];
  return `<section class="sd-workflow-map"><header><span>WORKFLOW AUTOMATION / CONCEPT</span><h2>One route, five explicit states.</h2></header><ol>${steps.map(([title, body], index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><div><h2>${e(title)}</h2><p>${e(body)}</p></div>${state(index === 3 ? "APPROVAL GATE" : "OBSERVED")}</li>`).join("")}</ol><div class="sd-template-note"><span>TEMPLATE BOUNDARY</span><p>Templates describe a proposed sequence. They do not imply a live workflow library, connector support, or production execution.</p><a href="/approvals/">See approval states</a></div></section>`;
}

function platform(path) {
  const isObservability = path === "/observability/";
  const modules = isObservability ? [
    ["Event identity", "Name the source, scope, and proposed action."],
    ["State transition", "Show where work entered, paused, failed, or completed."],
    ["Open question", "Keep uncertainty visible instead of collapsing it into success."],
    ["Intervention", "Attach the human decision to the event that required it."]
  ] : [
    ["Execution lane", "A proposed route for bounded work and returned records."],
    ["Worker state", "Queued, running, waiting, stopped, or unresolved."],
    ["Model route", "A design surface only; providers and compatibility are not announced."],
    ["Health signal", "A readable state vocabulary, not production uptime evidence."]
  ];
  return `<section class="sd-platform-grid"><header><span>${isObservability ? "OBSERVABILITY" : "RUNTIME"} MODULES</span><h2>${isObservability ? "Follow the event, not the theatre." : "A control plane should explain itself."}</h2></header><div>${modules.map(([title, body], index) => `<article><span>0${index + 1}</span><h2>${e(title)}</h2><p>${e(body)}</p>${state("DESIGN INTENT")}</article>`).join("")}</div></section>`;
}

function memory() {
  const layers = [
    ["Working context", "Task-local material required for the current handoff."],
    ["Department context", "Shared vocabulary and operating constraints within a named boundary."],
    ["Provenance", "Where context came from and which task used it."],
    ["Retention decision", "Storage duration and deletion policy remain unannounced."]
  ];
  return `<section class="sd-memory-layers"><header><span>MEMORY STRATA</span><h2>Context accumulates. Authority does not.</h2><p>Memory is presented as an evolving, reviewable system. This page makes no storage, retention, or continual-learning claim.</p></header><ol>${layers.map(([title, body], index) => `<li><span>LAYER ${String(index + 1).padStart(2, "0")}</span><h2>${e(title)}</h2><p>${e(body)}</p></li>`).join("")}</ol></section>`;
}

function trust(path) {
  const security = path === "/security/";
  const enterprise = path === "/enterprise/";
  const title = security ? "Security inside the operation." : enterprise ? "Governance before procurement." : "Judgment stays on the map.";
  const rows = security ? [
    ["Identity boundary", "Who or what may propose an action.", "DESIGN INTENT"],
    ["Credential boundary", "Which capability receives scoped access.", "NOT ANNOUNCED"],
    ["Action trace", "What was requested and what record returned.", "CONCEPT-STAGE"],
    ["Validation", "Certifications, penetration tests, and guarantees.", "UNVERIFIED"]
  ] : enterprise ? [
    ["Ownership", "Named responsibility and escalation needs.", "DISCUSSION"],
    ["Deployment", "Hosting, residency, and environment model.", "NOT ANNOUNCED"],
    ["Support", "Service levels and operating obligations.", "NOT ANNOUNCED"],
    ["Evidence", "Required records and review boundaries.", "OWNER-DEFINED"]
  ] : [
    ["Proposal", "The action a role asks to take.", "RECORDED"],
    ["Context", "The information attached to that request.", "SCOPED"],
    ["Decision", "The accountable human response.", "HUMAN OWNER"],
    ["Next state", "Resume, reject, revise, or request context.", "EXPLICIT"]
  ];
  return `<section class="sd-control-ledger"><header><span>${security ? "IDENTITY / OBSERVABILITY" : enterprise ? "ENTERPRISE OPERATING BRIEF" : "APPROVAL REGISTER"}</span><h2>${e(title)}</h2></header><div role="region" aria-label="${e(title)}" tabindex="0"><table><thead><tr><th>Boundary</th><th>Meaning</th><th>Public state</th></tr></thead><tbody>${rows.map(([name, body, status]) => `<tr><th scope="row">${e(name)}</th><td>${e(body)}</td><td>${state(status)}</td></tr>`).join("")}</tbody></table></div></section>`;
}

function integrations() {
  const groups = [
    ["Communication", "Route a bounded request from a channel into a named workflow."],
    ["Knowledge", "Retrieve scoped context while preserving source and task provenance."],
    ["Browser environment", "Propose browser work within explicit credentials and review limits."],
    ["Business system", "Return a record to the workflow without implying unrestricted write access."],
    ["Model provider", "Treat model selection as a declared route, not an invisible default."],
    ["Custom adapter", "Define capability, input, output, failure, and review as one contract."]
  ];
  return `<section class="sd-connectors"><header><span>CONNECTOR ECOSYSTEM</span><h2>Connection is a contract.</h2><p>These categories describe design intent. No named integration, credential model, or production availability is announced.</p></header><div>${groups.map(([title, body], index) => `<article><span>${String(index + 1).padStart(2, "0")}</span><h2>${e(title)}</h2><p>${e(body)}</p><a href="/security/">Boundary →</a></article>`).join("")}</div></section>`;
}

function developer(path) {
  const docs = path === "/docs/";
  const source = path === "/github/";
  const sample = `department:\n  role: research_coordinator\n  authority: propose_only\nworkflow:\n  on_uncertainty: request_context\n  approval: human_required`;
  return `<section class="sd-dev-bridge"><aside><span>${source ? "SOURCE TRAIL" : docs ? "DOCUMENTATION BRIDGE" : "PROVISIONAL CONTRACT"}</span><h2>${source ? "Verify artifacts at their source." : docs ? "Concepts before commands." : "Compose roles without hiding authority."}</h2><p>${source ? "Repository presence does not prove a production SDK or service. Check scope, history, and licensing directly." : docs ? "The field guide connects departments, workflows, runtime, memory, and approvals. It is not a live API reference." : "This schema is an illustrative design sketch. It was not called against a public endpoint."}</p><div class="sd-dev-links"><a href="/docs/">Documentation</a><a href="/research/">Research</a><a href="/releases/">Release status</a></div></aside><pre aria-label="Illustrative Sandora contract, not a live API"><code>${e(sample)}</code></pre></section>`;
}

function research(path) {
  if (path === "/releases/") return `<section class="sd-release-index"><header><span>RELEASE / NEWS INDEX</span><h2>No invented milestones.</h2><p>Sandora has no public release to report. This registry remains intentionally quiet until an artifact, scope, and evidence state exist.</p></header><article><span>STATUS NOTE</span><h2>Concept-stage direction</h2><p>The website describes an operating model. It does not report a shipped version, benchmark, uptime, compatibility matrix, or launch date.</p>${state("NO PUBLIC RELEASE")}</article></section>`;
  return `<section class="sd-research-index"><header><span>SCIENCE / OPEN ARTIFACTS</span><h2>Study the department, not the magic.</h2><p>The current question is whether role structure, context routing, and approval points make delegated work easier to inspect. No completed experiment or result is reported.</p></header><div><article><span>SCIENCE</span><h2>Inspectability</h2><p>Future work would need a named protocol, task setting, verifier, comparison, and explicit limitations.</p>${state("QUESTION ONLY")}</article><article><span>OPEN ARTIFACTS</span><h2>Source trail</h2><p>Public artifacts should expose scope, history, and licensing without being confused for a released product.</p><a href="/github/">Review the source boundary</a></article></div></section>`;
}

function pricing() {
  const tiers = [
    ["Observer", "Read the operating model", ["Departments and roles", "Approval vocabulary", "Public status"]],
    ["Builder", "Shape a workflow", ["Context boundaries", "Handoff design", "Review requirements"]],
    ["Steward", "Discuss governance", ["Enterprise requirements", "Evidence boundaries", "Human escalation"]]
  ];
  return `<section class="sd-pricing"><header><span>PRICING / NOT ANNOUNCED</span><h2>Status before price.</h2><p>No plan, monetary value, usage allowance, deployment, support level, discount, or guarantee has been approved.</p></header><div class="sd-pricing__tiers">${tiers.map(([name, title, items]) => `<article><span>${e(name)}</span><h2>${e(title)}</h2><strong>COMING SOON</strong><ul>${items.map((item) => `<li>${e(item)}</li>`).join("")}</ul></article>`).join("")}</div><div class="sd-pricing__compare" role="region" aria-label="Illustrative package comparison" tabindex="0"><table><thead><tr><th>Package shape</th><th>Purpose</th><th>Status</th></tr></thead><tbody>${tiers.map(([name, title]) => `<tr><th scope="row">${e(name)}</th><td>${e(title)}</td><td>${state("NOT ANNOUNCED")}</td></tr>`).join("")}</tbody></table></div><div class="sd-faq"><h2>Questions</h2><details><summary>Is Sandora available?</summary><p>No public release or access program is announced.</p></details><details><summary>Can a team discuss requirements?</summary><p>Yes. A conversation does not create access, pricing, deployment, or service commitments.</p></details></div></section>`;
}

function generic(page, mode) {
  if (page.path === "/404.html") return `<section class="sd-error"><span>404 / ROUTE UNKNOWN</span><h2>No route, no assumption.</h2><p>${e(page.lede || page.description)}</p><a href="/">Return to Sandora</a></section>`;
  const sections = page.sections || [];
  return `<section class="sd-generic sd-generic--${e(mode)}">${sections.map((item, index) => `<article><span>${String(index + 1).padStart(2, "0")}</span><h2>${e(item.title)}</h2><p>${e(item.body)}</p>${state(item.status || "CONCEPT-STAGE")}${item.points?.length ? `<ul>${item.points.map((point) => `<li>${e(point)}</li>`).join("")}</ul>` : ""}</article>`).join("")}</section>`;
}

function routeContent(page, mode) {
  let output;
  switch (page.path) {
    case "/departments/": output = departmentDirectory(page); break;
    case "/agents/": output = agentBands(); break;
    case "/workflows/": output = workflow(page); break;
    case "/runtime/":
    case "/observability/": output = platform(page.path); break;
    case "/memory/": output = memory(); break;
    case "/approvals/":
    case "/enterprise/":
    case "/security/": output = trust(page.path); break;
    case "/integrations/": output = integrations(); break;
    case "/developers/":
    case "/docs/":
    case "/github/": output = developer(page.path); break;
    case "/research/":
    case "/releases/": output = research(page.path); break;
    case "/pricing/": output = pricing(); break;
    default: output = generic(page, mode);
  }
  const frameClass = { editorial: "sd-modules", workflow: "sd-runbook", availability: "sd-availability-board", index: "sd-atlas", docs: "sd-manual", comparison: "sd-matrix", media: "sd-observation", ledger: "sd-ledger", product: "sd-product-map", timeline: "sd-chronicle", error: "sd-atlas" }[mode] || "sd-modules";
  return `<div class="${frameClass} sd-layout-frame">${output}</div>`;
}

function handoff(product, page) {
  const cta = page.cta;
  if (!cta) return "";
  return `<aside class="sd-handoff"><span>NEXT HANDOFF</span><div><h2>${e(cta.title || "Continue with an explicit boundary")}</h2><p>${e(cta.body || product.availability.body)}</p></div><a href="${e(cta.href)}"${ext(cta.href)}>${e(cta.label)}</a></aside>`;
}

function noscriptNav(site) {
  const links = site.navigation.flatMap((item) => item.children || [item]);
  return `<noscript><nav class="sd-noscript-nav" aria-label="Primary navigation without JavaScript">${links.map((link) => `<a href="${e(link.href)}"${ext(link.href)}>${e(link.label)}</a>`).join("")}</nav></noscript>`;
}

function footer(product, site) {
  return `<footer class="sd-footer"><div class="sd-footer__lead"><span>SANDORA / OPERATIONAL FIELD ATLAS</span><h2>Human authority remains in the loop.</h2><p>${e(product.proofNote)}</p></div><nav aria-label="Footer">${site.footerGroups.map((group) => `<section><h3>${e(group.title)}</h3>${group.links.map((link) => `<a href="${e(link.href)}"${ext(link.href)}>${e(link.label)}</a>`).join("")}</section>`).join("")}</nav><div class="sd-footer__word" aria-hidden="true">SANDORA</div><div class="sd-footer__base"><span>© <span data-current-year></span> Sandora</span><div><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="https://navinresearch.com/products/">Navin Research ↗</a></div></div></footer>`;
}

function layoutFor(page) {
  if (page.path === "/404.html") return "error";
  if (/pricing|contact/.test(page.path)) return "availability";
  if (/docs|developers|github/.test(page.path)) return "docs";
  if (/research|releases/.test(page.path)) return "timeline";
  if (/security|privacy|terms|observability/.test(page.path)) return "ledger";
  if (/enterprise/.test(page.path)) return "comparison";
  if (/agents|workflows|runtime|memory|approvals/.test(page.path)) return "workflow";
  if (/departments/.test(page.path)) return "index";
  if (/integrations/.test(page.path)) return "media";
  if (/product/.test(page.path)) return "product";
  return page.layout || "editorial";
}

function render(product, site, page) {
  const path = pathOf(page.path);
  const mode = layoutFor(page);
  const homePage = path === "/";
  return `<!doctype html><html lang="en"><head>${headMarkup({ product, page, path, layout: mode, isHome: homePage })}</head><body class="sd-body sd-${e(mode)}" data-product="sandora" data-route="${e(path)}"><a class="skip-link" href="#main-content">Skip to content</a><header class="sd-header"><a class="sd-mark" href="/" aria-label="Sandora home"><i aria-hidden="true"></i><span>SANDORA</span></a><button class="product-menu-button sd-menu-button" type="button" aria-expanded="false" aria-controls="product-menu" data-product-menu>MENU</button><div class="product-menu sd-menu" id="product-menu"><nav aria-label="Primary navigation">${nav(site, path)}</nav><div class="sd-header-actions"><a href="/docs/">Docs</a><a class="sd-access" href="${e(site.primaryCta.href)}"${ext(site.primaryCta.href)}>${e(site.primaryCta.label)}</a></div></div></header>${noscriptNav(site)}<main id="main-content">${homePage ? home(product, site, page) : `${routeLead(page, mode)}${routeContent(page, mode)}${handoff(product, page)}`}</main>${footer(product, site)}</body></html>`;
}

export default function renderSandora(product, site, page) { return render(product, site, page).replace(/[ \t]+$/gm, ""); }
export { layoutFor, pathOf as normalizePath };
