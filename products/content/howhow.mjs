export default {
  slug: "howhow",
  name: "HowHow",
  eyebrow: "EVIDENCE-FIRST RESEARCH OS",
  status: "READY FOR HUMAN REVIEW",
  thesis: "A bounded research application that keeps approvals, provenance, and failure history beside every useful result.",
  intro: "HowHow is an evidence-first Research OS for making bounded research work inspectable from question to review. Its current direction is approved for an integration spike; consequential decisions remain explicitly human-owned.",
  proofNote: "The direction is grounded in the HowHow-Reasoner requirements: evidence before prose, human-owned consequential decisions, durable provenance, and truthful readiness. This page describes a research application, not a claim of completed product capability.",
  sections: [
    {
      id: "brief",
      kicker: "01 / FRAME",
      title: "Begin with a question worth bounding.",
      body: "A research brief makes the question, scope, permissions, budget, stop conditions, and unresolved assumptions visible before work begins.",
      points: ["Versioned brief", "Explicit non-goals", "Human direction approval"]
    },
    {
      id: "ledger",
      kicker: "02 / TRACE",
      title: "Keep the trail beside the prose.",
      body: "Sources, exact spans, runs, artifacts, claims, and reviews remain linked so a reader can inspect what supports a statement and what remains uncertain.",
      points: ["Source and span records", "Claim-to-evidence links", "Failures preserved"]
    },
    {
      id: "release",
      kicker: "03 / HANDOFF",
      title: "Stop at a reviewable package.",
      body: "A bounded loop can prepare reproducibility, license, privacy, and manuscript checks while leaving publication and consequential decisions with a person.",
      points: ["Independent review gates", "Rebuildable manifests", "Human-owned release"]
    }
  ],
  capabilities: [
    "Research briefing",
    "Evidence ledger",
    "Approval boundaries",
    "Failure memory",
    "Reviewable packaging"
  ],
  evidence: [
    { label: "Integration state", value: "Approved integration spike", state: "READY FOR HUMAN REVIEW" },
    { label: "Grounding", value: "HowHow-Reasoner requirements", state: "SOURCE-BACKED" },
    { label: "Novelty", value: "Not established", state: "UNKNOWN" },
    { label: "Publication", value: "Human decision required", state: "NOT GUARANTEED" }
  ],
  availability: {
    label: "AVAILABILITY",
    title: "Apply with a bounded research question.",
    body: "HowHow is not presented as a generally available service or a guaranteed path to novelty or publication. Research applications require a bounded brief, permitted inputs, and human review.",
    cta: "Discuss a research episode"
  },
  sourceLinks: [
    { label: "HowHow-Reasoner README", url: "https://github.com/kyoo-147/HowHow-Reasoner/blob/main/README.md" },
    { label: "Navin Research", url: "https://navinresearch.com/" }
  ]
};
