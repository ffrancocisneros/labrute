import prisma from '../config/database';
import { Random } from '../utils/random';
import { CreateBruteInput, BruteStats, BruteAppearance } from '../types';
import { Brute, Skill } from '@prisma/client';

// Constants from original game
const LEVEL_EXPONENT = 2.3;
const BASE_HEALTH = 50;
const HEALTH_PER_LEVEL = 1.5;

export class BruteService {
  /**
   * Create a new brute
   */
  static async create(userId: number, input: CreateBruteInput) {
    const { name, skillIds, appearance } = input;
    
    // Check if user already has a brute with this name
    const existing = await prisma.brute.findFirst({
      where: { userId, name },
    });
    
    if (existing) {
      throw new Error('You already have a brute with this name');
    }
    
    // Generate random identifier (as regular number for JSON compatibility)
    const identifier = Math.floor(Math.random() * 999999999);
    
    // Calculate initial stats
    const stats = this.calculateBaseStats(skillIds || []);
    
    // Generate random appearance if not provided
    const finalAppearance = {
      gender: appearance?.gender || Random.pick(['male', 'female']),
      bodyType: appearance?.bodyType ?? Random.int(0, 5),
      headType: appearance?.headType ?? Random.int(0, 5),
      hairType: appearance?.hairType ?? Random.int(0, 15),
      hairColor: appearance?.hairColor || Random.color(),
      skinColor: appearance?.skinColor || this.getRandomSkinColor(),
      clothingColor: appearance?.clothingColor || Random.color(),
    };
    
    // Create brute
    const brute = await prisma.brute.create({
      data: {
        userId,
        name,
        identifier,
        ...stats,
        ...finalAppearance,
        skills: skillIds?.length ? {
          create: skillIds.map(skillId => ({ skillId })),
        } : undefined,
      },
      include: {
        skills: { include: { skill: true } },
        weapons: { include: { weapon: true } },
        pets: { include: { pet: true } },
      },
    });
    
    return brute;
  }
  
  /**
   * Get brute by ID
   */
  static async getById(id: number) {
    return prisma.brute.findUnique({
      where: { id },
      include: {
        skills: { include: { skill: true } },
        weapons: { include: { weapon: true } },
        pets: { include: { pet: true } },
        user: { select: { id: true, username: true } },
      },
    });
  }
  
  /**
   * Get brute by name
   */
  static async getByName(name: string) {
    return prisma.brute.findFirst({
      where: { name },
      include: {
        skills: { include: { skill: true } },
        weapons: { include: { weapon: true } },
        pets: { include: { pet: true } },
        user: { select: { id: true, username: true } },
      },
    });
  }
  
