const sourceReadme = "https://github.com/kyoo-147/HowHow-Reasoner/blob/main/README.md";
const navin = "https://navinresearch.com/";

const evidence = {
  stamp: "READY FOR HUMAN REVIEW",
  note: "Concept direction and integration-spike framing only; no live episode, metric, customer result, novelty, or publication outcome is claimed.",
};

const section = (kind, title, body, points, status = "SOURCE-BOUND") => ({ kind, title, body, points, status });
const page = (path, title, description, eyebrow, headline, lede, visual, sections, cta) => ({
  path, title, description, eyebrow, headline, lede,
  visual: { ...visual, caption: visual.caption || "Concept direction; not evidence of a shipped capability." },
  sections,
  ...(cta ? { cta } : {}),
});
const contact = { title: "Keep a human in the loop.", body: "A bounded research question is the right starting point for an integration-spike conversation.", label: "Discuss a research episode", href: "/contact/" };

const sourcesPage = page("/sources/", "Sources", "HowHow source records preserve identity, access, license, and exact locators.", "EVIDENCE / SOURCE REGISTER", "Keep the source attached to the claim.", "A source register is the first shelf in an evidence-first research system: it records what was read, where it came from, and whether it can be used.", { kind: "register", title: "SOURCE REGISTER", items: ["IDENTITY", "ACCESS", "LICENSE", "LOCATOR"] }, [
      section("source-register", "A citation is a record, not a decoration.", "Each source should carry a stable identifier, title, publisher, retrieval context, version or date when available, access state, license state, and a locator precise enough for another reader to inspect.", ["Stable source ID", "Retrieval context", "Exact locator"], "SOURCE RECORD"),
      section("boundary", "Availability does not settle permission.", "A reachable page may still have restrictions, an unclear license, or content that cannot be copied into a research artifact. The register keeps access, license, and reuse decisions separate.", ["Access status", "License status", "Reuse decision"], "LICENSE REVIEW"),
      section("unknown", "Unknown stays visible.", "When a version, license, locator, or provenance field cannot be established, the record remains incomplete rather than silently becoming evidence. This page reports no live source inventory.", ["Complete", "Needs review", "UNKNOWN"], "NO LIVE REGISTER PUBLISHED"),
    ], contact);

