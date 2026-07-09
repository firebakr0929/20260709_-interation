window.App = window.App || {};

App.TAIWAN_CITIES = [
  { name: 'Taipei',     lat: 25.0330, lon: 121.5654 },
  { name: 'New Taipei', lat: 25.0169, lon: 121.4628 },
  { name: 'Taichung',   lat: 24.1477, lon: 120.6736 },
  { name: 'Tainan',     lat: 22.9997, lon: 120.2270 },
  { name: 'Kaohsiung',  lat: 22.6273, lon: 120.3014 },
  { name: 'Taoyuan',    lat: 24.9936, lon: 121.3010 },
  { name: 'Hualien',    lat: 23.9872, lon: 121.6048 },
  { name: 'Taitung',    lat: 22.7599, lon: 121.1444 },
  { name: 'Keelung',    lat: 25.1276, lon: 121.7392 },
  { name: 'Yilan',      lat: 24.7570, lon: 121.7534 },
  { name: 'Hsinchu',    lat: 24.8138, lon: 120.9675 },
  { name: 'Miaoli',     lat: 24.5602, lon: 120.8222 },
  { name: 'Changhua',   lat: 24.0748, lon: 120.5354 },
  { name: 'Nantou',     lat: 23.9098, lon: 120.6879 },
  { name: 'Yunlin',     lat: 23.7080, lon: 120.5278 },
  { name: 'Chiayi',     lat: 23.4865, lon: 120.4527 },
  { name: 'Pingtung',   lat: 22.6738, lon: 120.5409 },
  { name: 'Penghu',     lat: 23.5711, lon: 119.5793 },
];

App.DEFAULT_EPICENTER = { lat: 23.9872, lon: 121.6048 }; // Hualien

App.P_WAVE_SPEED = 5.5;  // km/s
App.S_WAVE_SPEED = 3.2;  // km/s
App.TSUNAMI_SPEED = 0.2; // km/s

App.PGA_THRESHOLDS = {
  safe:       0.8,   // m/s2, below this is safe
  moderate:   2.5,   // m/s2, moderate shaking
};

App.WARNING_RECEIVE_DELAY = 1.5; // seconds after origin time to receive warning

App.HISTORICAL_EARTHQUAKES = [
  {
    id: 1,
    date: '1999-09-21', name: '921 Jiji Earthquake', magnitude: 7.6,
    depth: 8.0, lat: 23.86, lon: 120.82, pga: 9.8,
    imageDesc: 'Collapsed buildings in central Taiwan',
    description: 'The 1999 Jiji earthquake (921 earthquake) was the most devastating earthquake in modern Taiwanese history. It killed 2,415 people, injured 11,306, and caused NT$ 300 billion in damage. The earthquake struck at 1:47 AM local time, with the epicenter in Jiji, Nantou County. The quake highlighted the importance of earthquake early warning systems and led to significant improvements in building codes and disaster preparedness in Taiwan.',
    casualties: 2415, injured: 11306, buildings: 51711,
  },
  {
    id: 2,
    date: '2018-02-06', name: '2018 Hualien Earthquake', magnitude: 6.4,
    depth: 6.3, lat: 24.10, lon: 121.73, pga: 4.2,
    imageDesc: 'Tilted buildings in Hualien',
    description: 'The 2018 Hualien earthquake struck near the east coast of Taiwan at 11:50 PM local time. It caused 17 deaths, 285 injuries, and significant damage to several buildings in Hualien City, including the Marshal Hotel and the Yun Men Tsui Ti building. This event demonstrated the progress Taiwan had made in earthquake preparedness since 1999, with better building codes and emergency response.',
    casualties: 17, injured: 285, buildings: 4,
  },
  {
    id: 3,
    date: '2022-09-17/18', name: '2022 Taitung Series', magnitude: 6.8,
    depth: 7.3, lat: 23.06, lon: 121.22, pga: 3.8,
    imageDesc: 'Damaged railway bridge in Taitung',
    description: 'On September 17-18, 2022, a series of earthquakes struck the Taitung region of eastern Taiwan, with the mainshock reaching Mw 6.8. The earthquake caused 1 death and 171 injuries, derailed a train car in Dongli Station, and caused significant damage to bridges and buildings. Taiwan\'s early warning system provided over 10 seconds of warning to some areas, demonstrating the value of EEW technology.',
    casualties: 1, injured: 171, buildings: 2,
  },
  {
    id: 4,
    date: '2024-04-03', name: '2024 Hualien Earthquake', magnitude: 7.4,
    depth: 15.5, lat: 23.77, lon: 121.67, pga: 5.6,
    imageDesc: 'Landslides and damaged buildings in Hualien',
    description: 'The April 3, 2024 Hualien earthquake was the strongest to hit Taiwan in 25 years since the 1999 Jiji earthquake. It reached a magnitude of 7.4 (USGS) / 7.2 (CWA) at a depth of 15.5 km. The earthquake killed 18 people, injured over 1,100, caused widespread landslides in Taroko Gorge, and damaged several buildings in Hualien City. Taiwan\'s EEW system successfully issued warnings to major cities seconds before strong shaking arrived.',
    casualties: 18, injured: 1100, buildings: 6,
  },
  {
    id: 5,
    date: '2025-01-01', name: '2025 Tainan Earthquake', magnitude: 6.2,
    depth: 11.0, lat: 23.25, lon: 120.15, pga: 3.2,
    imageDesc: 'Damaged buildings in Tainan',
    description: 'On January 1, 2025, a magnitude 6.2 earthquake struck near Tainan in southern Taiwan at a depth of 11 km. The earthquake caused damage to several buildings and infrastructure, with early warning systems providing critical seconds of alert to nearby cities. This event further validated the continued improvements in Taiwan\'s seismic monitoring and early warning capabilities.',
    casualties: 4, injured: 89, buildings: 2,
  },
  {
    id: 6,
    date: '2025-04-18', name: '2025 Taipei Basin Event', magnitude: 5.8,
    depth: 14.2, lat: 25.05, lon: 121.55, pga: 2.1,
    imageDesc: 'Office buildings evacuated in Taipei',
    description: 'A moderate magnitude 5.8 earthquake with epicenter near Taipei in April 2025 caused no casualties but resulted in widespread evacuations of office buildings and minor structural damage. Taipei 101\'s tuned mass damper was activated, swaying by 15 centimeters. The event served as an important test for Taiwan\'s EEW system in a densely populated urban environment.',
    casualties: 0, injured: 12, buildings: 1,
  },
  {
    id: 7,
    date: '2026-02-15', name: '2026 Central Range Quake', magnitude: 5.9,
    depth: 18.5, lat: 24.30, lon: 121.05, pga: 1.8,
    imageDesc: 'Rockfalls on mountain roads',
    description: 'A magnitude 5.9 earthquake struck the Central Mountain Range in February 2026, causing rockfalls on several mountain roads and minor damage to remote villages. Due to its location in a sparsely populated area, casualties were limited to two hikers struck by falling rocks. The EEW system successfully provided 15 seconds of warning to Taichung and surrounding cities.',
    casualties: 2, injured: 5, buildings: 0,
  },
];

