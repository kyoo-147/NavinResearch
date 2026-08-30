const dossier = {
  slug: "dossier",
  name: "Dossier",
  eyebrow: "Agentic Document Intelligence",
  status: "Early-access interest",
  thesis: "A local-first document desk for turning difficult pages into reviewable, approved, integration-ready structured data.",
  intro: "Dossier is a concept-stage direction for document work where extraction is only the beginning. Each proposed record stays connected to the page, the decision, and the person who approved it.",
  proofNote: "Concept stage: the workflow and capability areas are planned, not a claim of shipped OCR accuracy, automation coverage, or production readiness.",
  sections: [
    {
      id: "desk",
      kicker: "01 / Forensic document desk",
      title: "Read the page before it becomes a row.",
      body: "A document is treated as an inspectable artefact. The planned desk keeps page context visible while an agent proposes observations, fields, and questions for human review.",
      points: ["Page-aware inspection", "Evidence attached to proposals", "Human approval before handoff"]
    },
    {
      id: "signal",
      kicker: "02 / Structured signal",
      title: "Make uncertainty legible.",
      body: "Planned OCR, handwriting, layout, table, form, and extraction passes would turn heterogeneous pages into candidate structure without hiding what still needs attention.",
      points: ["Layout and reading-order hypotheses", "Tables and forms as named structures", "QA prompts for ambiguous fields"]
    },
    {
      id: "handoff",
      kicker: "03 / Approved handoff",
      title: "Export only what the desk can defend.",
      body: "Validation and evidence views are intended to make an approved record portable to downstream systems. The destination contract remains explicit rather than inferred from a chat transcript.",
      points: ["Schema-shaped outputs", "Validation before export", "A traceable approval boundary"]
    }
  ],
  capabilities: ["OCR", "Handwriting", "Layout and tables", "Forms and extraction", "QA and evidence"],
  evidence: [
    { label: "Product posture", value: "Local-first concept", state: "PLANNED" },
    { label: "Review boundary", value: "Human approval required", state: "INTENT" },
    { label: "Output posture", value: "Integration-ready structure", state: "TARGET" },
    { label: "Current access", value: "Early-access interest", state: "OPEN" }
  ],
  availability: {
    label: "Availability",
    title: "A desk being drawn in public.",
    body: "Dossier is not presented as a launched product. Share an early-access signal to help shape the review workflow and the documents it should respect.",
    cta: "Register interest"
  },
  sourceLinks: [
    { label: "W3C Web Annotation Data Model", url: "https://www.w3.org/TR/annotation-model/" },
    { label: "JSON Schema specification", url: "https://json-schema.org/specification" },
    { label: "NIST AI Risk Management Framework", url: "https://www.nist.gov/itl/ai-risk-management-framework" }
  ]
};

export default dossier;