const site = {
  primaryCta: { label: "Review the integration spike", href: "/access/" },
  navigation: [
    { label: "System", href: "/product/", children: [{ label: "How it works", href: "/how-it-works/" }, { label: "Workflow", href: "/research-workflow/" }] },
    { label: "Evidence", href: "/evidence/", children: [{ label: "Sources", href: "/sources/" }, { label: "Experiments", href: "/experiments/" }, { label: "Projects", href: "/projects/" }] },
    { label: "Project", href: "/projects/", children: [{ label: "Docs", href: "/docs/" }, { label: "GitHub", href: "/github/" }, { label: "Releases", href: "/releases/" }] },
    { label: "About", href: "/about/", children: [{ label: "Contact", href: "/contact/" }, { label: "Access", href: "/access/" }] },
  ],
  footerGroups: [
    { title: "Research loop", links: [{ label: "How it works", href: "/how-it-works/" }, { label: "Workflow", href: "/research-workflow/" }, { label: "Evidence", href: "/evidence/" }, { label: "Sources", href: "/sources/" }] },
    { title: "Review shelf", links: [{ label: "Experiments", href: "/experiments/" }, { label: "Projects", href: "/projects/" }, { label: "Releases", href: "/releases/" }] },
    { title: "Source", links: [{ label: "Docs", href: "/docs/" }, { label: "GitHub", href: "/github/" }, { label: "Navin Research", href: navin }] },
    { title: "Legal", links: [{ label: "Privacy", href: "/privacy/" }, { label: "Terms", href: "/terms/" }, { label: "Contact", href: "/contact/" }] },
  ],
  pages: [
    sourcesPage,
    page("/", "HowHow", "An evidence-first research system direction with human review at consequential boundaries.", "HOWHOW / EVIDENCE-FIRST RESEARCH OS", "Serious research. Served like instant noodles.", "HowHow turns a bounded question into a reviewable trail: brief, sources, claims, checks, and a human-owned handoff.", { kind: "package", title: "THE RESEARCH NOODLE PACK", items: ["QUESTION / BOUNDED", "EVIDENCE / LINKED", "REVIEW / HUMAN"] }, [
      section("evidence", "The wrapper is playful. The chain is not.", "A research episode begins with scope and ends at a package a person can inspect. The public HowHow-Reasoner README is the source for this direction.", ["Versioned brief before work", "Source spans beside claims", "Failure history preserved"], evidence.stamp),
      section("ledger", "A bowl is not a result.", "The visual language makes the path memorable without turning an illustrative diagram into scientific evidence. Every conclusion still needs its source, run, or explicit unknown.", ["Brief", "Evidence ledger", "Review gate"], "ILLUSTRATIVE SYSTEM"),
      section("handoff", "Stop at a reviewable package.", "HowHow does not promise guaranteed novelty, correctness, peer-review acceptance, or automatic publication. Publication and consequential decisions remain human-owned.", ["Reproducibility checks", "License and privacy checks", "Human release decision"], "HUMAN DECISION REQUIRED"),
    ], contact),
    page("/product/", "Product", "The HowHow product direction and evidence-first operating model.", "PRODUCT / SYSTEM MAP", "A research OS with the seasoning packet still attached.", "The product keeps scope, provenance, approvals, and failure history visible beside useful work.", { kind: "package", title: "OPEN THE PACK", items: ["BRIEF", "LEDGER", "REVIEW"] }, [
      section("intake", "Start with an editable brief.", "Natural-language intent becomes a versioned question, scope, non-goals, permissions, budget, stop policy, and expected artifacts before research work begins.", ["Question and audience", "Allowed sources and tools", "Stop conditions"], "BRIEF REQUIRED"),
      section("evidence", "Keep the trail beside the prose.", "Sources, exact spans, runs, artifacts, claims, and review records remain linked. A polished paragraph cannot erase an unsupported path.", ["Source records", "Claim links", "Contradictions"], "PROVENANCE FIRST"),
      section("handoff", "End at a gate, not a button.", "The package can be checked for rebuildability, license, privacy, and manuscript consistency, then handed to a person for a final decision.", ["Checks", "Dissent", "Human release"], evidence.stamp),
    ], contact),
    page("/how-it-works/", "How it works", "A step-by-step view of the proposed HowHow research loop.", "SYSTEM / UNWRAP THE LOOP", "Unwrap the question. Check the ingredients.", "Five visible stages keep a research episode legible from the first prompt to the final review package.", { kind: "workflow", title: "BACK-OF-PACK METHOD", items: ["01 BRIEF", "02 GATHER", "03 TEST", "04 REVIEW", "05 HANDOFF"] }, [
      section("step", "01 / Brief", "Bound the question, define non-goals, and reserve permissions, budget, and stop conditions.", ["Question", "Scope", "Policy"], "INTAKE"),
      section("step", "02 / Gather", "Retrieve permitted sources, preserve versions and access status, and extract exact evidence spans.", ["Sources", "Spans", "Contradictions"], "LITERATURE"),
      section("step", "03 / Test", "Compare candidates, reproduce a baseline where allowed, and run only a locked, bounded intervention plan.", ["Baseline", "Evaluation", "Artifacts"], "EXPERIMENT"),
      section("step", "04 / Review", "Map claims to evidence, inspect failures and dissent, and revise anything that outruns its support.", ["Claims", "Critique", "Limitations"], "REVIEW"),
      section("step", "05 / Handoff", "Package the record for rebuild and human judgment. Ready-to-review is not the same as novel or accepted.", ["Manifest", "Checks", "Decision"], evidence.stamp),
    ], contact),
    page("/research-workflow/", "Research workflow", "A bounded workflow for turning research intent into reviewable work.", "WORKFLOW / INGREDIENT LIST", "No mystery seasoning in the pipeline.", "Write scope, permissions, budget, and stop conditions before a run; preserve what happened after it.", { kind: "ingredient-list", title: "EPISODE INGREDIENTS", items: ["SCOPE / NON-GOALS", "PERMISSIONS / BUDGET", "STOP / PRESERVE"] }, [
      section("policy", "Before cooking: write the label.", "The brief records the intended question, data and code boundary, network policy, provider choices, budget reservation, and escalation rules.", ["Allowed inputs", "Sensitive-data boundary", "Stop policy"], "PRE-RUN GATE"),
      section("route", "During cooking: keep the heat bounded.", "Routine work may proceed inside the approved brief. New sources, meaningful spend, destructive actions, and confirmatory direction changes require a person.", ["Pause", "Take over", "Stop-and-preserve"], "CONTROL SURFACE"),
      section("receipt", "After cooking: keep every attempt.", "Late, failed, rejected, and inconclusive paths stay in the episode record. A best run is not allowed to stand in for the whole history.", ["Attempt", "Diagnosis", "Lesson"], "FAILURE IS EVIDENCE"),
    ], contact),
    page("/evidence/", "Evidence", "HowHow evidence and provenance boundaries.", "EVIDENCE / LEDGER", "Every claim gets a label, not a halo.", "Sources, spans, artifacts, and unresolved uncertainty remain inspectable instead of disappearing into polished prose.", { kind: "ledger", title: "THE CLAIM LEDGER", items: ["SOURCE → SPAN", "SPAN → CLAIM", "CLAIM → REVIEW"] }, [
      section("source", "Source records are not vibes.", "A source needs a stable identity, version, retrieval context, access and license status, and a locator that lets another reader find the supporting passage.", ["Stable ID", "Version", "Exact locator"], "SOURCE RECORD"),
      section("claim", "Claims carry their ancestry.", "External claims point to evidence spans. Empirical claims point to run manifests and metrics. Interpretive claims and hypotheses remain labelled as such.", ["External", "Empirical", "Interpretive / hypothesis"], "CLAIM TYPE"),
      section("audit", "Unknown is a valid entry.", "Contradictions, unsupported hypotheses, and dissent are not collapsed into a decorative confidence badge. The ledger shows what is missing.", ["Supported", "Contradicted", "UNKNOWN"], "FAIL CLOSED"),
    ], contact),
    page("/experiments/", "Experiments", "An honest home for future HowHow experiment records.", "EVIDENCE / EXPERIMENT RECEIPT", "Experiments need receipts, not confetti.", "A future experiment record should state inputs, method, checks, failures, and what a reviewer may conclude.", { kind: "checklist", title: "EXPERIMENT RECEIPT", items: ["PROTOCOL", "RUN MANIFEST", "OUTCOME / LIMITS"] }, [
      section("protocol", "Freeze the question before the run.", "An experiment record names the hypothesis, baseline, locked evaluation contract, seed or split policy, budget, and falsifier before execution.", ["Hypothesis", "Baseline", "Evaluation"], "EXPLORATORY OR CONFIRMATORY"),
      section("receipt", "Record the run, including failure.", "Commands, environment, code and data identity, artifacts, resource use, and failed attempts belong in the receipt when a real run exists.", ["Manifest", "Artifacts", "Failure class"], "NO LIVE RUN PUBLISHED"),
      section("interpretation", "Do not serve more than the receipt says.", "A metric without methodology, uncertainty, and leakage checks is not a conclusion. This public page reports no result or benchmark.", ["Result", "Limitations", "Reviewer scope"], "INCONCLUSIVE IS ALLOWED"),
    ], contact),
    page("/projects/", "Projects", "A reviewable index for bounded HowHow research episodes.", "PROJECTS / THE SHELF", "One project, one bowl, one accountable trail.", "Projects keep a question, its evidence, and its approvals together without implying that work has been completed.", { kind: "shelf", title: "PROJECT SHELF", items: ["BRIEF / VERSIONED", "RUN / PRESERVED", "PACKAGE / REVIEW"] }, [
      section("index", "A shelf, not a success gallery.", "Each project entry should expose status, owner, scope, evidence count, open blockers, and the next human-owned decision.", ["Current stage", "Last artifact", "Blocker"], "NO CUSTOMER PROJECTS CLAIMED"),
      section("episode", "Episodes can pause without disappearing.", "Pause, take over, stop-and-preserve, cancel, failed, and inconclusive are durable states—not blank spaces hidden behind a green check.", ["PAUSED", "BLOCKED", "INCONCLUSIVE"], "LIFECYCLE"),
      section("package", "The package is a handoff.", "A package can be prepared for review, but it does not self-submit, certify novelty, or turn a concept into a published result.", ["Build", "Audit", "Human decision"], evidence.stamp),
    ], contact),
    page("/docs/", "Docs", "Documentation entry points for the HowHow-Reasoner direction.", "PROJECT / INSTRUCTION LEAFLET", "Read the label before you cook.", "The public repository is the authoritative starting point for current implementation context and stated boundaries.", { kind: "manual", title: "INSTRUCTION LEAFLET", items: ["README", "REQUIREMENTS", "OPEN QUESTIONS"] }, [
      section("read", "Start with the public source.", "The README and product requirements describe the intended Research OS, its canonical records, human gates, and provider boundaries.", ["Product thesis", "Requirements", "Status labels"], "SOURCE-BACKED"),
      section("orient", "Use the vocabulary precisely.", "Brief, TaskSpec, SourceRecord, EvidenceSpan, RunManifest, ClaimRecord, ReviewRecord, ApprovalRecord, and ArtifactManifest each carry a different responsibility.", ["Canonical records", "Append-only events", "Rebuildable state"], "DOCUMENTATION MAP"),
      section("limits", "Open questions stay open.", "No public documentation here should be mistaken for a live API reference, supported deployment, or proof that an integration spike has been executed.", ["Runtime choice", "Readiness", "Availability"], "UNKNOWN"),
    ], { title: "Open the source", body: "Inspect the public HowHow-Reasoner README.", label: "Read README", href: sourceReadme }),
    page("/github/", "GitHub", "The public source trail for HowHow-Reasoner.", "PROJECT / SOURCE TRAIL", "The code cupboard is public; claims stay careful.", "Inspect the repository’s stated direction without confusing repository presence for production readiness or scientific novelty.", { kind: "link", title: "SOURCE TRAIL", items: ["README", "HISTORY", "LICENSE CHECK"] }, [
      section("source", "Read the repository in context.", "The linked repository is the named source for HowHow’s current product requirements and integration-spike boundary.", ["Repository", "README", "Requirements"], "PUBLIC SOURCE"),
      section("license", "A link is not a license grant.", "Before reuse, inspect the repository license, dependencies, model and dataset terms, and any protected external material separately.", ["Code terms", "Data terms", "Asset terms"], "AUDIT REQUIRED"),
      section("truth", "Source presence proves only source presence.", "The repository does not by itself establish a shipped product, benchmark, customer outcome, or scientific finding.", ["No availability claim", "No novelty claim", "No result claim"], evidence.stamp),
    ], { title: "Inspect the repository", body: "Open the named public source directly.", label: "Open GitHub", href: sourceReadme }),
    page("/releases/", "Releases", "A release shelf separating direction from shipped evidence.", "PROJECT / RELEASE SHELF", "Release notes without the instant hype.", "Future entries should name the artifact, checks, limits, and review status.", { kind: "shelf", title: "RELEASE SHELF", items: ["ARTIFACT", "CHECKS", "LIMITS"] }, [
      section("status", "The current shelf is intentionally quiet.", "No HowHow release package, version, date, or production endpoint is asserted by this page.", ["No version", "No date", "No endpoint"], "NOT RELEASED"),
      section("entry", "A real entry needs a receipt.", "When an artifact exists, its entry should identify the source revision, build checks, dependency and license boundary, known limitations, and exact status.", ["Identity", "Validation", "Limitations"], "RELEASE CONTRACT"),
      section("handoff", "Review readiness is not launch.", "A package can be ready for human review while publication, distribution, and product availability remain separate decisions.", ["Review", "Revise", "Archive"], evidence.stamp),
    ], contact),
    page("/access/", "Access", "Truthful access status for the HowHow integration spike.", "ABOUT / REVIEW STAMP", "Apply for a review, not a magic button.", "HowHow is presented as READY FOR HUMAN REVIEW / integration spike. Access, scope, and implementation path remain subject to human review.", { kind: "stamp", title: evidence.stamp, items: ["BOUNDED BRIEF", "PERMITTED INPUTS", "HUMAN OWNER"] }, [
      section("gate", "The gate asks for a real question.", "An access conversation should include the research question, intended inputs, permitted environment, decision owner, and what a useful bounded episode would produce.", ["Question", "Inputs", "Decision"], "APPLICATION INPUT"),
      section("boundary", "The stamp has a narrow meaning.", "READY FOR HUMAN REVIEW means the direction is ready to discuss as an integration spike. It does not mean generally available, proven, novel, correct, or accepted.", ["Not GA", "Not a result", "Not publication"], evidence.stamp),
      section("next", "Human review comes before work.", "No service, pricing, customer list, or delivery commitment is announced. Scope and permissions would be agreed before any episode begins.", ["Review", "Approve", "Preserve"], "AVAILABILITY UNANNOUNCED"),
    ], { title: "Bring a bounded brief", body: "Contact is an expression of interest, not guaranteed access.", label: "Contact HowHow", href: "/contact/" }),
    page("/about/", "About", "Why HowHow uses FMCG packaging to frame serious research controls.", "ABOUT / THE WRAPPER", "Funny wrapper. Serious chain of custody.", "The noodle-pack metaphor makes stages memorable while the underlying language stays explicit about evidence, uncertainty, and human authority.", { kind: "mascot", title: "REVIEWER ON DUTY", items: ["READ THE LABEL", "CHECK THE SOURCE", "ASK A HUMAN"] }, [
      section("metaphor", "The packet is a memory aid.", "Ingredient lists, preparation steps, warning stamps, and shelf labels turn a complex research lifecycle into a vocabulary people can scan and remember.", ["Packet", "Recipe", "Receipt"], "ORIGINAL VISUAL DIRECTION"),
      section("serious", "The joke never decides the claim.", "A bright wrapper cannot make an unsupported statement true. Evidence, review, and explicit uncertainty remain the operating system underneath.", ["Evidence", "Dissent", "Human authority"], "BOUNDARY FIRST"),
      section("reference", "References are study material, not affiliation.", "FutureHouse, Hebbia, OffLimits, Goodles, and the public repository inform structural study only. HowHow uses no copied code, artwork, logos, or protected identity.", ["Learn", "Adapt", "Original"], "NO COPYING"),
    ], contact),
    page("/contact/", "Contact", "A contact route for HowHow review conversations.", "ABOUT / CONTACT PACKET", "Have a bounded question? Bring the label.", "Start with the research question, intended inputs, and decision a person must retain.", { kind: "packet", title: "CONTACT PACKET", items: ["QUESTION", "INPUTS", "DECISION"] }, [
      section("brief", "Useful context beats a pitch.", "A concise note can describe the question, domain, permitted sources, current blocker, and the kind of review package that would help.", ["Research question", "Input boundary", "Desired next step"], "HUMAN CONVERSATION"),
      section("boundary", "No message creates access.", "Contact is an expression of interest in a concept-stage integration spike. There is no promised response time, support plan, pricing, or availability.", ["No automatic access", "No data upload", "No commitment"], "NON-BINDING"),
    ], { title: "Open your mail client", body: "Do not send sensitive research material through an unapproved channel.", label: "Email Navin Research", href: "mailto:michaelbui.contact@gmail.com?subject=HowHow%20integration%20spike" }),
    page("/privacy/", "Privacy", "Privacy boundary for a concept-stage HowHow site.", "LEGAL / PRIVACY LABEL", "No secret ingredients in the fine print.", "Do not send sensitive research material through an unapproved channel; future product retention terms are not announced.", { kind: "label", title: "PRIVACY LABEL", items: ["MINIMIZE DATA", "ASK FIRST", "REVIEW TERMS"] }, [
      section("scope", "This is a concept page.", "The page does not claim a production data-processing arrangement, account system, upload flow, storage region, or retention schedule.", ["Public description", "No product account", "No upload promise"], "WEBSITE SCOPE"),
      section("notice", "Use the governing notice.", "Current website practices are described by the Navin Research privacy policy. Product-specific processing terms require separate review against a real deployment.", ["Canonical notice", "Actual deployment", "Future terms"], "SOURCE OF TRUTH"),
    ], { title: "Read the governing notice", body: "Use Navin Research’s current privacy policy.", label: "Read privacy policy", href: "https://navinresearch.com/privacy-policy/" }),
    page("/terms/", "Terms", "Terms boundary for the HowHow concept site.", "LEGAL / SERVING SUGGESTION", "Read the serving suggestion.", "Any future access would require explicit scope, terms, and human approval; this page is not a product contract.", { kind: "label", title: "TERMS LABEL", items: ["SCOPE", "APPROVAL", "NO PROMISE"] }, [
      section("scope", "A concept is not a service.", "No subscription, price, service-level promise, warranty, or commercial availability is announced by this page.", ["Information only", "No purchase", "No SLA"], "NO CONTRACT"),
      section("notice", "Terms follow the actual offering.", "Use the canonical Navin Research terms for this web property. Any future HowHow offering needs reviewed terms that match its real scope.", ["Canonical terms", "Product scope", "Review required"], "SOURCE OF TRUTH"),
    ], { title: "Read the governing terms", body: "Use Navin Research’s current terms of use.", label: "Read terms of use", href: "https://navinresearch.com/terms-of-use/" }),
    page("/404.html", "Not found", "The requested HowHow page was not found.", "404 / MISSING PACKET", "That packet is missing.", "Try the product shelf or return to the HowHow starting point.", { kind: "warning", title: "ROUTE UNKNOWN", items: ["CHECK PATH", "BROWSE SHELF", "RETURN"] }, [
      section("route", "No route, no assumption.", "A missing path is not evidence of a hidden release or an available feature. Use the documented map to restart.", ["Check URL", "Browse projects", "Return home"], "UNKNOWN"),
    ], { title: "Continue", body: "Return to the HowHow starting point.", label: "Return to HowHow", href: "/" }),
  ],
};

