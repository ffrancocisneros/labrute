import prisma from '../config/database';
import { Skill } from '@prisma/client';

// Skill definitions from original game
export const SKILL_DEFINITIONS = [
  {
    alias: 'armor',
    nameEn: 'Armor',
    nameEs: 'Armadura',
    nameFr: 'Armure',
    description: 'Increases armor stat by 5, but decreases speed.',
    effectType: 'passive',
    armorMod: 5,
    speedMod: -1,
  },
  {
    alias: 'firstStrike',
    nameEn: 'First Strike',
    nameEs: 'Primer Golpe',
    nameFr: 'Premier Coup',
    description: 'Always attack first in combat.',
    effectType: 'passive',
    initiativeMod: 100,
  },
  {
    alias: 'immortality',
    nameEn: 'Immortality',
    nameEs: 'Inmortalidad',
    nameFr: 'Immortalité',
    description: 'Endurance +250%, but all other stats -25%.',
    effectType: 'passive',
    enduranceMod: 250,
    strengthMod: -25,
    agilityMod: -25,
    speedMod: -25,
  },
  {
    alias: 'resistant',
    nameEn: 'Resistant',
    nameEs: 'Resistente',
    nameFr: 'Increvable',
    description: 'Maximum -20% HP per received hit.',
    effectType: 'passive',
  },
  {
    alias: 'toughenedSkin',
    nameEn: 'Toughened Skin',
    nameEs: 'Piel Dura',
    nameFr: 'Peau Dure',
    description: 'Increases armor stat by 2.',
    effectType: 'passive',
    armorMod: 2,
  },
  {
    alias: 'vitality',
    nameEn: 'Vitality',
    nameEs: 'Vitalidad',
    nameFr: 'Vitalité',
    description: 'Increases health by 20%.',
    effectType: 'passive',
    healthMod: 20,
  },
  {
    alias: 'herculeanStrength',
    nameEn: 'Herculean Strength',
    nameEs: 'Fuerza Hercúlea',
    nameFr: 'Force Herculéenne',
    description: 'Greatly increases strength.',
    effectType: 'passive',
    strengthMod: 3,
  },
  {
    alias: 'felineAgility',
    nameEn: 'Feline Agility',
    nameEs: 'Agilidad Felina',
    nameFr: 'Agilité Féline',
    description: 'Greatly increases agility and evasion.',
    effectType: 'passive',
    agilityMod: 3,
  },
  {
    alias: 'lightningBolt',
    nameEn: 'Lightning Bolt',
    nameEs: 'Rayo',
    nameFr: 'Éclair',
    description: 'Greatly increases speed.',
    effectType: 'passive',
    speedMod: 3,
  },
  {
    alias: 'weaponsMaster',
    nameEn: 'Weapons Master',
    nameEs: 'Maestro de Armas',
    nameFr: 'Maître d\'Armes',
    description: '+50% damage with sharp weapons.',
    effectType: 'passive',
  },
  {
    alias: 'martialArts',
    nameEn: 'Martial Arts',
    nameEs: 'Artes Marciales',
    nameFr: 'Arts Martiaux',
    description: 'x2 damage with bare hands.',
    effectType: 'passive',
  },
  {
    alias: 'shield',
    nameEn: 'Shield',
    nameEs: 'Escudo',
    nameFr: 'Bouclier',
    description: 'Increased block rate.',
    effectType: 'passive',
  },
  {
    alias: 'counterAttack',
    nameEn: 'Counter Attack',
    nameEs: 'Contraataque',
    nameFr: 'Contre-Attaque',
    description: 'Chance to counter after blocking or evading.',
    effectType: 'passive',
  },
  {
    alias: 'sixthSense',
    nameEn: 'Sixth Sense',
    nameEs: 'Sexto Sentido',
    nameFr: 'Sixième Sens',
    description: 'Increased evasion rate.',
    effectType: 'passive',
    agilityMod: 2,
  },
];

