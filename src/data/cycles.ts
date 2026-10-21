import {
  CyclePhase,
  CycleConfig,
  PhaseDetails,
  CalculatedCycle,
  StretchExercise,
  HerbalTeaRecipe,
  GlowMaskRecipe,
  Affirmation,
  FutureEvent,
} from '../types';

export const DEFAULT_CONFIG: CycleConfig = {
  lastPeriodDate: '2026-10-10',
  cycleLength: 28,
  periodDuration: 5,
  userName: 'Esther',
  userAvatar: '/assets/aistudio/brown_skin_girl_b8282b0e.jpg',
  dailyReminderTime: '18:00',
  enableReminders: true,
};

export const PHASE_DEFINITIONS: Record<CyclePhase, PhaseDetails> = {
  menstrual: {
    phase: 'menstrual',
    name: 'Menstrual Phase',
    season: 'Inner Winter · The Moon Tide',
    element: 'Water & Earth',
    colorName: 'Rose Dusk',
    accentBg: 'bg-rose-950/40',
    accentBorder: 'border-rose-500/40',
    glowColor: '#f43f5e',
    tagline: 'Quiet stillness, sacred surrender, and womb renewal.',
    energyLevel: 'Reflective & Gentle (Low)',
    hormones: 'Estrogen and progesterone at lowest levels; body prepares for shedding and renewal.',
    description:
      'Your bleeding days are an invitation to slow down. Society tells you to push through, but ancestral wisdom reminds you that rest is resistance and royalty.',
    goddessArchetype: 'The Intuitive Oracle & Dreamer',
    heroImage: '/assets/aistudio/1004795366864766055_c9296eb8.jpg',
    selfCareFocus: 'Deep warm hydration, wide hip releases, zero pressure, hibiscus & clove infusions.',
  },
  follicular: {
    phase: 'follicular',
    name: 'Follicular Phase',
    season: 'Inner Spring · The Sprouting',
    element: 'Air & Sap',
    colorName: 'Radiant Amethyst',
    accentBg: 'bg-purple-950/40',
    accentBorder: 'border-purple-500/40',
    glowColor: '#a855f7',
    tagline: 'Fresh beginnings, rising vitality, and playful curiosity.',
    energyLevel: 'Rising & Creative (Medium-High)',
    hormones: 'FSH stimulates follicles; estrogen steadily rises, boosting serotonin, neuroplasticity, and stamina.',
    description:
      'Your mental fog lifts as estrogen climbs. You feel open to new ideas, spontaneous conversations, and joyful experiments.',
    goddessArchetype: 'The Visionary Maiden & Creator',
    heroImage: '/assets/aistudio/956170564654301388_3dd2164e.jpg',
    selfCareFocus: 'Coffee & honey morning glow, vibrant movement, creative art, learning new crafts.',
  },
  ovulatory: {
    phase: 'ovulatory',
    name: 'Ovulatory Phase',
    season: 'Inner Summer · High Sun',
    element: 'Fire & Light',
    colorName: 'Sunset Amber Gold',
    accentBg: 'bg-amber-950/40',
    accentBorder: 'border-amber-500/40',
    glowColor: '#f59e0b',
    tagline: 'Magnetic presence, peak charisma, and sensual celebration.',
    energyLevel: 'Peak Radiance & Stamina (High)',
    hormones: 'Luteinizing Hormone (LH) surges; estrogen peaks; subtle testosterone spike triggers supreme confidence.',
    description:
      'You are at your most magnetic and expressive. Your verbal fluency is sharp, and your aura glows. Command the room and celebrate your beauty.',
    goddessArchetype: 'The Sun Queen & Sovereign',
    heroImage: '/assets/aistudio/312648399156378803_94ce392c.jpg',
    selfCareFocus: 'Sunset ocean walks, gold jewelry adornments, bold conversations, celebrating connections.',
  },
  luteal: {
    phase: 'luteal',
    name: 'Luteal Phase',
    season: 'Inner Autumn · The Sacred Harvest',
    element: 'Fire to Earth',
    colorName: 'Twilight Orchid & Velvet Plum',
    accentBg: 'bg-fuchsia-950/40',
    accentBorder: 'border-fuchsia-500/40',
    glowColor: '#d946ef',
    tagline: 'Discernment, boundary setting, nesting, and tender self-compassion.',
    energyLevel: 'Waning & Inward (Medium to Low)',
    hormones: 'Progesterone climbs then falls sharply; GABA sensitivity can trigger premenstrual depression waves.',
    description:
      'The luteal phase tests your gentleness with yourself. Premenstrual emotional waves are not personal defects—they are your nervous system asking for sacred sanctuary.',
    goddessArchetype: 'The Wise Medicine Woman & Guardian',
    heroImage: '/assets/aistudio/Purple_sunset______ai_295e6a01.jpg',
    selfCareFocus: 'PMDD sanctuary, grounding lemon-ginger brew, deep hip openers, tomato & sugar polish, saying no.',
  },
};

