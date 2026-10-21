export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

export interface CycleConfig {
  lastPeriodDate: string; // YYYY-MM-DD
  cycleLength: number; // e.g. 28
  periodDuration: number; // e.g. 5
  userName: string;
  userAvatar: string;
  dailyReminderTime: string; // e.g. "17:30"
  enableReminders: boolean;
}

export interface PhaseDetails {
  phase: CyclePhase;
  name: string;
  season: string;
  element: string;
  colorName: string;
  accentBg: string;
  accentBorder: string;
  glowColor: string;
  tagline: string;
  energyLevel: string;
  hormones: string;
  description: string;
  goddessArchetype: string;
  heroImage: string;
  selfCareFocus: string;
}

export interface CalculatedCycle {
  currentCycleDay: number;
  totalCycleDays: number;
  phase: CyclePhase;
  phaseDetails: PhaseDetails;
  dayInPhase: number;
  phaseDuration: number;
  daysUntilNextPeriod: number;
  nextPeriodDate: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  ovulationDate: string;
  progressPercent: number;
}

export interface MoodCheckin {
  id: string;
  date: string;
  cycleDay: number;
  phase: CyclePhase;
  moods: string[];
  physicalSensations: string[];
  energyScore: number; // 1 to 5
  note?: string;
  pmddAlert?: boolean;
}

export interface FutureEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: 'social' | 'career' | 'retreat' | 'date' | 'travel';
  notes?: string;
}

export interface StretchExercise {
  id: string;
  name: string;
  sanskrit: string;
  phase: CyclePhase | 'all';
  target: string;
  durationSeconds: number;
  instructions: string[];
  goddessWisdom: string;
  iconType: 'butterfly' | 'pigeon' | 'child' | 'goddess' | 'lunge' | 'catcow';
}

export interface HerbalTeaRecipe {
  id: string;
  name: string;
  subtitle: string;
  phase: CyclePhase | 'all';
  ingredients: string[];
  instructions: string[];
  healingProperties: string;
  bestTime: string;
  image: string;
}

export interface GlowMaskRecipe {
  id: string;
  name: string;
  subtitle: string;
  phase: CyclePhase | 'all';
  prepTimeMinutes: number;
  ingredients: string[];
  instructions: string[];
  skinBenefits: string;
  image: string;
}

export interface Affirmation {
  id: string;
  phase: CyclePhase | 'all';
  quote: string;
  author: string;
  focus: string;
}
