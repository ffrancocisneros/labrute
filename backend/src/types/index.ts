import { Request } from 'express';
import { User, Brute, Skill, Weapon, Pet, Fight } from '@prisma/client';

// Extended Request with user info
export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
  };
}

// Brute with all relations
export interface BruteWithRelations extends Brute {
  skills: {
    skill: Skill;
  }[];
  weapons: {
    weapon: Weapon;
  }[];
  pets: {
    pet: Pet;
  }[];
}

// Fight result from combat
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

// Single entry in fight log
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

// Brute appearance for rendering
export interface BruteAppearance {
  gender: string;
  bodyType: number;
  headType: number;
  hairType: number;
  hairColor: string;
  skinColor: string;
  clothingColor: string;
}

// Brute stats for calculations
export interface BruteStats {
  health: number;
  strength: number;
  agility: number;
  speed: number;
  armor: number;
  endurance: number;
  initiative: number;
}

// Create brute input
export interface CreateBruteInput {
  name: string;
  skillIds?: number[];
  appearance?: Partial<BruteAppearance>;
}

// Login input
export interface LoginInput {
  username: string;
  password: string;
}

// Register input
export interface RegisterInput {
  username: string;
  email?: string;
  password: string;
}

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