/**
 * Calculates cycle metrics from config and target date
 */
export function calculateCycle(config: CycleConfig, targetDate: Date = new Date()): CalculatedCycle {
  const start = new Date(config.lastPeriodDate + 'T00:00:00');
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const cycleLen = Math.max(20, config.cycleLength || 28);
  const periodDuration = Math.max(3, Math.min(10, config.periodDuration || 5));

  // Modulo calculation for recurring cycle
  let cycleDay = (diffDays % cycleLen) + 1;
  if (cycleDay <= 0) {
    cycleDay = ((cycleDay - 1) % cycleLen) + cycleLen + 1;
  }

  // Phase durations
  // Menstrual: Day 1 to periodDuration
  // Ovulation around cycleLen - 14
  const estimatedOvulationDay = Math.max(periodDuration + 4, cycleLen - 14);
  const follicularEnd = estimatedOvulationDay - 2;
  const ovulatoryEnd = estimatedOvulationDay + 2;

  let phase: CyclePhase = 'follicular';
  let dayInPhase = 1;
  let phaseDuration = 1;

  if (cycleDay <= periodDuration) {
    phase = 'menstrual';
    dayInPhase = cycleDay;
    phaseDuration = periodDuration;
  } else if (cycleDay <= follicularEnd) {
    phase = 'follicular';
    dayInPhase = cycleDay - periodDuration;
    phaseDuration = follicularEnd - periodDuration;
  } else if (cycleDay <= ovulatoryEnd) {
    phase = 'ovulatory';
    dayInPhase = cycleDay - follicularEnd;
    phaseDuration = ovulatoryEnd - follicularEnd;
  } else {
    phase = 'luteal';
    dayInPhase = cycleDay - ovulatoryEnd;
    phaseDuration = cycleLen - ovulatoryEnd;
  }

  const daysUntilNextPeriod = cycleLen - cycleDay + 1;

  // Next period date
  const nextPeriod = new Date(target);
  nextPeriod.setDate(target.getDate() + daysUntilNextPeriod);
  const nextPeriodDate = nextPeriod.toISOString().split('T')[0];

  // Ovulation date in current cycle
  const currentCycleStart = new Date(target);
  currentCycleStart.setDate(target.getDate() - (cycleDay - 1));

  const ovulation = new Date(currentCycleStart);
  ovulation.setDate(currentCycleStart.getDate() + (estimatedOvulationDay - 1));
  const ovulationDate = ovulation.toISOString().split('T')[0];

  const fertileStart = new Date(ovulation);
  fertileStart.setDate(ovulation.getDate() - 4);
  const fertileEnd = new Date(ovulation);
  fertileEnd.setDate(ovulation.getDate() + 1);

  return {
    currentCycleDay: cycleDay,
    totalCycleDays: cycleLen,
    phase,
    phaseDetails: PHASE_DEFINITIONS[phase],
    dayInPhase,
    phaseDuration,
    daysUntilNextPeriod,
    nextPeriodDate,
    fertileWindowStart: fertileStart.toISOString().split('T')[0],
    fertileWindowEnd: fertileEnd.toISOString().split('T')[0],
    ovulationDate,
    progressPercent: Math.round((cycleDay / cycleLen) * 100),
  };
}