App.CHATBOT_INTENTS = [
  { keywords: ['p wave','p-wave','primary wave','push wave','壓力波'], response: 'P-waves (Primary waves) are the fastest seismic waves, traveling at about 5–6 km/s in the Earth\'s crust. They are compressional waves that push and pull particles in the same direction as wave propagation. Think of them like sound waves traveling through the ground. Because they travel faster than S-waves, they are the first signal detected by seismometers and are crucial for early warning systems.' },
  { keywords: ['s wave','s-wave','secondary wave','shear wave','剪力波'], response: 'S-waves (Secondary waves) arrive after P-waves, traveling at about 3–4 km/s. They are shear waves that move particles perpendicular to the direction of travel, like a rope being flicked up and down. S-waves cause more violent shaking and most of the structural damage during earthquakes. The gap between P-wave and S-wave arrival is what gives us time for early warning.' },
  { keywords: ['warning','eew','early warning','預警'], response: 'Earthquake Early Warning (EEW) systems work by detecting the fast-moving P-waves that arrive before the destructive S-waves. When multiple seismometers detect a P-wave, the system rapidly estimates the earthquake\'s location and magnitude, then broadcasts alerts to areas that will experience shaking. Taiwan\'s system can provide anywhere from 3–30 seconds of warning depending on distance from the epicenter.' },
  { keywords: ['magnitude','規模','richter','moment'], response: 'Earthquake magnitude measures the energy released at the source. There are several scales: Richter (local), Moment Magnitude (Mw - most common for large quakes), and Body Wave (Mb). Each whole number increase represents about 32x more energy. For example, a magnitude 6 releases ~32x more energy than a magnitude 5. Taiwan\'s CWA uses Mw for official reporting.' },
  { keywords: ['seismic','seismometer','sensor','station','測站'], response: 'Seismic stations are equipped with sensitive seismometers that detect ground motion. Taiwan operates one of the densest seismic networks in the world with over 700 stations. Each station continuously monitors for P-wave arrivals. When 3+ stations detect an event, the system can triangulate the epicenter within seconds.' },
  { keywords: ['pga','intensity','shaking','acceleration','震度'], response: 'Peak Ground Acceleration (PGA) measures the maximum acceleration experienced by the ground during an earthquake, typically in m/s² or gal (cm/s²). Taiwan uses 0–7 intensity scale based on PGA ranges. For example, Intensity 7 (>4 m/s²) causes very violent shaking. PGA is crucial for understanding how buildings will respond to shaking.' },
  { keywords: ['tsunami','海嘯'], response: 'Tsunamis are generated by undersea earthquakes that cause vertical displacement of the seafloor. The critical factor is magnitude (usually >7.0) and depth (<50 km). Tsunami waves travel at incredible speeds (~800 km/h in deep ocean) but slow down and grow taller as they approach shallow water. Taiwan monitors the Pacific Tsunami Warning Center and operates its own system for local tsunamis.' },
  { keywords: ['blind zone','盲區','shadow'], response: 'The blind zone is the area around the epicenter where S-waves arrive before the early warning can be issued. This happens because: 1) it takes time to detect, locate, and estimate the earthquake (usually 3-5 seconds), and 2) S-waves travel at ~3.2 km/s. For a typical system, the blind zone has a radius of about 15-25 km from the epicenter.' },
  { keywords: ['taiwan','台灣','cwa','中央氣象署'], response: 'Taiwan\'s Central Weather Administration (CWA) operates one of the most advanced earthquake early warning systems in the world. With over 700 seismic stations and 300+ real-time monitoring sites, Taiwan achieves an average warning time of 10-15 seconds for cities outside the blind zone. The system delivers alerts via cell broadcast, TV, radio, and the internet.' },
  { keywords: ['p-alarm','palert','p-alert','pwave alert'], response: 'P-Alert is a low-cost MEMS-based seismic network developed by Taiwan\'s Academia Sinica. These devices cost ~$500 USD each vs. traditional seismometers that cost $10,000+. P-Alert devices are deployed in schools and public buildings across Taiwan, creating a dense supplemental network that speeds up detection and improves warning accuracy.' },
  { keywords: ['fault','斷層','plate','板塊'], response: 'Taiwan lies on the boundary between the Philippine Sea Plate and the Eurasian Plate, making it one of the most seismically active regions in the world. The plate convergence rate is about 8 cm/year. The Longitudinal Valley in eastern Taiwan is a major fault system that produces frequent large earthquakes.' },
  { keywords: ['magic','fast','最快'],
    response: 'The fastest way to get earthquake information in Taiwan is through the CWA\'s cell broadcast system ("Presidential Alert"-style messages), which delivers warnings within seconds of detection. Apps like "KNY Weather" and Google\'s Android Earthquake Alerts also provide rapid notifications. However, even the fastest system cannot provide warning inside the blind zone.' },
  { keywords: ['cwb','cwa'],
    response: 'In 2023, Taiwan\'s Central Weather Bureau (CWB) was renamed to Central Weather Administration (CWA). The agency operates the national EEW system, manages 700+ seismic stations, and issues official earthquake reports.'
  },
  { keywords: ['code','cooperate','coordination','coordination-based','coded'],
    response: 'The "Coded" approach in the agents panel at the Coordination step highlights how different agencies and systems work together during an earthquake response: sensors detect P-waves → ingestion systems process data → EEW servers estimate parameters → ShakeMap generates intensity maps → advisories are issued → LLM systems help interpret data. Every step requires seamless cooperation.'
  },
  { keywords: ['7.6','big one','largest'],
    response: 'The largest earthquake in modern Taiwanese history is the 1999 Jiji (921) Earthquake at Mw 7.6. However, paleoseismic evidence suggests that the area has experienced earthquakes as large as Mw 8.0 in the past several thousand years. The 2024 Hualien Earthquake (Mw 7.4) and the 2025 Tainan Earthquake (Mw 6.2) are more recent significant events.'
  },
  { keywords: ['default','hello','hi','start'],
    response: 'Hello! I\'m your earthquake knowledge assistant. I can answer questions about P-waves, S-waves, early warning systems, earthquake magnitude, Taiwan\'s seismic network, the blind zone, historical earthquakes, tsunamis, and more. Just type a question in the chat! For example, "What are P-waves?" or "How does EEW work?"' },
];

