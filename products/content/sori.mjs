const sori = {
  slug: "sori",
  name: "Sori",
  eyebrow: "PROGRAMMABLE VOICE RUNTIME",
  status: "BETA INTEREST ONLY",
  thesis: "A quiet, local-first voice runtime for desktop work.",
  intro: "Sori is a Windows-first desktop MVP foundation: a small instrument for speaking into the active app, with the runtime, permissions, and boundaries kept visible when they matter.",
  proofNote: "The repository documents a Rust daemon, loopback IPC, SQLite persistence, and explicit capability diagnostics. Microphone speech, physical hotkey delivery, focused-app insertion, and transcript persistence from a real session remain UNVERIFIED and machine-dependent.",
  sections: [
    {
      id: "hot-path",
      kicker: "01 / THE HOT PATH",
      title: "A voice gesture, not another destination.",
      body: "The intended daily path is compact: grant permissions, hold a hotkey, speak, release, and let text meet the focused app. The overlay stays small and appears for listening, preview, or attention.",
      points: ["Hold-to-speak interaction", "Tiny overlay and tray presence", "Focused-app insertion is an explicit boundary"]
    },
    {
      id: "runtime",
      kicker: "02 / THE INSTRUMENT",
      title: "Programmable beneath the surface.",
      body: "A desktop shell can talk to a local Sori daemon over bounded loopback IPC. Context, audio, routing, history, profiles, skills, and permissions are arranged as runtime concerns rather than a dashboard of promises.",
      points: ["Rust daemon with loopback IPC", "Local SQLite metadata and history", "Progressive disclosure from basic to expert"]
    },
    {
      id: "boundary",
      kicker: "03 / THE BOUNDARY",
      title: "Useful, with the unknowns marked.",
      body: "Sori keeps audio local-first by default in its product direction and gates side effects behind dry-run and approval. The current foundation is not presented as a verified physical voice vertical slice.",
      points: ["Cloud and local providers can be routed deliberately", "Side effects require explicit approval by default", "Physical microphone and insertion evidence remain UNVERIFIED"]
    }
  ],
  capabilities: [
    "Local-first desktop runtime",
    "Hotkey-led voice interaction",
    "Model and provider routing",
    "Local history and metadata",
    "Skills, tools, and permissions"
  ],
  evidence: [
    { label: "Runtime shape", value: "Rust daemon + loopback IPC", state: "DOCUMENTED" },
    { label: "Persistence", value: "SQLite metadata", state: "DOCUMENTED" },
    { label: "Physical voice path", value: "Microphone → text → focused app", state: "UNVERIFIED" },
    { label: "Availability", value: "Beta interest only", state: "CONCEPT STAGE" }
  ],
  availability: {
    label: "EARLY SIGNAL",
    title: "Quietly taking interest.",
    body: "Sori is not open for general product access. Registering interest helps shape the next review without implying a release, pricing, or physical-runtime guarantee.",
    cta: "Register beta interest"
  },
  sourceLinks: [
    { label: "Sori README / product thesis", url: "https://github.com/kyoo-147/Sori/blob/main/README.md" },
    { label: "Sori repository", url: "https://github.com/kyoo-147/Sori" }
  ]
};

export default sori;