  /**
   * Get all brutes for a user
   */
  static async getByUserId(userId: number) {
    return prisma.brute.findMany({
      where: { userId },
      include: {
        skills: { include: { skill: true } },
        weapons: { include: { weapon: true } },
        pets: { include: { pet: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
  
  /**
   * Get opponents for a brute (brutes of similar level)
   */
  static async getOpponents(bruteId: number, limit: number = 5) {
    const brute = await prisma.brute.findUnique({
      where: { id: bruteId },
    });
    
    if (!brute) {
      throw new Error('Brute not found');
    }
    
    // Find brutes within 2 levels
    const minLevel = Math.max(1, brute.level - 2);
    const maxLevel = brute.level + 2;
    
    return prisma.brute.findMany({
      where: {
        id: { not: bruteId },
        level: { gte: minLevel, lte: maxLevel },
      },
      include: {
        skills: { include: { skill: true } },
        user: { select: { id: true, username: true } },
      },
      take: limit,
      orderBy: { level: 'asc' },
    });
  }
  
  /**
   * Calculate base stats for a new brute
   */
  static calculateBaseStats(skillIds: number[]): BruteStats {
    const stats: BruteStats = {
      health: BASE_HEALTH,
      strength: 2,
      agility: 2,
      speed: 2,
      armor: 2,
      endurance: 3,
      initiative: 0,
    };
    
    // Note: Skill effects would be applied here
    // For now, return base stats
    
    return stats;
  }
  
  /**
   * Calculate health based on level and endurance
   */
  static calculateHealth(level: number, endurance: number): number {
    // Standard HP: (level - 1) * 1.5 + 50
    const standardHp = Math.floor((level - 1) * HEALTH_PER_LEVEL + BASE_HEALTH);
    
    // Complementary HP: endurance / 6
    const complementaryHp = Math.floor(endurance / 6);
    
    return standardHp + complementaryHp;
  }
  
  /**
   * Calculate experience needed for next level
   */
  static experienceForLevel(level: number): number {
    return Math.floor(Math.pow(level, LEVEL_EXPONENT) * 10);
  }
  
  /**
   * Check if brute can level up
   */
  static canLevelUp(brute: Brute): boolean {
    return brute.experience >= this.experienceForLevel(brute.level + 1);
  }
  
  /**
   * Level up a brute
   */
  static async levelUp(bruteId: number, statChoice?: keyof BruteStats) {
    const brute = await prisma.brute.findUnique({
      where: { id: bruteId },
    });
    
    if (!brute) {
      throw new Error('Brute not found');
    }
    
    if (!this.canLevelUp(brute)) {
      throw new Error('Not enough experience to level up');
    }
    
    const newLevel = brute.level + 1;
    const newHealth = this.calculateHealth(newLevel, brute.endurance);
    
    // Apply stat choice (+3 to one stat or +2/+1 to two)
    const statUpdate: Partial<BruteStats> = {};
    if (statChoice) {
      statUpdate[statChoice] = brute[statChoice] + 3;
    }
    
    return prisma.brute.update({
      where: { id: bruteId },
      data: {
        level: newLevel,
        health: newHealth,
        ...statUpdate,
      },
      include: {
        skills: { include: { skill: true } },
        weapons: { include: { weapon: true } },
        pets: { include: { pet: true } },
      },
    });
  }
  
  /**
   * Add experience to a brute
   */
  static async addExperience(bruteId: number, amount: number) {
    return prisma.brute.update({
      where: { id: bruteId },
      data: {
        experience: { increment: amount },
      },
    });
  }
  
  /**
   * Update win/loss record
   */
  static async updateRecord(bruteId: number, won: boolean) {
    return prisma.brute.update({
      where: { id: bruteId },
      data: won
        ? { wins: { increment: 1 } }
        : { losses: { increment: 1 } },
    });
  }
  
  /**
   * Get random skin color
   */
  private static getRandomSkinColor(): string {
    const skinColors = [
      '#FFDFC4', '#F0D5BE', '#EECEB3', '#E1B899',
      '#E5C298', '#FFDCB2', '#E5B887', '#E5A073',
      '#C68642', '#8D5524', '#6E4B3A', '#4A2912',
    ];
    return Random.pick(skinColors);
  }
  
  /**
   * Delete a brute
   */
  static async delete(bruteId: number, userId: number) {
    const brute = await prisma.brute.findFirst({
      where: { id: bruteId, userId },
    });
    
    if (!brute) {
      throw new Error('Brute not found or not owned by user');
    }
    
    await prisma.brute.delete({ where: { id: bruteId } });
  }
  
  /**
   * Get all available skills
   */
  static async getAvailableSkills() {
    return prisma.skill.findMany({
      orderBy: { nameEn: 'asc' },
    });
  }
  
  /**
   * Get leaderboard
   */
  static async getLeaderboard(limit: number = 10) {
    return prisma.brute.findMany({
      orderBy: [
        { wins: 'desc' },
        { level: 'desc' },
      ],
      take: limit,
      include: {
        user: { select: { username: true } },
        skills: { include: { skill: true } },
      },
    });
  }
}

export default BruteService;