App.CHATBOT_DEFAULT = App.CHATBOT_INTENTS.find(i => i.keywords.includes('default'));

App.AGENTS_STEPS = [
  { step: 'Sensor', lines: [
    'CWA seismic station HWA-013: P-wave detected at 23°59\'14"N, 121°36\'18"E',
    'P-Alert school network node S0452: P-wave confirmed',
    'ShakeAlert node SA-TW-221: S-wave onset detected',
  ]},
  { step: 'Ingestion', lines: [
    'Data fusion engine: Processing 3 sensor triggers in buffer window',
    'Earthquake association algorithm: Events share 93% waveform similarity → linking',
    'Phase picker: P arrival 14.32s, S arrival 18.87s → depth constraint applied',
  ]},
  { step: 'EEW', lines: [
    'Locator: Grid search converged → 23.987°N, 121.605°E ± 1.2 km',
    'Magnitude estimator: Pd-Pv relation → Mw 6.2 ± 0.3',
    'HypoDD relocation: Depth 12.4 km → refined to 11.8 km',
  ]},
  { step: 'ShakeMap', lines: [
    'PGA interpolation: Kriging with topographic correction → field generated',
    'Intensity conversion: CWA scale Level 5- in Hualien, Level 4 in Taipei',
    'Finite-fault model: Rupture directivity NE-trending → higher PGA NE regions',
  ]},
  { step: 'Advisory', lines: [
    'CWA alert gateway: EEW message formatted → cell broadcast triggered',
    'TV/Radio override: Insert alert crawl to all major networks',
    'Mass notification: CWA app push + Google FCM + Apple APNs dispatched',
  ]},
  { step: 'LLM', lines: [
    'Disaster Response LLM: Context from ShakeMap + historical catalog',
    'Impact assessment: Pop density 4,200/km² in blind zone → high priority',
    'Synthesized report: Generated in 1.3s → routing to emergency command center',
  ]},
  { step: 'Report', lines: [
    'AUTHORIZED EARTHQUAKE REPORT',
    '----------------------------',
    'Magnitude: Mw 6.2 | Depth: 11.8 km',
    'Location: 23.987°N, 121.605°E (Hualien offshore)',
    'Max PGA: 4.2 m/s² | Max Intensity: CWA Level 5-',
    '----------------------------',
    'Situation: EEW provided 12s warning to Taipei, 22s to Kaohsiung. Blind zone radius ~18 km (Hualien City & Ji-an). No tsunami generated.',
    'Response: Emergency Operations Center activated (Level 2). CWA continues to monitor aftershock sequence.',
    '----------------------------',
  ]},
];

