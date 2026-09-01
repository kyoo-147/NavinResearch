import { escapeHtml, headMarkup } from "../product-renderer-helpers.mjs";

const e = escapeHtml;
const ext = (href = "") => /^https?:|^mailto:/.test(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
const pathOf = (value = "/") => value === "/404.html" ? value : (`/${String(value).replace(/^\/+|\/+$/g, "")}/`).replace("//", "/");
const badge = (value = "CONCEPT-STAGE") => `<span class="sd-badge">${e(value)}</span>`;
const arrow = '<span aria-hidden="true">↗</span>';

const mediaDimensions = {
  "hero-atlas.webp": [1915, 821],
};

function media(page, className = "", priority = false) {
  if (!page?.media?.src) return "";
  const filename = page.media.src.split("/").pop();
  const [width, height] = mediaDimensions[filename] || [1672, 941];
  const compact = page.media.src.replace(/\.webp$/, "-960.webp");
  const sizes = className.includes("hero") ? "(max-width: 960px) calc(100vw - 2rem), 52vw" : className.includes("full") ? "calc(100vw - 2rem)" : "(max-width: 760px) calc(100vw - 2rem), 48vw";
  return `<figure class="sd-media ${e(className)}"><div><img src="${e(page.media.src)}" srcset="${e(compact)} 960w, ${e(page.media.src)} ${width}w" sizes="${sizes}" alt="${e(page.media.alt)}" width="${width}" height="${height}"${priority ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"></div><figcaption><span>ORIGINAL / SANDORA</span><span>${e(page.media.caption)}</span></figcaption></figure>`;
}

function nav(site, path) {
  return site.navigation.map((item) => {
    const href = item.href || item.children?.[0]?.href || "/";
    const current = pathOf(href) === path || item.children?.some((child) => pathOf(child.href) === path);
    if (!item.children?.length) return `<a class="sd-nav-link" href="${e(href)}"${current ? ' aria-current="page"' : ""}${ext(href)}>${e(item.label)}</a>`;
    const midpoint = Math.ceil(item.children.length / 2);
    const columns = [item.children.slice(0, midpoint), item.children.slice(midpoint)].filter(Boolean);
    return `<details class="sd-nav-group"${current ? " data-current" : ""}><summary>${e(item.label)}<i aria-hidden="true"></i></summary><div class="sd-mega"><div class="sd-mega-intro"><span>${e(item.label)}</span><strong>Navigate the operating model.</strong><p>Roles, routes, evidence, and authority stay explicit.</p></div>${columns.map((column, columnIndex) => `<nav aria-label="${e(item.label)} links">${column.map((child, index) => `<a href="${e(child.href)}"${pathOf(child.href) === path ? ' aria-current="page"' : ""}${ext(child.href)}><b>${String((columnIndex * midpoint) + index + 1).padStart(2, "0")}</b><span><strong>${e(child.label)}</strong><small>${child.href.replaceAll("/", " ").trim() || "overview"}</small></span></a>`).join("")}</nav>`).join("")}</div></details>`;
  }).join("");
}

function header(site, path) {
  return `<header class="sd-header"><a class="sd-mark" href="/" aria-label="Sandora home"><i aria-hidden="true">S</i><span>SANDORA</span></a><button class="product-menu-button sd-menu-button" type="button" aria-expanded="false" aria-controls="product-menu" data-product-menu>MENU</button><div class="product-menu sd-menu" id="product-menu"><nav aria-label="Primary navigation">${nav(site, path)}</nav><div class="sd-header-actions"><a href="/docs/">Docs</a><a href="${e(site.primaryCta.href)}"${ext(site.primaryCta.href)}>Discuss Sandora ${arrow}</a></div></div></header>`;
}

function noscriptNav(site) {
  const links = site.navigation.flatMap((item) => item.children || [item]);
  return `<noscript><nav class="sd-noscript" aria-label="Primary navigation without JavaScript">${links.map((link) => `<a href="${e(link.href)}"${ext(link.href)}>${e(link.label)}</a>`).join("")}</nav></noscript>`;
}

function evidence(product) {
  return `<section class="sd-evidence" aria-label="Public evidence state">${product.evidence.map((item, index) => `<article><span>${String(index + 1).padStart(2, "0")} / ${e(item.label)}</span><strong>${e(item.value)}</strong>${badge(item.state)}</article>`).join("")}</section>`;
}

function home(product, site, page) {
  const homeMedia = media(page, "sd-media--hero", true);
  return `<div class="sd-modules sd-home">
    <section class="sd-route-lead sd-hero sd-home-hero"><div class="sd-home-hero__copy"><p class="sd-kicker">OPEN DIRECTION · HUMAN-GOVERNED</p><h1>THE OPERATING SYSTEM FOR AN AI DEPARTMENT.</h1><p>${e(page.lede)}</p><div class="sd-command"><span>CONCEPT BRIEF</span><strong>Roles → routes → review</strong><a href="/product/">OPEN THE SYSTEM ${arrow}</a></div></div><div class="sd-home-hero__plate">${homeMedia}<div class="sd-plate-key"><span>01 DEPARTMENTS</span><span>02 WORKFLOWS</span><span>03 AUTHORITY</span></div></div></section>
    ${evidence(product)}
    <section class="sd-factory-intro sd-light"><header><span>INDUSTRIAL THESIS / 01</span><h2>Responsibility before automation.</h2></header><div><p>${e(product.intro)}</p><p>${e(product.proofNote)}</p></div></section>
    <section class="sd-proof-window sd-light"><div class="sd-window-bar"><span>SANDORA / OPERATING MODEL</span>${badge("DESIGN INTENT")}</div><div class="sd-window-grid"><aside><a href="/departments/" aria-current="page">01 Departments</a><a href="/agents/">02 Agents</a><a href="/workflows/">03 Workflows</a><a href="/runtime/">04 Runtime</a><a href="/approvals/">05 Approvals</a></aside><div><span>THE CHALLENGE</span><h2>Delegated work becomes opaque when roles, context, and decisions disappear inside one assistant.</h2><hr><span>THE SANDORA DIRECTION</span><p>Model an AI department as accountable operating territory: each role has a boundary, each handoff carries context, and each consequential action stops for a person.</p><ol><li>Named responsibility</li><li>Readable state</li><li>Human decision</li></ol></div></div></section>
    <section class="sd-home-capabilities sd-light"><header><span>PRODUCT / WORKFLOW NARRATIVE</span><h2>Six surfaces. One visible operating model.</h2></header><div class="sd-capability-grid"><a href="/departments/"><b>01</b><h3>Departments</h3><p>Function, controls, context, and accountable outcome.</p></a><a href="/agents/"><b>02</b><h3>Persistent agents</h3><p>Durable roles—not disposable chat cards.</p></a><a href="/workflows/"><b>03</b><h3>Workflow routes</h3><p>Stages, context, pauses, and returned records.</p></a><a href="/memory/"><b>04</b><h3>Memory</h3><p>Scoped context with provenance and retention unknowns.</p></a><a href="/approvals/"><b>05</b><h3>Approvals</h3><p>Human authority modeled as a state transition.</p></a><a href="/observability/"><b>06</b><h3>Observability</h3><p>Events, open questions, and interventions.</p></a></div></section>
    <section class="sd-home-route"><div><span>WORKFLOW / HANDOFF</span><h2>Automate the route.<br>Not the judgment.</h2><p>A proposed run moves through named stages and stops wherever authority or uncertainty requires review.</p><a href="/workflows/">INSPECT THE SEQUENCE ${arrow}</a></div>${media({ media: { src: "/products/media/sandora/workflow-river.webp", alt: "Original branching workflow route with checkpoints and an amber approval gate", caption: "Illustrative workflow trace — not a live run" } }, "sd-media--route")}</section>
    <section class="sd-technical sd-light"><header><span>TECHNICAL SURFACES / 02</span><h2>The operation should explain itself.</h2></header><div class="sd-tech-layout">${media({ media: { src: "/products/media/sandora/runtime-observatory.webp", alt: "Original abstract runtime observatory connected across an operational map", caption: "Proposed platform study — not production telemetry" } }, "sd-media--tech")}<div><article><b>01</b><h3>Runtime</h3><p>Worker states and execution lanes remain distinct.</p><a href="/runtime/">View runtime ${arrow}</a></article><article><b>02</b><h3>Observability</h3><p>Events record what is known, missing, and changed.</p><a href="/observability/">View events ${arrow}</a></article><article><b>03</b><h3>Memory</h3><p>Context stays scoped to the work that needs it.</p><a href="/memory/">View memory ${arrow}</a></article></div></div></section>
    <section class="sd-home-evidence"><div><span>HUMAN AUTHORITY / 03</span><h2>The stop is part of the system.</h2><p>No autonomous authority, production enforcement, security certification, customer result, or deployment is claimed.</p><a href="/approvals/">READ THE CONTROL MODEL ${arrow}</a></div>${media({ media: { src: "/products/media/sandora/approvals-boundary.webp", alt: "Original concentric operational boundary with a central amber authorization point", caption: "Approval boundary study — no enforcement claim" } }, "sd-media--control")}</section>
    <section class="sd-home-close sd-light"><span>QUIET CONVERSION / HUMAN ENTRY</span><h2>Bring the workflow.<br>Keep the boundary.</h2><p>Discussing Sandora does not create access, pricing, deployment, or service commitments.</p><a href="${e(site.primaryCta.href)}"${ext(site.primaryCta.href)}>DISCUSS SANDORA ${arrow}</a></section>
  </div>`;
}

function routeHero(page, variant = "light") {
  const solo = page?.media?.src ? "" : " sd-route-hero--solo";
  return `<section class="sd-route-lead sd-route-hero sd-route-hero--${e(variant)}${solo}"><div><span>${e(page.eyebrow)}</span><h1>${e(page.headline)}</h1><p>${e(page.lede)}</p><div class="sd-boundary-line"><span>OWNER <b>HUMAN</b></span><span>STATE <b>EXPLICIT</b></span><span>EVIDENCE <b>BOUNDED</b></span></div></div>${media(page, "sd-media--route-hero", true)}</section>`;
}

function departments(page) {
  const units = [
    ["Operations", "Unclear process ownership", "Named routes and review points", "Existing operating environment", "Visible handoffs"],
    ["Research", "Sources collapse into claims", "Evidence and unknowns stay separate", "Human-selected questions", "Reviewable trail"],
    ["Knowledge", "Context arrives without provenance", "Scoped retrieval and source record", "Department boundary", "Traceable context"],
    ["Communications", "Draft becomes publication", "Explicit release decision", "Human-owned channels", "Accountable output"],
    ["Finance", "Automation implies authority", "Proposal-only action boundary", "Consequential review", "No autonomous control"]
  ];
  return `<div class="sd-atlas sd-departments sd-light">${routeHero(page)}<section class="sd-solution-console"><header><span>DEPARTMENT SOLUTIONS</span><h2>Function and risk—not character cards.</h2></header><div class="sd-solution-shell"><aside>${units.map((unit, index) => `<a href="#department-${index + 1}"${index === 0 ? ' aria-current="true"' : ""}>${String(index + 1).padStart(2, "0")} ${e(unit[0])}</a>`).join("")}</aside><div><span>THE CHALLENGE</span><h3>Organizations need delegated work without losing responsibility.</h3><p>A department is defined by its problem, controls, deployment context, and human outcome—not by an invented personality.</p><hr><span>HOW THE MODEL HELPS</span><ol><li>Expose ownership before execution.</li><li>Carry context across handoffs.</li><li>Stop at consequential decisions.</li></ol></div></div></section><section class="sd-department-tiles">${units.map(([name, problem, controls, context, outcome], index) => `<article id="department-${index + 1}"><header><span>${String(index + 1).padStart(2, "0")}</span><h2>${e(name)}</h2>${badge("DESIGN INTENT")}</header><dl><div><dt>Problem</dt><dd>${e(problem)}</dd></div><div><dt>Controls</dt><dd>${e(controls)}</dd></div><div><dt>Context</dt><dd>${e(context)}</dd></div><div><dt>Human outcome</dt><dd>${e(outcome)}</dd></div></dl></article>`).join("")}</section>${handoff("Departments are illustrative operating territories. No configured team is claimed.", "/enterprise/", "Review enterprise boundaries")}</div>`;
}

function agents(page) {
  const features = [
    ["Persistent role", "A role carries a named responsibility and scope across workflows.", "/products/media/sandora/agents-specimens.webp", "Original abstract role specimens"],
    ["Memory and context", "Context remains attached to the department and task that may use it.", "/products/media/sandora/memory-strata.webp", "Original memory strata"],
    ["Channels", "Requests can enter through bounded channels without becoming authority.", "/products/media/sandora/workflow-river.webp", "Original channel and workflow route"],
    ["Schedules", "Repeatability is a workflow property; public scheduling availability is not announced.", "/products/media/sandora/runtime-observatory.webp", "Original runtime observatory"],
    ["Tools and devices", "Capabilities require explicit contracts, credentials, and returned records.", "/products/media/sandora/approvals-boundary.webp", "Original capability boundary"],
    ["Human review", "Consequential work pauses for a named person.", "/products/media/sandora/research-map-room.webp", "Original review map room"]
  ];
  return `<div class="sd-runbook sd-agents">${routeHero(page, "cobalt")}<div class="sd-agent-marquee" aria-hidden="true">A ROLE · A BOUNDARY · A RECORD · A ROLE · A BOUNDARY ·</div><section class="sd-agent-features">${features.map(([title, body, src, alt], index) => `<article><div class="sd-feature-visual"><img src="${src.replace(/\.webp$/, "-960.webp")}" alt="${e(alt)}" width="960" height="540" loading="lazy" decoding="async"><span>${String(index + 1).padStart(2, "0")} / ${e(title)}</span></div><div><h2>${e(title)}</h2><p>${e(body)}</p>${badge(index === 5 ? "HUMAN OWNER" : "CONCEPT-STAGE")}</div></article>`).join("")}</section><section class="sd-agent-research"><div><span>AGENT RESEARCH BRIDGE</span><h2>Persistent does not mean autonomous.</h2></div><div><p>Long-lived roles raise questions about memory, intervention, provenance, and retention. Sandora reports those as open design questions—not solved behavior.</p><a href="/research/">OPEN RESEARCH ${arrow}</a></div></section>${distribution()}</div>`;
}

function workflowDiagram() {
  return `<div class="sd-workflow-diagram" role="img" aria-label="Illustrative workflow with intake, delegation, work, review, and record stages"><span>INTAKE</span><i></i><span>DELEGATE</span><i></i><span>WORK</span><i></i><strong>HUMAN REVIEW</strong><i></i><span>RECORD</span></div>`;
}

function workflows(page) {
  const stages = [["01", "Intake", "Record request, source, and missing context."], ["02", "Delegate", "Choose a named role and preserve the reason."], ["03", "Execute", "Return events and artifacts—not hidden progress."], ["04", "Review", "Pause for authority, uncertainty, or consequence."], ["05", "Record", "Attach the human decision to the next state."]];
  return `<div class="sd-runbook sd-workflows sd-light">${routeHero(page)}<section class="sd-workflow-proof">${workflowDiagram()}<div><span>REAL SEQUENCE / ILLUSTRATIVE STATE</span><h2>Make the handoff inspectable.</h2><p>The model shows where work entered, which role received it, what context moved, and why a person intervened.</p></div></section><section class="sd-stage-list"><header><span>CONCRETE WORKFLOW STAGES</span><h2>Five states, one accountable route.</h2></header><ol>${stages.map(([number, title, body]) => `<li><span>${number}</span><h3>${e(title)}</h3><p>${e(body)}</p>${badge(title === "Review" ? "APPROVAL GATE" : "PROPOSED")}</li>`).join("")}</ol></section><section class="sd-template-proof"><div><span>TEMPLATE / CONFIGURATION EVIDENCE</span><h2>A template is a contract, not a promise.</h2><p>This example communicates structure only. No public workflow library or execution endpoint is announced.</p></div><pre aria-label="Illustrative workflow configuration"><code>workflow: evidence_review\nintake: record_source\ndelegate: research_role\non_unknown: request_context\non_consequence: human_review\ncomplete: attach_decision</code></pre></section><section class="sd-workflow-examples"><article><span>RESEARCH</span><h3>Source → synthesis → review</h3><p>Keep evidence, inference, and unknowns separate.</p></article><article><span>OPERATIONS</span><h3>Request → route → checkpoint</h3><p>Expose ownership at every handoff.</p></article><article><span>COMMUNICATIONS</span><h3>Draft → verify → publish decision</h3><p>Preparation never silently becomes release.</p></article></section>${handoff("No live workflow or template catalog is claimed.", "/docs/", "Read the workflow concepts")}</div>`;
}

function platformHero(page, kind) {
  const observability = kind === "observability";
  return `<section class="sd-route-lead sd-platform-hero"><div><span>${observability ? "OBSERVABILITY" : "RUNTIME"} / PLATFORM PRIMITIVE</span><h1>${e(page.headline)}</h1><p>${e(page.lede)}</p><div><a href="/docs/">READ THE DOCS ${arrow}</a><a href="/developers/">DEVELOPER ROUTE ${arrow}</a></div></div>${observability ? tracePanel() : architecturePanel()}</section>`;
}

function architecturePanel() {
  return `<div class="sd-architecture" role="img" aria-label="Illustrative architecture showing human request, control plane, workers, records, and approval"><span>HUMAN REQUEST</span><i></i><div><b>CONTROL PLANE</b><small>ROUTE · STATE · EVIDENCE</small></div><i></i><div class="sd-architecture-workers"><span>WORKER A</span><span>WORKER B</span><span>WORKER C</span></div><strong>APPROVAL REQUIRED</strong></div>`;
}

function tracePanel() {
  return `<div class="sd-trace-panel" role="region" aria-label="Illustrative event trace"><header><span>EVENT TRACE / PROPOSED</span><b>WAITING FOR REVIEW</b></header><ol><li><time>00:01</time><span>request.received</span><b>KNOWN</b></li><li><time>00:03</time><span>role.assigned</span><b>KNOWN</b></li><li><time>00:14</time><span>context.missing</span><b>OPEN</b></li><li><time>00:15</time><span>human.review</span><b>WAIT</b></li></ol></div>`;
}

function platform(page, kind) {
  const observability = kind === "observability";
  const modules = observability ? [["Session replay", "Reconstruct the proposed sequence without claiming production capture."], ["Structured events", "Filter role, state, question, and intervention."], ["Context trace", "Show which source entered which step."], ["Human decision", "Connect approval or rejection to the next state."]] : [["Execution lane", "Bounded work and returned records."], ["Worker state", "Queued, running, waiting, stopped, or unresolved."], ["Capability contract", "Named input, output, failure, and review."], ["Failure shield", "Stop safely when state or authority is unclear."]];
  return `<div class="${observability ? "sd-ledger" : "sd-runbook"} sd-platform sd-light">${platformHero(page, kind)}<div class="sd-grid-break"><i></i><i></i><i></i></div><section class="sd-platform-explain"><div>${media(page, "sd-media--platform")}</div><div><span>${observability ? "WHAT THE TRACE NEEDS" : "SANDBOXED OPERATING MODEL"}</span><h2>${observability ? "See what changed before deciding what it means." : "A runtime should expose its boundary."}</h2><p>${observability ? "Events, prompts, context, tool returns, and interventions remain different record types." : "Workers receive bounded capability and return explicit state. Provider compatibility and deployment remain unannounced."}</p></div></section><section class="sd-platform-modules"><header><span>PLATFORM MODULES</span><h2>${observability ? "A debugging layer for delegated work." : "Stop managing invisible state."}</h2></header><div>${modules.map(([title, body], index) => `<article><span>${String(index + 1).padStart(2, "0")}</span><h3>${e(title)}</h3><p>${e(body)}</p>${badge("DESIGN INTENT")}</article>`).join("")}</div></section><section class="sd-platform-code"><pre><code>event: context.missing\nrole: research_coordinator\nworkflow: evidence_review\naction: request_context\nauthority: human_required</code></pre><div><span>READABLE EVENT CONTRACT</span><h2>Logs are not explanations.</h2><p>A record must preserve scope, source, uncertainty, and the decision that changed the route.</p></div></section>${handoff("Architecture and traces are illustrative; no live runtime is asserted.", "/enterprise/", "Discuss operating requirements")}</div>`;
}

function memory(page) {
  const layers = [["Persistent state", "Maintain scoped working context across handoffs."], ["Learning boundary", "Separate updated context from unqualified learning claims."], ["Provenance", "Keep source and use attached to each context fragment."], ["Retention", "Report storage and deletion as unresolved until announced."]];
  return `<div class="sd-runbook sd-memory">${routeHero(page, "cobalt")}<div class="sd-agent-marquee" aria-hidden="true">CONTEXT · PROVENANCE · RETENTION · CONTEXT · PROVENANCE ·</div><section class="sd-memory-bands">${layers.map(([title, body], index) => `<article><div><span>0${index + 1} / MEMORY LAYER</span><h2>${e(title)}</h2><p>${e(body)}</p>${badge(index === 3 ? "NOT ANNOUNCED" : "DESIGN INTENT")}</div><div class="sd-memory-core"><i></i><i></i><i></i><strong>${String(index + 1).padStart(2, "0")}</strong></div></article>`).join("")}</section><section class="sd-agent-research"><div><span>RESEARCH BRIDGE</span><h2>Memory needs a method.</h2></div><div><p>Evaluation must distinguish retrieval, persistence, adaptation, forgetting, and human correction. No continual-learning result is claimed.</p><a href="/research/">RESEARCH QUESTIONS ${arrow}</a></div></section>${distribution()}</div>`;
}

function distribution() {
  return `<section class="sd-distribution sd-light"><div><span>DISTRIBUTION / STATUS</span><h2>One model. Multiple future entry points.</h2></div><nav aria-label="Potential Sandora distribution surfaces"><a href="/docs/">Use the field guide ${arrow}</a><a href="/developers/">Review the contract ${arrow}</a><a href="/releases/">Check release status ${arrow}</a></nav></section>`;
}

function enterprise(page) {
  const requirements = [["Scale envelope", "Workload shape, concurrency, and capacity remain requirements—not published limits."], ["Reliability model", "Failure, recovery, and escalation need agreed evidence before any assurance."], ["Deployment boundary", "Hosting, residency, isolation, and support are not announced."], ["Trust record", "Controls must be mapped to reviewable artifacts; no certification is claimed."]];
  return `<div class="sd-matrix sd-enterprise sd-light"><section class="sd-route-lead sd-enterprise-hero"><div><span>ENTERPRISE / REQUIREMENTS BRIEF</span><h1>Design for scrutiny before scale.</h1><p>${e(page.lede)}</p><div><a href="/contact/">DISCUSS REQUIREMENTS ${arrow}</a><a href="/security/">REVIEW BOUNDARIES ${arrow}</a></div></div>${media(page, "sd-media--enterprise", true)}</section><section class="sd-enterprise-proof"><header><span>PLATFORM EVIDENCE / NOT YET AVAILABLE</span><h2>Reliability is a proof obligation.</h2><p>Sandora publishes no uptime, throughput, latency, customer, deployment, or service-level claim. This surface names the evidence a future enterprise evaluation would require.</p></header><div>${requirements.map(([title, body], index) => `<article><span>0${index + 1}</span><h3>${e(title)}</h3><p>${e(body)}</p>${badge(index < 2 ? "REQUIRES EVIDENCE" : "NOT ANNOUNCED")}</article>`).join("")}</div></section><section class="sd-enterprise-trust"><div><span>TRUST / GOVERNANCE</span><h2>A serious system should show where assurance stops.</h2><p>Identity, capability, context, human authority, records, and incident response remain separate review domains.</p></div><ol><li><b>01</b><span>Map the operating boundary.</span></li><li><b>02</b><span>Name required evidence.</span></li><li><b>03</b><span>Record every unknown.</span></li><li><b>04</b><span>Do not convert discussion into assurance.</span></li></ol></section>${handoff("A requirements discussion is not a demo, deployment, SLA, or service commitment.", "/contact/", "Request a human discussion")}</div>`;
}

function controls(page, kind) {
  const security = kind === "security";
  const enterprise = kind === "enterprise";
  const title = security ? "Security inside the operation." : enterprise ? "The operating model for serious requirements." : "Approval is an accountable transition.";
  const controls = security ? [["Identity boundary", "Name the actor, role, and capability."], ["Action visibility", "Expose request, return, and failure."], ["Context boundary", "Limit what enters the task."], ["Intervention", "Make human review a recorded event."]] : enterprise ? [["Deployment", "Hosting and residency are not announced."], ["Governance", "Roles and escalation remain owner-defined."], ["Integration", "Each connector needs a capability contract."], ["Evidence", "Records must match the buyer's review boundary."]] : [["Proposal", "Record the requested action."], ["Review context", "Attach evidence and unresolved questions."], ["Decision", "Human accepts, rejects, revises, or asks for context."], ["Next state", "Resume only from an explicit decision."]];
  const frame = enterprise ? "sd-matrix" : security ? "sd-ledger" : "sd-runbook";
  return `<div class="${frame} sd-controls sd-light">${routeHero(page)}<section class="sd-control-thesis"><div><span>${security ? "IDENTITY + OBSERVABILITY" : enterprise ? "ENTERPRISE OPERATING BRIEF" : "GOVERNANCE + DEPLOYMENT"}</span><h2>${e(title)}</h2><p>${security ? "Security is presented through operational boundaries—not an unverified trust page." : enterprise ? "Start with deployment, governance, integration, and evidence requirements. No scale or reliability result is claimed." : "A review gate should show who proposed what, which context supported it, and which person changed the state."}</p></div>${security ? tracePanel() : architecturePanel()}</section><section class="sd-control-grid">${controls.map(([name, body], index) => `<article><span>0${index + 1}</span><h3>${e(name)}</h3><p>${e(body)}</p>${badge(index === controls.length - 1 ? "HUMAN OWNER" : "DESIGN INTENT")}</article>`).join("")}</section><section class="sd-control-table"><header><span>PUBLIC CLAIM BOUNDARY</span><h2>Evidence before assurance.</h2></header><div role="region" aria-label="Sandora public claim boundary" tabindex="0"><table><thead><tr><th>Area</th><th>Current public statement</th><th>State</th></tr></thead><tbody><tr><th scope="row">Controls</th><td>Named as design intent only</td><td>${badge("CONCEPT-STAGE")}</td></tr><tr><th scope="row">Deployment</th><td>No hosting, residency, or isolation model announced</td><td>${badge("NOT ANNOUNCED")}</td></tr><tr><th scope="row">Validation</th><td>No certification, audit, penetration test, or guarantee claimed</td><td>${badge("UNVERIFIED")}</td></tr><tr><th scope="row">Authority</th><td>Consequential decisions remain human-owned</td><td>${badge("HUMAN OWNER")}</td></tr></tbody></table></div></section>${handoff("Requirements discussion is not a deployment or service commitment.", security ? "/privacy/" : "/contact/", security ? "Read the privacy notice" : "Discuss requirements")}</div>`;
}

function integrations(page) {
  const connectors = [["CO", "Communication", "Route bounded requests into named workflows."], ["KN", "Knowledge", "Retrieve scoped context with provenance."], ["BR", "Browser environment", "Propose web work within credential limits."], ["BS", "Business system", "Return a record without implying unrestricted write access."], ["MP", "Model provider", "Declare model routing instead of hiding it."], ["CA", "Custom adapter", "Define input, output, failure, and review."]];
  return `<div class="sd-observation sd-integrations sd-light">${routeHero(page)}<section class="sd-ecosystem"><header><span>CONNECTOR ECOSYSTEM</span><h2>Connect the route—not a logo wall.</h2><p>No named integration, credential model, or production availability is announced.</p></header><div>${connectors.map(([mark, title, body], index) => `<article><i aria-hidden="true">${mark}</i><span>0${index + 1}</span><h3>${e(title)}</h3><p>${e(body)}</p>${badge("CATEGORY ONLY")}</article>`).join("")}</div></section><section class="sd-integration-flow"><div><span>WORKFLOW-LEVEL EXPLANATION</span><h2>One connection. Four boundaries.</h2><ol><li><b>01</b>Capability</li><li><b>02</b>Credential</li><li><b>03</b>Returned record</li><li><b>04</b>Human review</li></ol></div>${architecturePanel()}</section><section class="sd-connector-notes"><article><h3>Department context</h3><p>A connector receives only the context required for its role.</p></article><article><h3>Failure behavior</h3><p>Unknown or partial state stops rather than silently succeeding.</p></article><article><h3>Audit boundary</h3><p>Requests and returns remain distinct from approval.</p></article></section>${handoff("Connector categories are design direction, not compatibility claims.", "/developers/", "Review the adapter contract")}</div>`;
}

function developers(page) {
  return `<div class="sd-manual sd-developers sd-light">${routeHero(page)}<section class="sd-api-first"><div><span>PROVISIONAL CONTRACT</span><h2>Compose roles without hiding authority.</h2><p>No public endpoint, API key, SDK, package, or compatibility matrix is announced. The following is explanatory syntax.</p><div><a href="/docs/">READ CONCEPTS ${arrow}</a><a href="/contact/">DISCUSS ACCESS ${arrow}</a></div></div><pre><code>department:\n  role: research_coordinator\n  authority: propose_only\nworkflow:\n  on_unknown: request_context\n  on_consequence: human_review\nrecord:\n  attach: [source, event, decision]</code></pre></section><section class="sd-quickstart"><header><span>QUICKSTART PATH / NO EXECUTION CLAIM</span><h2>Start with the operating contract.</h2></header><ol><li><b>01</b><h3>Name the role</h3><p>Define responsibility and prohibited action.</p></li><li><b>02</b><h3>Map the workflow</h3><p>List stages, context, and failure states.</p></li><li><b>03</b><h3>Place the review</h3><p>Assign human ownership before execution.</p></li></ol></section><section class="sd-dev-templates"><header><span>TEMPLATE FAMILIES</span><h2>Patterns, not runnable artifacts.</h2></header><div><article><span>RESEARCH</span><h3>Evidence review</h3><p>Source → synthesis → human verification.</p></article><article><span>OPERATIONS</span><h3>Exception route</h3><p>Request → worker → unresolved → escalation.</p></article><article><span>COMMUNICATIONS</span><h3>Publication gate</h3><p>Draft → factual review → release decision.</p></article></div></section>${handoff("Developer material is conceptual and was not called against a live service.", "/github/", "Review the source boundary")}</div>`;
}

function docs(page) {
  const groups = [
    ["Welcome", [["Product overview", "#doc-overview"], ["Operating vocabulary", "/product/"], ["Public status", "/releases/"]]],
    ["Platform", [["Departments", "/departments/"], ["Agents", "/agents/"], ["Runtime", "/runtime/"], ["Memory", "/memory/"], ["Approvals", "/approvals/"]]],
    ["Build", [["Workflow concepts", "/workflows/"], ["Connector contracts", "/integrations/"], ["Illustrative schemas", "/developers/"]]],
    ["Evidence", [["Research questions", "/research/"], ["Release status", "/releases/"], ["Claim boundaries", "/security/"]]]
  ];
  return `<div class="sd-manual sd-docs sd-light"><section class="sd-route-lead sd-doc-shell"><aside><a class="sd-doc-brand" href="/">S / SANDORA</a><label>DOCUMENT INDEX</label>${groups.map(([group, items], index) => `<section><h2>${e(group)}</h2>${items.map(([item, href], itemIndex) => `<a href="${href}"${index === 0 && itemIndex === 0 ? ' aria-current="page"' : ""}>${e(item)}</a>`).join("")}</section>`).join("")}<a href="/contact/">Support / human reply ${arrow}</a></aside><article id="doc-overview"><header><span>WELCOME</span><h1>Introducing the Sandora operating model.</h1><p>${e(page.lede)}</p></header><section class="sd-doc-activation" aria-labelledby="docs-access"><div><span>ACCOUNT / KEY / ACTIVATION</span><h2 id="docs-access">No activation path is announced.</h2><p>There is no public account, API key, SDK, or onboarding flow. Start with the operating concepts; contact creates a conversation only.</p></div><ol><li><b>01</b>Read the model</li><li><b>02</b>Map one bounded workflow</li><li><b>03</b>Discuss unresolved requirements</li></ol></section><section class="sd-doc-cards">${[["Quickstart", "Map one role and one review boundary."], ["Workflow concepts", "Understand stages, handoffs, and stop states."], ["Templates", "Inspect explanatory patterns—not runnable artifacts."], ["Contract reference", "Read illustrative role and event schemas."]].map(([title, body], index) => `<a href="${index === 3 ? "/developers/" : "/workflows/"}"><i>0${index + 1}</i><h2>${e(title)}</h2><p>${e(body)}</p>${arrow}</a>`).join("")}</section><section class="sd-doc-platform"><h2>The Sandora platform direction</h2><p>Everything required to keep delegated work visible—without implying a released platform.</p><div>${[["Departments", "/departments/"], ["Agents", "/agents/"], ["Runtime", "/runtime/"], ["Memory", "/memory/"], ["Approvals", "/approvals/"]].map(([title, href]) => `<a href="${href}"><i aria-hidden="true"></i><h3>${title}</h3>${arrow}</a>`).join("")}</div></section><section class="sd-doc-usecases"><h2>Explore operating patterns</h2><div><article><h3>Evidence review</h3><p>Separate source, inference, and decision.</p></article><article><h3>Exception handling</h3><p>Stop when context or authority is missing.</p></article><article><h3>Publication control</h3><p>Keep drafting distinct from release.</p></article></div></section><div class="sd-doc-feedback"><span>Was this concept page clear?</span><a href="/contact/">Send context ${arrow}</a></div></article></section></div>`;
}

function research(page) {
  const disciplines = [["Role architecture", "Responsibility and handoff design."], ["Human oversight", "Intervention, review, and decision ownership."], ["Memory systems", "Persistence, provenance, and forgetting."], ["Workflow evidence", "Events, artifacts, and verifier boundaries."], ["Connector safety", "Capability and credential contracts."], ["Organizational evaluation", "Inspectability without invented performance."]];
  return `<div class="sd-chronicle sd-research sd-light">${routeHero(page)}<section class="sd-science"><header><span>SCIENCE FAMILY</span><h2>Research for accountable AI departments.</h2><p>The current site reports questions only. It does not claim completed studies, papers, results, or novelty.</p></header><div>${disciplines.map(([title, body], index) => `<article><span>0${index + 1}</span><h3>${e(title)}</h3><p>${e(body)}</p></article>`).join("")}</div></section><section class="sd-open-family"><div><span>OPEN ARTIFACT FAMILY</span><h2>Methods before milestones.</h2><p>Any future artifact should expose its question, protocol, setting, evidence, limitations, and release state.</p></div><div><article><span>QUESTION</span><h3>Does explicit role structure improve inspectability?</h3>${badge("OPEN")}</article><article><span>METHOD REQUIREMENT</span><h3>Named tasks, verifier, comparison, and limitations.</h3>${badge("NOT RUN")}</article><article><span>PRODUCT BRIDGE</span><h3>Memory, workflows, and approvals define the study surface.</h3>${badge("DESIGN LINK")}</article></div></section>${handoff("No completed experiment or performance result is reported.", "/releases/", "Check artifact status")}</div>`;
}

function pricing(page) {
  const plans = [["01", "Observer", "Read the model", ["Department vocabulary", "Workflow concepts", "Public evidence state"]], ["02", "Builder", "Shape a route", ["Role boundaries", "Handoff map", "Review requirements"]], ["03", "Steward", "Frame governance", ["Human escalation", "Evidence needs", "Enterprise questions"]], ["04", "Team", "Shared operating brief", ["Team roles", "Common boundaries", "Review ownership"]], ["05", "Organization", "Tailored requirements", ["Deployment questions", "Connector boundaries", "Support questions"]], ["06", "Enterprise", "Governed discussion", ["Residency questions", "Evidence/legal path", "No SLA claim"]]];
  return `<div class="sd-availability-board sd-pricing-page sd-light"><section class="sd-route-lead sd-pricing-head"><span>PLANS / PUBLIC STATUS</span><h1>Pricing plans.</h1><p>${e(page.lede)}</p></section><section class="sd-plan-grid">${plans.map(([number, name, purpose, points]) => `<article><span>${number}</span><header><h2>${name}</h2><strong>COMING SOON</strong></header><p>${purpose}</p><hr><ul>${points.map((point) => `<li>${e(point)}</li>`).join("")}</ul><a href="/contact/">DISCUSS REQUIREMENTS ${arrow}</a></article>`).join("")}</section><section class="sd-plan-compare"><header><span>FEATURE COMPARISON / STATUS ONLY</span><h2>Compare the questions, not entitlements.</h2></header><div role="region" aria-label="Illustrative package comparison" tabindex="0"><table><thead><tr><th>Surface</th><th>Observer</th><th>Builder</th><th>Steward</th><th>Organization</th></tr></thead><tbody><tr><th scope="row">Concept documentation</th><td>Direction</td><td>Direction</td><td>Direction</td><td>Direction</td></tr><tr><th scope="row">Workflow requirements</th><td>—</td><td>Discuss</td><td>Discuss</td><td>Discuss</td></tr><tr><th scope="row">Governance requirements</th><td>—</td><td>—</td><td>Discuss</td><td>Discuss</td></tr><tr><th scope="row">Price / entitlement</th><td colspan="4">NOT ANNOUNCED</td></tr></tbody></table></div></section><section class="sd-plan-faq"><header><span>FAQ</span><h2>Unknown values stay blank.</h2></header><div><details><summary>Is Sandora available?</summary><p>No public product, access program, or release is announced.</p></details><details><summary>Are these purchasable plans?</summary><p>No. They are package shapes used to organize future questions.</p></details><details><summary>What does a discussion create?</summary><p>A human conversation only—not access, pricing, deployment, or service commitments.</p></details></div></section>${handoff("No price, allowance, plan entitlement, discount, or guarantee is approved.", "/contact/", "Discuss future requirements")}</div>`;
}

function releases(page) {
  const cards = [["PRODUCT DIRECTION", "Operational Field Atlas", "Website direction", "/product/", "CONCEPT-STAGE"], ["RESEARCH", "Open questions", "Date not announced", "/research/", "QUESTION ONLY"], ["DEVELOPER", "Provisional contract", "Version not announced", "/developers/", "NOT RELEASED"], ["ACCESS", "Public program", "Date not announced", "/contact/", "NOT ANNOUNCED"]];
  return `<div class="sd-chronicle sd-releases sd-light"><section class="sd-route-lead sd-news-head"><span>RELEASE / NEWS INDEX</span><h1>No invented milestones.</h1><p>${e(page.lede)}</p></section><section class="sd-news-grid">${cards.map(([category, title, metadata, href, state], index) => `<article${index === 0 ? ' class="sd-news-feature"' : ""}>${index === 0 ? `<div class="sd-news-visual">${media(page, "sd-media--news")}</div>` : ""}<span>${category}</span><small>${metadata} · ${state}</small><h2>${title}</h2><p>${index === 0 ? "The public website documents a concept-stage operating model. It does not announce a product release." : "The linked page records current public scope without implying a shipped artifact."}</p><a href="${href}">OPEN RECORD ${arrow}</a></article>`).join("")}</section><section class="sd-news-ledger"><header><span>CATEGORY</span><span>ITEM / METADATA</span><span>STATE</span></header>${cards.map(([category, title, metadata,,state]) => `<div><span>${category}</span><strong>${title} · ${metadata}</strong>${badge(state)}</div>`).join("")}</section></div>`;
}

function generic(page, mode) {
  if (page.path === "/404.html") return `<div class="sd-route-lead sd-error"><span>404 / ROUTE UNKNOWN</span><h1>No route.<br>No assumption.</h1><p>${e(page.lede)}</p><a href="/">RETURN TO SANDORA ${arrow}</a></div>`;
  return `<div class="sd-generic sd-light">${routeHero(page)}<section><header><span>${e(mode.toUpperCase())} / PUBLIC NOTICE</span><h2>Keep the scope explicit.</h2></header><div>${(page.sections || []).map((section, index) => `<article><span>0${index + 1}</span><h3>${e(section.title)}</h3><p>${e(section.body)}</p>${badge(section.status)}</article>`).join("")}</div></section></div>`;
}

function handoff(body, href, label) {
  return `<aside class="sd-handoff"><span>NEXT HANDOFF</span><div><h2>Continue with the boundary visible.</h2><p>${e(body)}</p></div><a href="${e(href)}"${ext(href)}>${e(label)} ${arrow}</a></aside>`;
}

function pageContent(page, mode) {
  switch (page.path) {
    case "/departments/": return departments(page);
    case "/agents/": return agents(page);
    case "/workflows/": return workflows(page);
    case "/runtime/": return platform(page, "runtime");
    case "/observability/": return platform(page, "observability");
    case "/memory/": return memory(page);
    case "/approvals/": return controls(page, "approvals");
    case "/enterprise/": return enterprise(page);
    case "/security/": return controls(page, "security");
    case "/integrations/": return integrations(page);
    case "/developers/": return developers(page);
    case "/docs/": return docs(page);
    case "/research/": return research(page);
    case "/pricing/": return pricing(page);
    case "/releases/": return releases(page);
    default: {
      const frame = { product: "sd-product-map", docs: "sd-manual", timeline: "sd-chronicle", ledger: "sd-ledger", availability: "sd-availability-board", error: "sd-error" }[mode] || "sd-modules";
      return `<div class="${frame}">${generic(page, mode)}</div>`;
    }
  }
}

function footer(product, site) {
  return `<footer class="sd-footer"><div class="sd-footer-intro"><span>SANDORA / OPERATIONAL FIELD ATLAS</span><h2>Human authority remains in the loop.</h2><p>${e(product.proofNote)}</p></div><div class="sd-footer-matrix"><div class="sd-footer-distribution"><span>FUTURE DISTRIBUTION / STATUS</span><a href="/docs/">Use the field guide ${arrow}</a><a href="/developers/">Review the contract ${arrow}</a><a href="/releases/">Check release status ${arrow}</a></div><nav aria-label="Footer">${site.footerGroups.map((group) => `<section><h3>${e(group.title)}</h3>${group.links.map((link) => `<a href="${e(link.href)}"${ext(link.href)}>${e(link.label)}</a>`).join("")}</section>`).join("")}</nav></div><div class="sd-footer-word" aria-hidden="true">SANDORA</div><div class="sd-footer-base"><span>© <span data-current-year></span> Sandora · A Navin Research direction</span><div><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="https://navinresearch.com/products/">Navin Research ${arrow}</a></div></div></footer>`;
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
  const isHome = path === "/";
  return `<!doctype html><html lang="en"><head>${headMarkup({ product, page, path, layout: mode, isHome })}</head><body class="sd-body sd-${e(mode)}" data-product="sandora" data-route="${e(path)}"><a class="skip-link" href="#main-content">Skip to content</a>${header(site, path)}${noscriptNav(site)}<main id="main-content">${isHome ? home(product, site, page) : pageContent(page, mode)}</main>${footer(product, site)}</body></html>`;
}

export default function renderSandora(product, site, page) { return render(product, site, page).replace(/[ \t]+$/gm, ""); }
export { layoutFor, pathOf as normalizePath };
