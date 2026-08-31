import { escapeHtml, headMarkup } from "../product-renderer-helpers.mjs";

const e = escapeHtml;
const pathOf = (value = "/") => value === "/404.html" ? value : (`/${String(value).replace(/^\/+|\/+$/g, "")}/`).replace("//", "/");
const ext = (href = "") => /^https?:|^mailto:/.test(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
const layoutFor = (page) => page.path === "/404.html" ? "error" : /releases/.test(page.path) ? "timeline" : /product/.test(page.path) ? "product" : page.layout || (/docs|developers|github/.test(page.path) ? "docs" : /pricing|contact/.test(page.path) ? "availability" : /research|releases/.test(page.path) ? "timeline" : /security|privacy|terms|observability/.test(page.path) ? "ledger" : /agents|workflows|runtime|memory|approvals/.test(page.path) ? "workflow" : "editorial");

function nav(site, path) {
  return site.navigation.map((item) => {
    const href = item.href || item.children?.[0]?.href || "/";
    const current = pathOf(href) === path || item.children?.some((child) => pathOf(child.href) === path);
    if (item.children?.length) return `<details class="sd-nav-cluster"${current ? " data-current" : ""}><summary>${e(item.label)}</summary><div>${item.children.map((child) => `<a href="${e(child.href)}"${pathOf(child.href) === path ? ' aria-current="page"' : ""}${ext(child.href)}>${e(child.label)}</a>`).join("")}</div></details>`;
    return `<a href="${e(href)}"${current ? ' aria-current="page"' : ""}${ext(href)}>${e(item.label)}</a>`;
  }).join("");
}

function signal(page) {
  const items = page.visual?.items || ["Intent", "Context", "Approval", "Action"];
  return `<div class="sd-signal" aria-label="Illustrative Sandora department graph"><div class="sd-signal__scope"><span>CONTROL PLANE</span><b>${e(page.visual?.title || "Department orchestration")}</b></div><ol>${items.slice(0, 6).map((item, index) => `<li class="sd-signal__item--${index % 6}"><i aria-hidden="true"></i><span>${e(item)}</span><small>${index === items.length - 1 ? "HUMAN CHECK" : "OBSERVED"}</small></li>`).join("")}</ol><p>${e(page.visual?.caption || "Illustrative system view — not a live product session.")}</p></div>`;
}

function section(section, index, mode) {
  const points = section.points || [];
  if (mode === "docs") return `<section class="sd-manual__entry"><a class="sd-anchor" href="#s${index + 1}">§ ${String(index + 1).padStart(2, "0")}</a><div><h2 id="s${index + 1}">${e(section.title)}</h2><p>${e(section.body)}</p>${section.status ? `<mark>${e(section.status)}</mark>` : ""}</div>${points.length ? `<pre aria-label="Illustrative command output"><code>${points.map((point, i) => `${String(i + 1).padStart(2, "0")}  ${e(point)}`).join("\n")}</code></pre>` : ""}</section>`;
  if (mode === "workflow") return `<li class="sd-runbook__step"><div class="sd-runbook__rail"><span>${String(index + 1).padStart(2, "0")}</span><i></i></div><div><p class="sd-kicker">OPERATION</p><h2>${e(section.title)}</h2><p>${e(section.body)}</p>${section.status ? `<strong>${e(section.status)}</strong>` : ""}</div>${points.length ? `<ul>${points.map((point) => `<li>${e(point)}</li>`).join("")}</ul>` : ""}</li>`;
  if (mode === "ledger") return `<tr><th scope="row"><span>${String(index + 1).padStart(2, "0")}</span>${e(section.title)}</th><td>${e(section.body)}</td><td>${section.status ? e(section.status) : "REVIEW REQUIRED"}${points.length ? `<ul>${points.map((point) => `<li>${e(point)}</li>`).join("")}</ul>` : ""}</td></tr>`;
  return `<article class="sd-module"><header><span>MODULE ${String(index + 1).padStart(2, "0")}</span>${section.status ? `<b>${e(section.status)}</b>` : ""}</header><h2>${e(section.title)}</h2><p>${e(section.body)}</p>${points.length ? `<ul>${points.map((point) => `<li>${e(point)}</li>`).join("")}</ul>` : ""}${section.cta ? `<a href="${e(section.cta.href)}"${ext(section.cta.href)}>${e(section.cta.label)} →</a>` : ""}</article>`;
}

function availability(page) {
  const sections = page.sections || [];
  return `<section class="sd-availability-board"><header><span>AVAILABILITY REGISTER</span><strong>NO IMPLIED OFFER</strong></header><div class="sd-availability-board__state"><span>PUBLIC STATE</span><b>${e(sections[0]?.status || "NOT ANNOUNCED")}</b><p>Commercial terms, dates, and access remain unpublished unless explicitly stated.</p></div><dl>${sections.map((item, index) => `<div><dt>${String(index + 1).padStart(2, "0")} ${e(item.title)}</dt><dd>${e(item.body)}${item.status ? `<strong>${e(item.status)}</strong>` : ""}</dd></div>`).join("")}</dl></section>`;
}

function pricingRegister(page){const tiers=[['OBSERVER','Read the operating model','Departments, roles, and approval vocabulary'],['BUILDER','Shape a workflow','Context, handoffs, and review boundaries'],['STEWARD','Discuss governance','Enterprise requirements and evidence boundaries']];return `<section class="sd-availability-board"><div class="sd-pricing-register"><header><span>PRICING REGISTER / NOT ANNOUNCED</span><h2>Status before price.</h2><p>Sandora is concept-stage. No price, usage allowance, deployment, customer, benchmark, certification, or service level is announced.</p></header><div class="sd-pricing-register__tiers">${tiers.map(([name,title,body])=>`<article><span>${e(name)}</span><h3>${e(title)}</h3><p>${e(body)}</p><strong>COMING SOON</strong><ul><li>Scoped access</li><li>Human review</li><li>No implied availability</li></ul></article>`).join('')}</div><div class="sd-pricing-register__comparison"><h3>Semantic comparison boundary</h3><table><thead><tr><th>Tier</th><th>Includes</th><th>Status</th></tr></thead><tbody>${tiers.map(([name,title,body])=>`<tr><th scope="row">${e(name)}</th><td>${e(title)} · ${e(body)}</td><td>NOT ANNOUNCED</td></tr>`).join('')}</tbody></table></div><div class="sd-pricing-register__faq"><h3>FAQ</h3><details><summary>Is Sandora available?</summary><p>No. This page records a concept-stage direction and does not create access.</p></details><details><summary>Can an enterprise team talk through requirements?</summary><p>Yes, via the enterprise and contact path; no deployment or service commitment is implied.</p></details></div></div></section>`}
function errorPage(page) { return `<section class="sd-error"><span>404 / ROUTE NOT FOUND</span><h2>${e(page.headline || page.title || "This route is not in the index.")}</h2><p>${e(page.lede || page.description || "Return to the Sandora index to continue.")}</p><a href="/">Return to Sandora ↗</a></section>`; }
function content(page, mode) {
  if (mode === "error") return errorPage(page);
  if (mode === "product") return `<section class="sd-product-map"><header><span>SYSTEM MAP / PRODUCT</span><p>Departments, controls, and handoffs in one operating view.</p></header><div>` + (page.sections || []).map((item, index) => `<article><span>NODE ${String(index + 1).padStart(2, "0")}</span><h2>${e(item.title)}</h2><p>${e(item.body)}</p></article>`).join("") + `</div></section>`;

  const sections = page.sections || [];
  if (mode === "availability") return page.path === "/pricing/" ? pricingRegister(page) : availability(page);
  if (mode === "workflow") return `<section class="sd-runbook"><header><span>RUNBOOK</span><p>Sequential operations with explicit checkpoints.</p></header><ol>${sections.map((item, index) => section(item, index, mode)).join("")}</ol></section>`;
  if (mode === "docs") return `<article class="sd-manual"><header><span>FIELD MANUAL</span><p>Concepts, boundaries, and source trails.</p></header>${sections.map((item, index) => section(item, index, mode)).join("")}</article>`;
  if (mode === "ledger") return `<section class="sd-ledger"><div class="sd-ledger__head"><span>EVIDENCE LEDGER</span><span>OWNER / HUMAN</span></div><div class="sd-table-wrap" tabindex="0" role="region" aria-label="Sandora evidence ledger"><table><thead><tr><th>Register</th><th>Boundary</th><th>State</th></tr></thead><tbody>${sections.map((item, index) => section(item, index, mode)).join("")}</tbody></table></div></section>`;
  if (mode === "timeline") return `<section class="sd-chronicle"><header><span>OPERATIONS CHRONICLE</span><p>Release and research states in recorded order.</p></header><ol>${sections.map((item, index) => `<li><time>${String(index + 1).padStart(2, "0")}</time><div><h2>${e(item.title)}</h2><p>${e(item.body)}</p></div><strong>${e(item.status || "RECORDED")}</strong></li>`).join("")}</ol></section>`;
  if (mode === "comparison") return `<section class="sd-matrix"><header><span>DECISION MATRIX</span><h2>Compare boundaries before assignment.</h2></header><div>${sections.map((item, index) => `<article><span>AXIS ${String(index + 1).padStart(2, "0")}</span><h2>${e(item.title)}</h2><p>${e(item.body)}</p><ul>${(item.points || []).map((point) => `<li>${e(point)}</li>`).join("")}</ul></article>`).join("")}</div></section>`;
  if (mode === "media") return `<section class="sd-observation"><header><span>OBSERVATION DECK</span><p>Source-labelled views; never a live-session claim.</p></header>${sections.map((item, index) => `<figure><div aria-hidden="true"><span>${String(index + 1).padStart(2, "0")}</span><i></i><i></i><i></i></div><figcaption><h2>${e(item.title)}</h2><p>${e(item.body)}</p>${item.status ? `<strong>${e(item.status)}</strong>` : ""}</figcaption></figure>`).join("")}</section>`;
  return `<section class="sd-modules">${sections.map((item, index) => section(item, index, mode)).join("")}</section>`;
}

function footer(product, site) {
  const links = site.footerGroups.flatMap((group) => group.links).slice(0, 12);
  return `<footer class="sd-footer"><div class="sd-footer__terminal"><span>SANDORA / DEPARTMENT OS</span><strong>HUMAN AUTHORITY REMAINS IN THE LOOP.</strong><p>${e(product.proofNote)}</p></div><nav aria-label="Footer">${links.map((link, index) => `<a href="${e(link.href)}"${ext(link.href)}><span>${String(index + 1).padStart(2, "0")}</span>${e(link.label)}</a>`).join("")}</nav><div class="sd-footer__base"><span>© <span data-current-year></span> Sandora</span><a href="https://navinresearch.com/products/">A Navin Research project ↗</a></div></footer>`;
}

function render(product, site, page) {
  const path = pathOf(page.path); const mode = layoutFor(page); const home = path === "/"; const cta = page.cta || site.primaryCta;
  return `<!doctype html><html lang="en" class="no-js"><head>${headMarkup({ product, page, path, layout: mode, isHome: home })}</head><body class="sd-body sd-${mode}" data-product="sandora" data-route="${e(path)}"><a class="skip-link" href="#main-content">Skip to content</a><header class="sd-header"><a class="sd-mark" href="/" aria-label="Sandora home"><i aria-hidden="true"></i>SANDORA</a><div class="sd-route"><span>DEPARTMENT</span><b>${e(path === "/" ? "ATLAS" : path.replaceAll("/", " ").trim().toUpperCase())}</b></div><button class="product-menu-button sd-menu-button" type="button" aria-expanded="false" aria-controls="product-menu" data-product-menu>INDEX</button><div class="product-menu sd-menu" id="product-menu"><nav aria-label="Primary navigation">${nav(site, path)}</nav><a class="sd-access" href="${e(site.primaryCta.href)}"${ext(site.primaryCta.href)}>${e(site.primaryCta.label)}</a></div></header><main id="main-content"><section class="sd-hero"><div class="sd-hero__copy"><p class="sd-overline"><span>AI DEPARTMENT OS</span><span>CONCEPT / HUMAN-GOVERNED</span></p><h1>${e(page.headline || page.title)}</h1><p>${e(page.lede || page.description)}</p>${home ? `<div class="sd-actions"><a href="${e(site.primaryCta.href)}"${ext(site.primaryCta.href)}>ENTER CONTROL ROOM</a><a href="/product/">READ THE SYSTEM →</a></div>` : ""}</div>${signal(page)}</section>${content(page, mode)}${cta ? `<aside class="sd-handoff"><span>NEXT HANDOFF</span><div><h2>${e(cta.title || "Continue with an explicit boundary")}</h2><p>${e(cta.body || product.availability.body)}</p></div><a href="${e(cta.href)}"${ext(cta.href)}>${e(cta.label)} →</a></aside>` : ""}${home ? `<section class="sd-proof"><h2>Operational truth, before theatre.</h2><p>${e(product.proofNote)}</p><ul>${product.evidence.map((item) => `<li><span>${e(item.label)}</span><b>${e(item.value)}</b><small>${e(item.state)}</small></li>`).join("")}</ul></section>` : ""}</main>${footer(product, site)}</body></html>`;
}

export default function renderSandora(product, site, page) { return render(product, site, page).replace(/[ \t]+$/gm, ""); }
export { layoutFor, pathOf as normalizePath };
