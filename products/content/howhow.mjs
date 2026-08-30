const sourceReadme = "https://github.com/kyoo-147/HowHow-Reasoner/blob/main/README.md";
const navin = "https://navinresearch.com/";

const page = (path, title, description, headline, lede, kind, visualTitle, body, points, cta) => ({
  path,
  title,
  description,
  eyebrow: "HOWHOW / RESEARCH SYSTEM",
  headline,
  lede,
  visual: { kind, title: visualTitle, items: points.slice(0, 3), caption: "Concept direction; not evidence of a shipped capability." },
  sections: [{ kind: "evidence", title: "What this page can claim", body, points, status: "SOURCE-BACKED DIRECTION" }],
  ...(cta ? { cta } : {})
});

const site = {
  primaryCta: { label: "Review the integration spike", href: "/access/" },
  navigation: [
    { label: "System", href: "/product/", children: [{ label: "How it works", href: "/how-it-works/" }, { label: "Workflow", href: "/research-workflow/" }] },
    { label: "Evidence", href: "/evidence/", children: [{ label: "Experiments", href: "/experiments/" }, { label: "Projects", href: "/projects/" }] },
    { label: "Project", href: "/projects/", children: [{ label: "Docs", href: "/docs/" }, { label: "GitHub", href: "/github/" }, { label: "Releases", href: "/releases/" }] },
    { label: "About", href: "/about/", children: [{ label: "Contact", href: "/contact/" }, { label: "Access", href: "/access/" }] }
  ],
  footerGroups: [
    { title: "Explore", links: [{ label: "Product", href: "/product/" }, { label: "Evidence", href: "/evidence/" }, { label: "Projects", href: "/projects/" }] },
    { title: "Project", links: [{ label: "Docs", href: "/docs/" }, { label: "GitHub", href: "/github/" }, { label: "Releases", href: "/releases/" }] },
    { title: "Legal", links: [{ label: "Privacy", href: "/privacy/" }, { label: "Terms", href: "/terms/" }, { label: "Contact", href: "/contact/" }] }
  ],
  pages: [
    page("/", "HowHow", "An evidence-first research system direction with human review at consequential boundaries.", "Serious research. Served like instant noodles.", "HowHow turns a bounded question into a reviewable trail: brief, sources, claims, checks, and a human-owned handoff.", "package", "The research noodle pack", "The public HowHow-Reasoner README is the source for this direction. This site does not claim a released service, scientific result, or automatic publication.", ["Question", "Evidence", "Human review"], { title: "Start with the boundary", body: "Read the integration-spike limits before asking for access.", label: "See access", href: "/access/" }),
    page("/product/", "Product", "The HowHow product direction and its evidence-first operating model.", "A research OS with the seasoning packet still attached.", "The product direction keeps scope, provenance, approvals, and failure history visible beside useful work.", "package", "An inspectable research pack", "These are design commitments derived from the public repository description, not a feature-complete product announcement.", ["Bounded brief", "Evidence ledger", "Review gate"], { title: "Keep the claim small", body: "The current boundary is READY FOR HUMAN REVIEW / integration spike.", label: "Read the boundary", href: "/access/" }),
    page("/how-it-works/", "How it works", "A concise view of the proposed HowHow research loop.", "Unwrap the question. Check the ingredients.", "A question is bounded first, then evidence and claims stay linked through review.", "workflow", "Five steps on the back of the pack", "The repository source emphasizes evidence before prose, provenance, and human ownership of consequential decisions.", ["Brief", "Gather", "Link", "Review", "Handoff"]),
    page("/research-workflow/", "Research workflow", "A bounded workflow for turning research intent into reviewable work.", "No mystery seasoning in the pipeline.", "Write scope, permissions, budget, and stop conditions before a run; preserve what happened after it.", "ingredient-list", "Ingredient list for a research episode", "This is a proposed workflow, not evidence that an automated episode has run in production.", ["Scope", "Permissions", "Stop conditions"]),
    page("/evidence/", "Evidence", "HowHow’s proposed evidence and provenance boundaries.", "Every claim gets a label, not a halo.", "Sources, spans, artifacts, and unresolved uncertainty should remain inspectable instead of disappearing into polished prose.", "ledger", "The evidence ledger", "The public README grounds the evidence-first and provenance direction. No benchmark or research finding is asserted here.", ["Source", "Span", "Claim", "Status"]),
    page("/experiments/", "Experiments", "An honest home for future HowHow experiment records.", "Experiments need receipts, not confetti.", "A future experiment record should state inputs, method, checks, failures, and what a reviewer may conclude.", "checklist", "The experiment receipt", "No live experiment, metric, dataset result, or scientific conclusion is published by this page.", ["Protocol", "Artifact", "Outcome"]),
    page("/projects/", "Projects", "A reviewable index for bounded HowHow research episodes.", "One project, one bowl, one accountable trail.", "Projects are intended to keep a question, its evidence, and its approvals together without implying that work has been completed.", "shelf", "Project shelf", "No customer project, deployment, or completed research episode is claimed. Availability remains unannounced.", ["Brief", "Run record", "Review package"]),
    page("/docs/", "Docs", "Documentation entry points for the HowHow-Reasoner direction.", "Read the label before you cook.", "The public repository is the authoritative starting point for current implementation context and stated boundaries.", "manual", "A short instruction leaflet", "Documentation links point to public source material; this product page does not reproduce repository code.", ["README", "Source trail", "Open questions"], { title: "Open the source", body: "Inspect the public HowHow-Reasoner README.", label: "Read README", href: sourceReadme }),
    page("/github/", "GitHub", "The public source trail for HowHow-Reasoner.", "The code cupboard is public; claims stay careful.", "Use the repository to inspect the project’s stated direction, not as proof of production readiness or scientific novelty.", "link", "Source trail", "The linked GitHub repository is the named source for the current HowHow direction. Repository presence does not establish availability, performance, or certification.", ["Public repository", "README", "Source-backed limits"], { title: "Inspect the repository", body: "Open the named public source directly.", label: "Open GitHub", href: sourceReadme }),
    page("/access/", "Access", "Truthful access status for the HowHow integration spike.", "Apply for a review, not a magic button.", "HowHow is presented as READY FOR HUMAN REVIEW / integration spike. Access, scope, and any implementation path remain subject to human review.", "stamp", "The review stamp", "No generally available service, pricing, customer list, or delivery commitment is announced.", ["Human review", "Integration spike", "Availability unannounced"]),
    page("/releases/", "Releases", "A release shelf that separates direction from shipped evidence.", "Release notes without the instant hype.", "Future release entries should name the artifact, checks, limits, and review status.", "shelf", "Release shelf", "No release date or production package is asserted here; the current public source remains the repository linked above.", ["Artifact", "Checks", "Limits"]),
    page("/about/", "About", "Why HowHow uses FMCG packaging to frame serious research controls.", "Funny wrapper. Serious chain of custody.", "The noodle-pack metaphor makes steps memorable while the underlying language stays explicit about evidence, uncertainty, and human authority.", "mascot", "The reviewer mascot", "The visual language is an original direction for this site, not an affiliation with any referenced brand.", ["Memorable", "Inspect­able", "Human-owned"]),
    page("/contact/", "Contact", "A concise contact route for HowHow review conversations.", "Have a bounded question? Bring the label.", "Contact should begin with the research question, intended inputs, and the decision a person must retain.", "packet", "The contact packet", "Contact is an invitation to discuss a concept-stage integration spike, not a promise of access or support.", ["Question", "Inputs", "Decision"]),
    page("/privacy/", "Privacy", "Privacy boundary for a concept-stage HowHow site.", "No secret ingredients in the fine print.", "Do not send sensitive research material through an unapproved channel; access and retention terms for a future product are not announced.", "label", "Privacy label", "This product page makes no claim about processing, storage, regions, or production data handling beyond the public site’s own policies.", ["Minimize data", "Ask first", "Review terms"]),
    page("/terms/", "Terms", "Terms boundary for the HowHow concept site.", "Read the serving suggestion.", "Any future access would require explicit scope, terms, and human approval; this page is not a product contract.", "label", "Terms label", "No subscription, price, service-level promise, or commercial availability is announced.", ["Scope", "Approval", "No promise"]),
    page("/404.html", "Not found", "The requested HowHow page was not found.", "That packet is missing.", "Try the product shelf or return to the HowHow starting point.", "warning", "Missing packet", "A missing route is not evidence of a hidden release or an available feature.", ["Return", "Browse", "Review"])
  ]
};