export default {
  slug: "howhow",
  name: "HowHow",
  eyebrow: "EVIDENCE-FIRST RESEARCH OS",
  status: "READY FOR HUMAN REVIEW",
  catalogStatus: "product",
  thesis: "A bounded research application that keeps approvals, provenance, and failure history beside every useful result.",
  intro: "HowHow is an evidence-first Research OS for making bounded research work inspectable from question to review. Its current direction is approved for an integration spike; consequential decisions remain explicitly human-owned.",
  proofNote: "The direction is grounded in the HowHow-Reasoner requirements: evidence before prose, human-owned consequential decisions, durable provenance, and truthful readiness. This page describes a research application, not a claim of completed product capability.",
  sections: [
    { id: "brief", kicker: "01 / FRAME", title: "Begin with a question worth bounding.", body: "A research brief makes the question, scope, permissions, budget, stop conditions, and unresolved assumptions visible before work begins.", points: ["Versioned brief", "Explicit non-goals", "Human direction approval"] },
    { id: "ledger", kicker: "02 / TRACE", title: "Keep the trail beside the prose.", body: "Sources, exact spans, runs, artifacts, claims, and reviews remain linked so a reader can inspect what supports a statement and what remains uncertain.", points: ["Source and span records", "Claim-to-evidence links", "Failures preserved"] },
    { id: "release", kicker: "03 / HANDOFF", title: "Stop at a reviewable package.", body: "A bounded loop can prepare reproducibility, license, privacy, and manuscript checks while leaving publication and consequential decisions with a person.", points: ["Independent review gates", "Rebuildable manifests", "Human-owned release"] },
  ],
  capabilities: ["Research briefing", "Evidence ledger", "Approval boundaries", "Failure memory", "Reviewable packaging"],
  evidence: [
    { label: "Integration state", value: "Approved integration spike", state: "READY FOR HUMAN REVIEW" },
    { label: "Grounding", value: "HowHow-Reasoner requirements", state: "SOURCE-BACKED" },
    { label: "Novelty", value: "Not established", state: "UNKNOWN" },
    { label: "Publication", value: "Human decision required", state: "NOT GUARANTEED" },
  ],
  availability: { label: "AVAILABILITY", title: "Apply with a bounded research question.", body: "HowHow is not presented as a generally available service or a guaranteed path to novelty or publication. Research applications require a bounded brief, permitted inputs, and human review.", cta: "Discuss a research episode" },
  sourceLinks: [{ label: "HowHow-Reasoner README", url: sourceReadme }, { label: "Navin Research", url: navin }],
  site,
};