App.KNOWLEDGE_SECTIONS = {
  overview: {
    title: 'What is an Earthquake?',
    content: 'An earthquake is the sudden release of energy in the Earth\'s crust that creates seismic waves. This release happens when accumulated stress along fault lines exceeds the strength of rocks, causing them to break and slip. The point of initial rupture is the focus (hypocenter), and the point directly above on the surface is the epicenter.',
  },
  pwave: {
    title: 'P-Waves (Fast)',
    content: 'P-waves are longitudinal (compressional) waves that travel fastest at 5–6 km/s. They alternately compress and expand the material, similar to sound waves. P-waves can travel through solids, liquids, and gases, making them the first to arrive at any seismometer.',
  },
  swave: {
    title: 'S-Waves (Destructive)',
    content: 'S-waves are transverse (shear) waves that travel at 3–4 km/s, about 60% the speed of P-waves. They move the ground perpendicular to the direction of travel, causing much stronger shaking. S-waves cannot travel through liquids. The gap between P and S arrivals (S-P time) is the basis for earthquake early warning.',
  },
  magnitude: {
    title: 'Magnitude Scales',
    content: 'The Moment Magnitude scale (Mw) is the most widely used for moderate to large earthquakes. It measures the total energy released based on the area of the fault rupture, the amount of slip, and the rigidity of rocks. The Richter scale (ML) is an older scale that is less accurate for large earthquakes (>6.5). Each unit increase in magnitude corresponds to approximately 32 times more energy release.',
  },
  pga: {
    title: 'Intensity & PGA',
    content: 'Peak Ground Acceleration (PGA) measures the maximum acceleration experienced by the ground, expressed in m/s² or gal. Taiwan\'s intensity scale (0–7) maps PGA ranges to human perception and damage levels. Intensity 4: many sleeping people woken. Intensity 5-: unsecured objects topple. Intensity 6-: difficult to stand. Intensity 7: violent shaking, buildings collapse.',
  },
  eew: {
    title: 'Early Warning Principles',
    content: 'EEW systems exploit the speed difference between P-waves and S-waves. Sensors detect P-waves, the system estimates epicenter and magnitude in 3–5 seconds, and broadcasts warnings before S-waves arrive. Effective for areas 20–30 km from epicenter. Taiwan achieves 10–15 seconds of average warning time for populated areas outside the blind zone.',
  },
};

App.CANVAS_BG = '#0a0e1a';
App.CIRCLE_COLOR_FAINT = 'rgba(255,255,255,0.06)';
App.CIRCLE_COLOR_MED = 'rgba(255,255,255,0.12)';
App.P_WAVE_COLOR = '#00d4ff';
App.S_WAVE_COLOR = '#ef4444';
App.EPI_COLOR = '#ff6b35';
App.CITY_COLOR = 'rgba(255,255,255,0.5)';
App.BLIND_COLOR = 'rgba(239,68,68,0.15)';
App.WARN_COLOR = 'rgba(0,212,255,0.2)';
