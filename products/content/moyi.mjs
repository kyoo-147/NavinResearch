const moyi = {
  slug: "moyi",
  name: "Moyi",
  eyebrow: "EDGE SPEECH INTELLIGENCE",
  status: "RESEARCH PREVIEW",
  thesis: "Translation that keeps the operational signal in the room.",
  intro: "Moyi is an on-device AI translation runtime for multilingual operations where context, terminology, and safety messages matter. This is a research preview: the acoustic field is a design concept, not a claim of finished performance.",
  proofNote: "Concept-stage direction grounded in Navin Research's public Moyi description and release inventory; no benchmark, language-count, or latency claim is made here.",
  sections: [
    {
      id: "field",
      kicker: "01 / ACOUSTIC FIELD",
      title: "Translation begins before the sentence.",
      body: "Operations are shaped by distance, noise, turn-taking, and the words a team has agreed to use. Moyi treats the surrounding acoustic field as part of the translation context to be studied.",
      points: ["Capture the local scene", "Keep speaker turns legible", "Surface uncertainty for review"]
    },
    {
      id: "lexicon",
      kicker: "02 / OPERATIONAL LANGUAGE",
      title: "Terminology is part of safety.",
      body: "A useful translation runtime must leave room for local names, procedures, and safety messages. Moyi's research direction pairs translation with an explicit operational lexicon rather than treating every utterance as generic text.",
      points: ["Respect team vocabulary", "Preserve safety wording", "Keep human review in the loop"]
    },
    {
      id: "edge",
      kicker: "03 / LOCAL RUNTIME",
      title: "Keep the critical path close.",
      body: "On-device execution is the intended runtime direction for work where connectivity, privacy, or response conditions can vary. Deployment boundaries and quality remain open research questions.",
      points: ["Design for local execution", "Separate runtime from proof", "Measure before making claims"]
    }
  ],
  capabilities: ["On-device runtime", "Speech translation", "Operational terminology", "Acoustic context", "Safety-aware review"],
  evidence: [
    { label: "Stage", value: "Research preview", state: "STATED" },
    { label: "Runtime direction", value: "On-device translation", state: "STATED" },
    { label: "Evidence boundary", value: "No performance claims", state: "EXPLICIT" }
  ],
  availability: {
    label: "CURRENT ACCESS",
    title: "A research direction, not a shipped service.",
    body: "Moyi is being developed as a research preview. There is no public benchmark or deployment package represented by this page.",
    cta: "Read the research notes"
  },
  sourceLinks: [
    { label: "Moyi product page", url: "https://moyi.navinresearch.com/" },
    { label: "Public release inventory", url: "https://navinresearch.com/releases/" }
  ]
};

export default moyi;