export default {
  slug: "howhow",
  name: "HowHow",
  eyebrow: "EVIDENCE-FIRST RESEARCH OS",
  status: "READY FOR HUMAN REVIEW",
  thesis: "A bounded research application that keeps approvals, provenance, and failure history beside every useful result.",
  intro: "HowHow is an evidence-first Research OS for making bounded research work inspectable from question to review. Its current direction is approved for an integration spike; consequential decisions remain explicitly human-owned.",
  proofNote: "The direction is grounded in the HowHow-Reasoner requirements: evidence before prose, human-owned consequential decisions, durable provenance, and truthful readiness. This page describes a research application, not a claim of completed product capability.",
  sections: [
    { id: "brief", kicker: "01 / FRAME", title: "Begin with a question worth bounding.", body: "A research brief makes the question, scope, permissions, budget, stop conditions, and unresolved assumptions visible before work begins.", points: ["Versioned brief", "Explicit non-goals", "Human direction approval"] },
    { id: "ledger", kicker: "02 / TRACE", title: "Keep the trail beside the prose.", body: "Sources, exact spans, runs, artifacts, claims, and reviews remain linked so a reader can inspect what supports a statement and what remains uncertain.", points: ["Source and span records", "Claim-to-evidence links", "Failures preserved"] },
    { id: "release", kicker: "03 / HANDOFF", title: "Stop at a reviewable package.", body: "A bounded loop can prepare reproducibility, license, privacy, and manuscript checks while leaving publication and consequential decisions with a person.", points: ["Independent review gates", "Rebuildable manifests", "Human-owned release"] }
  ],
  capabilities: ["Research briefing", "Evidence ledger", "Approval boundaries", "Failure memory", "Reviewable packaging"],
  evidence: [
    { label: "Integration state", value: "Approved integration spike", state: "READY FOR HUMAN REVIEW" },
    { label: "Grounding", value: "HowHow-Reasoner requirements", state: "SOURCE-BACKED" },
    { label: "Novelty", value: "Not established", state: "UNKNOWN" },
    { label: "Publication", value: "Human decision required", state: "NOT GUARANTEED" }
  ],
  availability: { label: "AVAILABILITY", title: "Apply with a bounded research question.", body: "HowHow is not presented as a generally available service or a guaranteed path to novelty or publication. Research applications require a bounded brief, permitted inputs, and human review.", cta: "Discuss a research episode" },
  sourceLinks: [
    { label: "HowHow-Reasoner README", url: sourceReadme },
    { label: "Navin Research", url: navin }
  ],
  site
};
