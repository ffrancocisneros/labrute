import prisma from '../config/database';
import { SeededRandom, Random } from '../utils/random';
import { FightResult, FightLogEntry } from '../types';
import { Brute, Skill, Weapon } from '@prisma/client';
import BruteService from './brute.service';

// Type for brute with skills and weapons
interface FighterBrute extends Brute {
  skills: { skill: Skill }[];
  weapons: { weapon: Weapon }[];
}

// Fighter state during combat
interface Fighter {
  brute: FighterBrute;
  currentHealth: number;
  maxHealth: number;
  isAttacker: boolean;
}

export class FightService {
  private random: SeededRandom;
  private log: FightLogEntry[];
  private turn: number;
  
  constructor(seed?: number) {
    this.random = new SeededRandom(seed);
    this.log = [];
    this.turn = 0;
  }
  
  /**
   * Execute a fight between two brutes
   */
  static async fight(attackerId: number, defenderId: number): Promise<{
    fight: Awaited<ReturnType<typeof prisma.fight.create>>;
    result: FightResult;
  }> {
    // Get both brutes with their skills and weapons
    const attacker = await prisma.brute.findUnique({
      where: { id: attackerId },
      include: {
        skills: { include: { skill: true } },
        weapons: { include: { weapon: true } },
      },
    });
    
    const defender = await prisma.brute.findUnique({
      where: { id: defenderId },
      include: {
        skills: { include: { skill: true } },
        weapons: { include: { weapon: true } },
      },
    });
    
    if (!attacker || !defender) {
      throw new Error('One or both brutes not found');
    }
    
    if (attacker.id === defender.id) {
      throw new Error('A brute cannot fight itself');
    }
    
    // Generate fight seed
    const seed = Number(Random.seed());
    
    // Execute fight
    const service = new FightService(seed);
    const result = service.executeFight(
      attacker as FighterBrute,
      defender as FighterBrute
    );
    
    // Calculate experience gained
    const winnerExpGained = service.calculateExpGain(result.winner === 'attacker' ? attacker : defender, true);
    const loserExpGained = service.calculateExpGain(result.winner === 'attacker' ? defender : attacker, false);
    
    result.winnerExpGained = winnerExpGained;
    result.loserExpGained = loserExpGained;
    
    // Save fight to database
    const fight = await prisma.fight.create({
      data: {
        attackerId,
        defenderId,
        winnerId: result.winnerId,
        fightLog: result.log as any,
        fightSeed: seed,
        durationHits: result.durationHits,
        winnerExpGained,
        loserExpGained,
      },
      include: {
        attacker: true,
        defender: true,
      },
    });
    
    // Update brute records and experience
    await BruteService.updateRecord(result.winnerId, true);
    await BruteService.updateRecord(result.loserId, false);
    await BruteService.addExperience(result.winnerId, winnerExpGained);
    await BruteService.addExperience(result.loserId, loserExpGained);
    
    return { fight, result };
  }
  
  /**
   * Execute the actual fight logic
   */
  private executeFight(attacker: FighterBrute, defender: FighterBrute): FightResult {
    // Create fighter states
    const fighter1: Fighter = {
      brute: attacker,
      currentHealth: attacker.health,
      maxHealth: attacker.health,
      isAttacker: true,
    };
    
    const fighter2: Fighter = {
      brute: defender,
      currentHealth: defender.health,
      maxHealth: defender.health,
      isAttacker: false,
    };
    
    // Determine who goes first based on initiative
    let [current, opponent] = this.determineInitiative(fighter1, fighter2);
    
    // Store initial health
    const attackerInitialHealth = fighter1.currentHealth;
    const defenderInitialHealth = fighter2.currentHealth;
    
    // Fight loop - max 100 turns to prevent infinite loops
    while (fighter1.currentHealth > 0 && fighter2.currentHealth > 0 && this.turn < 100) {
      this.turn++;
      
      // Execute attack
      this.executeAttack(current, opponent);
      
      // Check if opponent is defeated
      if (opponent.currentHealth <= 0) {
        break;
      }
      
      // Swap attacker and defender
      [current, opponent] = [opponent, current];
    }
    
    // Determine winner
    const winner = fighter1.currentHealth > 0 ? 'attacker' : 'defender';
    const winnerId = winner === 'attacker' ? attacker.id : defender.id;
    const loserId = winner === 'attacker' ? defender.id : attacker.id;
    
    return {
      winner,
      winnerId,
      loserId,
      log: this.log,
      attackerFinalHealth: Math.max(0, fighter1.currentHealth),
      defenderFinalHealth: Math.max(0, fighter2.currentHealth),
      attackerInitialHealth,
      defenderInitialHealth,
      durationHits: this.turn,
      winnerExpGained: 0, // Calculated later
      loserExpGained: 0,
    };
  }
  
  /**
   * Determine who attacks first based on initiative
   */
  private determineInitiative(fighter1: Fighter, fighter2: Fighter): [Fighter, Fighter] {
    const init1 = fighter1.brute.initiative + this.random.int(0, 10);
    const init2 = fighter2.brute.initiative + this.random.int(0, 10);
    
    // Check for First Strike skill
    const hasFirstStrike1 = fighter1.brute.skills.some(s => s.skill.alias === 'firstStrike');
    const hasFirstStrike2 = fighter2.brute.skills.some(s => s.skill.alias === 'firstStrike');
    
    if (hasFirstStrike1 && !hasFirstStrike2) {
      return [fighter1, fighter2];
    }
    if (hasFirstStrike2 && !hasFirstStrike1) {
      return [fighter2, fighter1];
    }
    
    return init1 >= init2 ? [fighter1, fighter2] : [fighter2, fighter1];
  }
  
