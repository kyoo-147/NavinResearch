const sandora = {
  slug: 'sandora',
  name: 'Sandora',
  eyebrow: 'AI DEPARTMENT OS',
  status: 'CONCEPT / EARLY ACCESS',
  thesis: 'An organizational atlas for virtual AI teams, where automated work remains visible, reviewable, and human-governed.',
  intro: 'Sandora is an early product direction for coordinating virtual AI teams. It treats roles, context, handoffs, approvals, and audit as the connective tissue of automated workflows—not as hidden implementation detail.',
  proofNote: 'Concept-stage description only. No production deployment, performance claim, pricing, or customer result is being asserted.',
  sections: [
    {
      id: 'atlas',
      kicker: '01 / ORIENTATION',
      title: 'Map the department before it moves.',
      body: 'A shared organizational atlas can make an AI team legible: who is responsible, what context travels, and where a person must decide.',
      points: ['Define roles and boundaries', 'Keep working context attached to the task', 'Make ownership visible at each handoff']
    },
    {
      id: 'workflow',
      kicker: '02 / MOTION',
      title: 'Automate the route, not the judgment.',
      body: 'Sandora is conceived around repeatable workflows that pass work between virtual roles while reserving consequential choices for explicit approval.',
      points: ['Sequence role-to-role handoffs', 'Record pending approvals', 'Pause safely when instructions or context are incomplete']
    },
    {
      id: 'record',
      kicker: '03 / ACCOUNTABILITY',
      title: 'Leave a readable record.',
      body: 'An audit view should show how work moved through the department, what was proposed, and which human decisions governed the outcome.',
      points: ['Trace actions to a workflow step', 'Separate proposals from approvals', 'Review the history before extending automation']
    }
  ],
  capabilities: ['Role atlas', 'Context routing', 'Workflow handoffs', 'Approval gates', 'Audit record'],
  evidence: [
    { label: 'Product state', value: 'Early concept', state: 'CONCEPT-STAGE' },
    { label: 'Operating model', value: 'Human-governed automation', state: 'DESIGN INTENT' },
    { label: 'Deployment', value: 'Not announced', state: 'UNVERIFIED' },
    { label: 'Pricing', value: 'No prices', state: 'NOT ANNOUNCED' }
  ],
  availability: {
    label: 'EARLY ACCESS',
    title: 'Register interest, not a promise.',
    body: 'Sandora is not available as a released product. Early-access interest is non-binding and helps shape what a human-governed AI department could become.',
    cta: 'Express interest'
  },
  sourceLinks: [
    { label: 'Sandora concept page', url: 'https://sandora.navinresearch.com/' },
    { label: 'Navin Research', url: 'https://navinresearch.com/' }
  ]
};

export default sandora;
