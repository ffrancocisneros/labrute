// User types
export interface User {
  id: number;
  username: string;
  email?: string;
  createdAt: string;
  lastLogin?: string;
}

// Skill types
export interface Skill {
  id: number;
  alias: string;
  nameEn: string;
  nameEs?: string;
  nameFr?: string;
  description?: string;
  effectType?: string;
  healthMod: number;
  strengthMod: number;
  agilityMod: number;
  speedMod: number;
  armorMod: number;
  enduranceMod: number;
  initiativeMod: number;
}

// Weapon types
export interface Weapon {
  id: number;
  alias: string;
  nameEn: string;
  nameEs?: string;
  nameFr?: string;
  type: string;
  damageMin: number;
  damageMax: number;
  sprite?: string;
}

// Pet types
export interface Pet {
  id: number;
  alias: string;
  nameEn: string;
  nameEs?: string;
  nameFr?: string;
  description?: string;
  healthMod: number;
  damageMod: number;
  sprite?: string;
}

// Brute appearance
export interface BruteAppearance {
  gender: string;
  bodyType: number;
  headType: number;
  hairType: number;
  hairColor: string;
  skinColor: string;
  clothingColor: string;
}

// Brute types
export interface Brute {
  id: number;
  userId: number;
  name: string;
  identifier: string;
  experience: number;
  level: number;
  health: number;
  strength: number;
  agility: number;
  speed: number;
  armor: number;
  endurance: number;
  initiative: number;
  maxReceivableDamages: number;
  wins: number;
  losses: number;
  fightsToday: number;
  gender: string;
  bodyType: number;
  headType: number;
  hairType: number;
  hairColor: string;
  skinColor: string;
  clothingColor: string;
  createdAt: string;
  updatedAt: string;
  skills?: { skill: Skill }[];
  weapons?: { weapon: Weapon }[];
  pets?: { pet: Pet }[];
  user?: { id: number; username: string };
}

// Fight log entry
export interface FightLogEntry {
  turn: number;
  attackerId: number;
  defenderId: number;
  action: 'attack' | 'skill' | 'block' | 'evade' | 'counter' | 'miss';
  weaponUsed?: string;
  skillUsed?: string;
  damage: number;
  attackerHealthAfter: number;
  defenderHealthAfter: number;
  message: string;
  effects?: string[];
}

// Fight result
export interface FightResult {
  winner: 'attacker' | 'defender';
  winnerId: number;
  loserId: number;
  log: FightLogEntry[];
  attackerFinalHealth: number;
  defenderFinalHealth: number;
  attackerInitialHealth: number;
  defenderInitialHealth: number;
  durationHits: number;
  winnerExpGained: number;
  loserExpGained: number;
}

// Fight record
export interface Fight {
  id: number;
  attackerId: number;
  defenderId: number;
  winnerId?: number;
  fightLog: FightLogEntry[];
  fightSeed: string;
  durationHits: number;
  winnerExpGained: number;
  loserExpGained: number;
  createdAt: string;
  attacker?: Brute;
  defender?: Brute;
}

// API response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth context types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Create brute input
export interface CreateBruteInput {
  name: string;
  skillIds?: number[];
  appearance?: Partial<BruteAppearance>;
}

// Login/Register inputs
export interface LoginInput {
  username: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  email?: string;
  password: string;
}