  /**
   * Execute a single attack
   */
  private executeAttack(attacker: Fighter, defender: Fighter) {
    // Get weapon (or bare hands)
    const weapon = attacker.brute.weapons.length > 0
      ? this.random.pick(attacker.brute.weapons).weapon
      : null;
    
    // Calculate base damage
    let damage = this.calculateDamage(attacker, weapon);
    
    // Check for evasion
    if (this.checkEvasion(defender)) {
      this.addLogEntry(attacker, defender, 'evade', weapon, 0, 'Evade!');
      return;
    }
    
    // Check for block
    if (this.checkBlock(defender)) {
      damage = Math.floor(damage * 0.3); // Block reduces damage by 70%
      this.addLogEntry(attacker, defender, 'block', weapon, damage, 'Block!');
      defender.currentHealth -= damage;
      return;
    }
    
    // Apply armor reduction
    damage = this.applyArmor(damage, defender);
    
    // Check for Resistant skill (max 20% of health per hit)
    if (defender.brute.skills.some(s => s.skill.alias === 'resistant')) {
      const maxDamage = Math.floor(defender.maxHealth * 0.2);
      damage = Math.min(damage, maxDamage);
    }
    
    // Apply damage
    damage = Math.max(1, damage); // Minimum 1 damage
    defender.currentHealth -= damage;
    
    const weaponName = weapon?.nameEn || 'bare hands';
    this.addLogEntry(
      attacker,
      defender,
      'attack',
      weapon,
      damage,
      `${attacker.brute.name} attacks with ${weaponName} for ${damage} damage!`
    );
  }
  
  /**
   * Calculate damage based on attacker stats and weapon
   */
  private calculateDamage(attacker: Fighter, weapon: Weapon | null): number {
    // Base damage formula: (B + NK) * S * R
    // B = base damage, N = strength, K = damage per strength, S = skill multiplier, R = random 1.0-1.5
    
    const baseDamage = weapon ? weapon.damageMin : 0;
    const maxDamage = weapon ? weapon.damageMax : 2;
    const strength = attacker.brute.strength;
    
    // Random damage in range
    let damage = this.random.int(baseDamage, maxDamage);
    
    // Add strength bonus
    damage += Math.floor(strength * 0.5);
    
    // Random multiplier 1.0 - 1.5
    const randomMultiplier = this.random.float(1.0, 1.5);
    damage = Math.floor(damage * randomMultiplier);
    
    return damage;
  }
  
  /**
   * Check if defender evades the attack
   */
  private checkEvasion(defender: Fighter): boolean {
    const evasionChance = defender.brute.agility * 2; // 2% per agility
    return this.random.int(1, 100) <= evasionChance;
  }
  
  /**
   * Check if defender blocks the attack
   */
  private checkBlock(defender: Fighter): boolean {
    const blockChance = 5; // Base 5% block chance
    return this.random.int(1, 100) <= blockChance;
  }
  
  /**
   * Apply armor damage reduction
   */
  private applyArmor(damage: number, defender: Fighter): number {
    let armor = defender.brute.armor;
    
    // Check for Armor skill
    if (defender.brute.skills.some(s => s.skill.alias === 'armor')) {
      armor += 5;
    }
    
    // Check for Toughened Skin skill
    if (defender.brute.skills.some(s => s.skill.alias === 'toughenedSkin')) {
      armor += 2;
    }
    
    return Math.max(1, damage - armor);
  }
  
  /**
   * Add entry to fight log
   */
  private addLogEntry(
    attacker: Fighter,
    defender: Fighter,
    action: FightLogEntry['action'],
    weapon: Weapon | null,
    damage: number,
    message: string
  ) {
    this.log.push({
      turn: this.turn,
      attackerId: attacker.brute.id,
      defenderId: defender.brute.id,
      action,
      weaponUsed: weapon?.alias,
      damage,
      attackerHealthAfter: attacker.currentHealth,
      defenderHealthAfter: defender.currentHealth,
      message,
    });
  }
  
  /**
   * Calculate experience gained from fight
   */
  private calculateExpGain(brute: Brute, won: boolean): number {
    const baseExp = won ? 10 : 3;
    const levelBonus = Math.floor(brute.level * 0.5);
    return baseExp + levelBonus;
  }
  
  /**
   * Get fight by ID
   */
  static async getById(id: number) {
    return prisma.fight.findUnique({
      where: { id },
      include: {
        attacker: {
          include: {
            skills: { include: { skill: true } },
            user: { select: { username: true } },
          },
        },
        defender: {
          include: {
            skills: { include: { skill: true } },
            user: { select: { username: true } },
          },
        },
      },
    });
  }
  
  /**
   * Get fights for a brute
   */
  static async getByBruteId(bruteId: number, limit: number = 10) {
    return prisma.fight.findMany({
      where: {
        OR: [
          { attackerId: bruteId },
          { defenderId: bruteId },
        ],
      },
      include: {
        attacker: { select: { id: true, name: true } },
        defender: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
  
  /**
   * Get recent fights (global)
   */
  static async getRecentFights(limit: number = 10) {
    return prisma.fight.findMany({
      include: {
        attacker: {
          include: {
            user: { select: { username: true } },
          },
        },
        defender: {
          include: {
            user: { select: { username: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}

export default FightService;