export class SkillService {
  /**
   * Get all skills
   */
  static async getAll(): Promise<Skill[]> {
    return prisma.skill.findMany({
      orderBy: { nameEn: 'asc' },
    });
  }
  
  /**
   * Get skill by ID
   */
  static async getById(id: number): Promise<Skill | null> {
    return prisma.skill.findUnique({
      where: { id },
    });
  }
  
  /**
   * Get skill by alias
   */
  static async getByAlias(alias: string): Promise<Skill | null> {
    return prisma.skill.findUnique({
      where: { alias },
    });
  }
  
  /**
   * Seed default skills into database
   */
  static async seedSkills() {
    for (const skill of SKILL_DEFINITIONS) {
      await prisma.skill.upsert({
        where: { alias: skill.alias },
        update: {
          nameEn: skill.nameEn,
          nameEs: skill.nameEs,
          nameFr: skill.nameFr,
          description: skill.description,
          effectType: skill.effectType,
          healthMod: skill.healthMod || 0,
          strengthMod: skill.strengthMod || 0,
          agilityMod: skill.agilityMod || 0,
          speedMod: skill.speedMod || 0,
          armorMod: skill.armorMod || 0,
          enduranceMod: skill.enduranceMod || 0,
          initiativeMod: skill.initiativeMod || 0,
        },
        create: {
          alias: skill.alias,
          nameEn: skill.nameEn,
          nameEs: skill.nameEs,
          nameFr: skill.nameFr,
          description: skill.description,
          effectType: skill.effectType,
          healthMod: skill.healthMod || 0,
          strengthMod: skill.strengthMod || 0,
          agilityMod: skill.agilityMod || 0,
          speedMod: skill.speedMod || 0,
          armorMod: skill.armorMod || 0,
          enduranceMod: skill.enduranceMod || 0,
          initiativeMod: skill.initiativeMod || 0,
        },
      });
    }
    
    console.log(`Seeded ${SKILL_DEFINITIONS.length} skills`);
  }
  
  /**
   * Get skills for a brute
   */
  static async getByBruteId(bruteId: number) {
    const bruteSkills = await prisma.bruteSkill.findMany({
      where: { bruteId },
      include: { skill: true },
    });
    
    return bruteSkills.map(bs => bs.skill);
  }
  
  /**
   * Add skill to brute
   */
  static async addToBrute(bruteId: number, skillId: number) {
    // Check if brute already has 3 skills
    const currentSkills = await prisma.bruteSkill.count({
      where: { bruteId },
    });
    
    if (currentSkills >= 3) {
      throw new Error('Brute already has maximum skills (3)');
    }
    
    // Check if brute already has this skill
    const existing = await prisma.bruteSkill.findUnique({
      where: {
        bruteId_skillId: { bruteId, skillId },
      },
    });
    
    if (existing) {
      throw new Error('Brute already has this skill');
    }
    
    return prisma.bruteSkill.create({
      data: { bruteId, skillId },
      include: { skill: true },
    });
  }
  
  /**
   * Remove skill from brute
   */
  static async removeFromBrute(bruteId: number, skillId: number) {
    return prisma.bruteSkill.delete({
      where: {
        bruteId_skillId: { bruteId, skillId },
      },
    });
  }
  
  /**
   * Calculate stat modifiers from skills
   */
  static calculateSkillModifiers(skills: Skill[]) {
    const modifiers = {
      health: 0,
      strength: 0,
      agility: 0,
      speed: 0,
      armor: 0,
      endurance: 0,
      initiative: 0,
    };
    
    for (const skill of skills) {
      modifiers.health += skill.healthMod;
      modifiers.strength += skill.strengthMod;
      modifiers.agility += skill.agilityMod;
      modifiers.speed += skill.speedMod;
      modifiers.armor += skill.armorMod;
      modifiers.endurance += skill.enduranceMod;
      modifiers.initiative += skill.initiativeMod;
    }
    
    return modifiers;
  }
}

export default SkillService;