export const STRETCHES: StretchExercise[] = [
  {
    id: 'butterfly',
    name: 'Goddess Reclined Butterfly',
    sanskrit: 'Supta Baddha Konasana',
    phase: 'all',
    target: 'Pelvic floor, groin, lower back and womb relief',
    durationSeconds: 180,
    instructions: [
      'Lie gently on your back upon a soft mat or blanket.',
      'Bring the soles of your feet together, letting your knees fall wide open like butterfly wings.',
      'Place one palm on your heart and your other palm over your lower belly / womb.',
      'Close your eyes and breathe deep into your pelvis for 3 mindful minutes, letting gravity release hip tension.',
    ],
    goddessWisdom:
      'This sacred posture opens the energetic gateway of your second chakra (Svadhisthana), easing menstrual cramps and calming premenstrual anxiety.',
    iconType: 'butterfly',
  },
  {
    id: 'pigeon',
    name: 'Sleeping Pigeon Pose',
    sanskrit: 'Eka Pada Rajakapotasana',
    phase: 'luteal',
    target: 'Deep hip flexors, psoas release, and emotional unwinding',
    durationSeconds: 120,
    instructions: [
      'From hands and knees, bring your right knee forward behind your right wrist.',
      'Slide your left leg straight back, keeping your hips squared to the floor.',
      'Slowly walk your hands forward and rest your forehead on your hands or a pillow.',
      'Breathe deeply for 1 to 2 minutes on each side, exhaling any stored tension.',
    ],
    goddessWisdom:
      'We store unexpressed emotions, grief, and survival stress deeply inside the psoas and hip joints. Releasing here clears emotional heaviness.',
    iconType: 'pigeon',
  },
  {
    id: 'child',
    name: 'Wide-Knee Restorative Child’s Pose',
    sanskrit: 'Balasana',
    phase: 'menstrual',
    target: 'Lower back decompression, sacrum ease, nervous system rest',
    durationSeconds: 180,
    instructions: [
      'Kneel on the floor with your big toes touching and knees opened wide.',
      'Sink your hips back toward your heels and fold your chest down between your thighs.',
      'Extend your arms forward or drape them alongside your hips.',
      'Rest your forehead on the floor and surrender all effort.',
    ],
    goddessWisdom:
      'When your bleed begins or fatigue peaks, Balasana cradles you in maternal earth energy, resetting an overwhelmed nervous system.',
    iconType: 'child',
  },
  {
    id: 'goddess-squat',
    name: 'Empowered Goddess Squat',
    sanskrit: 'Utkata Konasana',
    phase: 'ovulatory',
    target: 'Pelvic power, inner thigh stamina, sovereign presence',
    durationSeconds: 90,
    instructions: [
      'Stand with feet wide apart, turning your toes outward at 45 degrees.',
      'Bend your knees and sink your hips low into a confident squat.',
      'Raise your arms into cactus shape or place hands on your hips with royal poise.',
      'Breathe slow and feel your feet rooted firmly into the earth.',
    ],
    goddessWisdom:
      'Celebrates your full sovereign power during your high sun phase. Awakens primal confidence and strengthens pelvic tone.',
    iconType: 'goddess',
  },
  {
    id: 'cat-cow',
    name: 'Fluid Pelvic Cat-Cow Waves',
    sanskrit: 'Marjaryasana-Bitilasana',
    phase: 'follicular',
    target: 'Spinal lubrication, pelvic fluidity, gentle core wakefulness',
    durationSeconds: 120,
    instructions: [
      'Begin on hands and knees with wrists under shoulders and knees under hips.',
      'Inhale, dip your belly softly, open your chest, and look forward (Cow).',
      'Exhale, press the floor away, round your spine toward the ceiling, and tuck your chin (Cat).',
      'Add gentle circular hip rolls as you move between the two shapes.',
    ],
    goddessWisdom:
      'Encourages fresh oxygenated blood to your reproductive organs as estrogen begins its joyful climb.',
    iconType: 'catcow',
  },
];

