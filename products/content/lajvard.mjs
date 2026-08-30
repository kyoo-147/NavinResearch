const lajvard = {
  slug: 'lajvard',
  name: 'Lajvard',
  eyebrow: 'Warm companion field notes / blueprint 01',
  status: 'Concept stage · updates, not preorder',
  thesis: 'A cute, compact humanoid companion imagined for the small rituals of a room: noticing where it is, remembering what matters, and answering with a personality that feels present without pretending to be human.',
  intro: 'Lajvard is a product direction, not a shipping promise. This notebook describes the questions we are testing around a portable robot with spatial awareness, a private journal, and a gentle social presence.',
  proofNote: 'The capabilities below are intentions and design hypotheses. No Lajvard hardware, firmware, availability, performance, or offline/online behavior is being claimed here.',
  sections: [
    {
      id: 'room-notes',
      kicker: '01 / room notes',
      title: 'A map that stays close to the moment',
      body: 'The imagined robot would build a modest spatial memory of its surroundings, then use that context to make movement and conversation feel less random. The map is a design question: what should be remembered, for how long, and with whose permission?',
      points: ['LiDAR mapping is an intended sensing direction, not a demonstrated Lajvard feature.', 'Spatial memory should be inspectable, editable, and easy to clear.', 'The companion should say when it does not know where something is.']
    },
    {
      id: 'private-thread',
      kicker: '02 / private thread',
      title: 'A journal, not a hidden dossier',
      body: 'Lajvard explores a local-first journal of moments an owner chooses to keep. Voice recognition and an offline-online split are proposed interaction patterns; they still need careful consent, identity, and failure-mode work before they can become product behavior.',
      points: ['Owner voice recognition remains a concept-stage intention.', 'Journal entries should carry clear provenance and deletion controls.', 'Network access should be visible rather than assumed.']
    },
    {
      id: 'portable-character',
      kicker: '03 / portable character',
      title: 'Personality with an honest boundary',
      body: 'The character is meant to be warm, compact, and a little humanoid without making emotional guarantees. Portable firmware is an aspiration for continuity across places, while the physical form, power system, and update path remain open research questions.',
      points: ['Personality is a creative direction, not evidence of sentience.', 'Portable firmware is an unbuilt intention.', 'Updates will document what changed; this is not a preorder announcement.']
    }
  ],
  capabilities: [
    'Compact humanoid form',
    'LiDAR mapping direction',
    'Spatial memory direction',
    'Owner voice recognition direction',
    'Local-first journal direction'
  ],
  evidence: [
    { label: 'Hardware', value: 'Not built or demonstrated', state: 'CONCEPT' },
    { label: 'Firmware', value: 'Portable architecture under exploration', state: 'UNVERIFIED' },
    { label: 'Privacy', value: 'Consent and deletion are design requirements', state: 'INTENDED' },
    { label: 'Availability', value: 'No release or preorder announced', state: 'UPDATES ONLY' }
  ],
  availability: {
    label: 'Field notebook',
    title: 'Follow the questions, not a checkout button.',
    body: 'We will share design notes as the direction becomes more concrete. There is no preorder, delivery date, or availability claim attached to this page.',
    cta: 'Read future updates'
  },
  sourceLinks: [
    { label: 'Apple ARKit scene reconstruction', url: 'https://developer.apple.com/documentation/arkit/scene_understanding' },
    { label: 'NIST voice biometric evaluation', url: 'https://www.nist.gov/itl/iad/mig/voice-biometric-evaluations' },
    { label: 'SQLite documentation', url: 'https://www.sqlite.org/docs.html' }
  ]
};

export default lajvard;
