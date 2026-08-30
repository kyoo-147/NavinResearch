const autopilot = {
  slug: 'autopilot',
  name: 'Autopilot',
  eyebrow: 'AUTONOMOUS SCALE-MODEL VEHICLES',
  status: 'OPEN RESEARCH REFERENCE',
  thesis: 'A ROS and deep-learning stack for autonomous scale-model vehicles, documented as a test-track chronicle rather than a production promise.',
  intro: 'Autopilot follows the vehicle from sensor input to control output: camera, IMU, sonar, and localisation feed a ROS-based loop, while learned perception and classical control share the work.',
  proofNote: 'The public project README describes a BFMC-oriented scale-model vehicle, Raspberry Pi and Arduino/Nucleo hardware, ROS nodes, ONNX models, and an official-style test track. Reproduction hardware, model quality, and current runtime behaviour remain to be independently checked.',
  sections: [
    {
      id: 'field-notes',
      kicker: '01 / FIELD NOTES',
      title: 'A small vehicle, a complete loop.',
      body: 'The reference is grounded in a physical scale-model platform. Its chronicle moves from camera frames and inertial orientation through ROS topics toward steering, speed, and motor interfaces.',
      points: ['Camera image input', 'BNO055 IMU orientation', 'Ultrasonic echo distance', 'GPS localisation']
    },
    {
      id: 'control-room',
      kicker: '02 / CONTROL ROOM',
      title: 'Perception meets the track.',
      body: 'The documented loop names lane keeping, traffic-sign, traffic-light, and pedestrian classifiers alongside Pure Pursuit and PID control. These are implementation references, not a claim of general-road autonomy.',
      points: ['ONNX inference at the vehicle edge', 'Lane error signals for the driving loop', 'Pure Pursuit and PID control references', 'Serial commands to an embedded controller']
    },
    {
      id: 'track-chronicle',
      kicker: '03 / TEST-TRACK CHRONICLE',
      title: 'Read the map, then read the limits.',
      body: 'The README records testing against the BFMC track layout with lane markings, traffic signs, and a local GPS map. The next useful chapter is open reproduction: inspect the code, rebuild the setup, and report what survives contact with the track.',
      points: ['BFMC 2024–2025 context', 'Local GPS map and track representation', 'Open-source academic reference', 'Physical validation still requires a capable setup']
    }
  ],
  capabilities: ['ROS sensor graph', 'Deep-learning perception', 'Camera and IMU fusion', 'Lane-keeping control', 'Embedded actuation'],
  evidence: [
    { label: 'Source repository', value: 'Public README and source tree', state: 'VERIFIED' },
    { label: 'Research posture', value: 'Academic / open reference', state: 'VERIFIED' },
    { label: 'Physical reproduction', value: 'Hardware and track access required', state: 'UNVERIFIED' },
    { label: 'Current runtime', value: 'Not executed in this product page', state: 'NOT_CALLED' }
  ],
  media: [
    { src: '/products/media/autopilot/model.jpeg', alt: 'Scale-model autonomous vehicle used by the project', caption: 'PROJECT SOURCE / SCALE-MODEL VEHICLE' },
    { src: '/products/media/autopilot/track.jpeg', alt: 'BFMC-style test track documented by the project', caption: 'PROJECT SOURCE / TEST TRACK' },
    { src: '/products/media/autopilot/hardware-connection.jpg', alt: 'Documented vehicle hardware connection diagram', caption: 'PROJECT SOURCE / HARDWARE CONNECTION' },
    { src: '/products/media/autopilot/map.jpeg', alt: 'Local map representation documented by the project', caption: 'PROJECT SOURCE / LOCAL MAP' },
    { src: '/products/media/autopilot/work.jpeg', alt: 'Project workbench and scale-model vehicle', caption: 'PROJECT SOURCE / BUILD RECORD' }
  ],
  availability: {
    label: 'AVAILABILITY',
    title: 'Open the research trail.',
    body: 'There is no pricing or deployment offer here. Start with the public reference, then bring your own vehicle, sensors, and test-track protocol.',
    cta: 'Read the open research'
  },
  sourceLinks: [
    { label: 'Autopilot & FSD README', url: 'https://github.com/kyoo-147/Autopilot_and_FSD/blob/main/README.md' },
    { label: 'ROS Noetic documentation', url: 'https://wiki.ros.org/noetic' },
    { label: 'Bosch Future Mobility Challenge', url: 'https://www.bosch.com/stories/bosch-future-mobility-challenge/' }
  ]
};

export default autopilot;