export const HERBAL_TEAS: HerbalTeaRecipe[] = [
  {
    id: 'hibiscus-cloves',
    name: 'Hibiscus & Cloves Womb Elixir',
    subtitle: 'Warm Bissap / Zobo Infusion for Iron & Cramp Relief',
    phase: 'menstrual',
    ingredients: [
      '2 tablespoons dried organic hibiscus flowers (calyces)',
      '4 whole aromatic cloves',
      '1 stick of Ceylon cinnamon (optional)',
      '1 teaspoon raw organic honey to taste',
      '2 cups filtered water',
    ],
    instructions: [
      'Bring water, hibiscus flowers, and whole cloves to a gentle simmer in a small saucepan for 7–10 minutes.',
      'Turn off the heat and allow the deep magenta brew to steep covered for another 5 minutes.',
      'Strain into your favorite ceramic mug.',
      'Stir in a spoonful of raw honey while it is warmly soothing.',
    ],
    healingProperties:
      'Hibiscus is rich in bioavailable plant iron and antioxidants to restore lost blood, while warming cloves contain eugenol, an effective natural anti-inflammatory that eases painful uterine cramps.',
    bestTime: 'Early evening during your bleed or when premenstrual cramps begin.',
    image: '/assets/aistudio/605804587408707259_3a621ee3.jpg',
  },
  {
    id: 'lemon-ginger',
    name: 'Lemon & Fresh Ginger Vitality Infusion',
    subtitle: 'Morning Fire & Digestive Cleanser',
    phase: 'luteal',
    ingredients: [
      '1 inch fresh ginger root, thinly sliced or lightly bruised',
      'Juice of half a fresh ripe lemon',
      'Pinch of cayenne pepper or turmeric (optional)',
      '1 teaspoon raw honey',
      '2 cups steaming water',
    ],
    instructions: [
      'Place freshly sliced ginger into hot water and steep covered for 10 minutes.',
      'Squeeze in the fresh lemon juice right before sipping so vitamin C remains potent.',
      'Sweeten gently with raw honey and sip slowly while warm.',
    ],
    healingProperties:
      'Ginger stimulates sluggish luteal digestion, melts away water retention and premenstrual bloating, and banishes morning brain fog.',
    bestTime: 'Morning or mid-afternoon when progesterone causes sluggishness.',
    image: '/assets/aistudio/956170564654301388_3dd2164e.jpg',
  },
  {
    id: 'rooibos-chamomile',
    name: 'African Rooibos & Chamomile Dusk Nectar',
    subtitle: 'Nervous System Calming & PMDD Balm',
    phase: 'all',
    ingredients: [
      '1 pouch or tablespoon red bush rooibos',
      '1 tablespoon dried chamomile flowers',
      '1 teaspoon pure vanilla extract or cinnamon bark',
      'Splash of warm oat milk or coconut milk',
    ],
    instructions: [
      'Steep rooibos and chamomile together in boiling water for 6–8 minutes.',
      'Add a splash of creamy warm plant milk for a velvety nightcap.',
    ],
    healingProperties:
      'Naturally caffeine-free and mineral dense, rooibos calms cortisol spikes while chamomile boosts GABA receptors to reduce premenstrual tearfulness.',
    bestTime: '1 hour before sleep to unwind your mind.',
    image: '/assets/aistudio/Purple_sunset______ai_295e6a01.jpg',
  },
];

export const GLOW_MASKS: GlowMaskRecipe[] = [
  {
    id: 'coffee-honey',
    name: 'Coffee & Raw Honey Goddess Polish',
    subtitle: 'Caffeine Glow & Plumping Hydration',
    phase: 'follicular',
    prepTimeMinutes: 5,
    ingredients: [
      '1 tablespoon finely ground fresh coffee',
      '1 tablespoon raw unpasteurized honey',
      'Optional: 1/2 teaspoon cold-pressed sweet almond or jojoba oil',
    ],
    instructions: [
      'Mix coffee grounds and honey in a small glass dish until it forms a glossy paste.',
      'Gently massage onto clean, damp face and neck in soft circular upward strokes.',
      'Leave on for 10 to 15 minutes while taking 5 deep belly breaths.',
      'Rinse thoroughly with lukewarm water and press skin with a soft cloth.',
    ],
    skinBenefits:
      'Coffee stimulates microcirculation to depuff sleepy eyes and impart immediate radiance, while raw honey is a natural humectant that draws moisture deep into the skin.',
    image: '/assets/aistudio/312648399156378803_94ce392c.jpg',
  },
  {
    id: 'tomato-sugar',
    name: 'Tomato & Fine Cane Sugar Radiance Scrub',
    subtitle: 'Natural Fruit Enzyme Brightener & Pore Refining',
    phase: 'luteal',
    prepTimeMinutes: 3,
    ingredients: [
      '1 slice of fresh ripe organic tomato',
      '1 teaspoon fine brown or cane sugar',
      'A few drops of fresh lemon or rosewater',
    ],
    instructions: [
      'Dip the juicy surface of the sliced tomato directly into the fine sugar.',
      'Gently glide the tomato across your cheeks, forehead, and chin in gentle circles.',
      'Allow the natural lycopene and fruit acids to sit on your skin for 5–8 minutes.',
      'Rinse clean with cool water and moisturize with pure shea butter or nourishing oil.',
    ],
    skinBenefits:
      'Tomatoes are packed with lycopene and natural AHA enzymes that gently exfoliate dead skin cells caused by hormonal shifts, revealing silky smooth, glowing skin.',
    image: '/assets/aistudio/Divine_Feminine_Energy_-_how_to_unlock_your_feminine_energy_0ac9865d.jpg',
  },
];

export const GODDESS_AFFIRMATIONS: Affirmation[] = [
  {
    id: '1',
    phase: 'luteal',
    quote: 'My sensitivity is not a flaw; it is my sacred inner compass speaking truth.',
    author: 'Attuned Sanctuary',
    focus: 'PMDD Compassion',
  },
  {
    id: '2',
    phase: 'menstrual',
    quote: 'I surrender to my body’s wisdom. Rest is my birthright, not a reward I must earn.',
    author: 'Divine Feminine',
    focus: 'Radical Rest',
  },
  {
    id: '3',
    phase: 'ovulatory',
    quote: 'I radiate grace, beauty, and confidence. The world is blessed by my sovereign presence.',
    author: 'Glow Muse',
    focus: 'Sovereign Magnetism',
  },
  {
    id: '4',
    phase: 'follicular',
    quote: 'New energy sprouts within me. I am curious, capable, and divinely inspired.',
    author: 'Ancestral Rhythms',
    focus: 'Joyful Momentum',
  },
  {
    id: '5',
    phase: 'all',
    quote: 'I am rooted like an ancient baobab and fluid like the ocean tides. My body is holy.',
    author: 'Queen Esther',
    focus: 'Body Attunement',
  },
  {
    id: '6',
    phase: 'luteal',
    quote: 'When the waves of depression rise, I do not fight them. I hold myself in gentle compassion.',
    author: 'Sacred Sanctuary',
    focus: 'PMDD Loving-Kindness',
  },
  {
    id: '7',
    phase: 'all',
    quote: 'I honor my fluid motion, my elegant posture, and the divine light glowing through my skin.',
    author: 'Divine Feminine Energy',
    focus: 'Radiant Grace',
  },
];

export const INITIAL_EVENTS: FutureEvent[] = [
  {
    id: 'ev-1',
    title: 'Sunset Beach Walk & Journaling',
    date: '2026-10-24',
    category: 'retreat',
    notes: 'Golden hour walk, barefoot grounding, sip warm tea in thermos.',
  },
  {
    id: 'ev-2',
    title: 'Dinner Party with Friends',
    date: '2026-10-30',
    category: 'social',
    notes: 'Wear comfortable flowing dress, pace social battery.',
  },
  {
    id: 'ev-3',
    title: 'Creative Project Presentation',
    date: '2026-11-06',
    category: 'career',
    notes: 'Bring bold gold jewelry and grounded poise.',
  },
];
