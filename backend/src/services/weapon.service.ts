import prisma from '../config/database';
import { Weapon } from '@prisma/client';

// Weapon definitions from original game (based on config/weapons.json)
export const WEAPON_DEFINITIONS = [
  {
    alias: 'bareHands',
    nameEn: 'Bare Hands',
    nameEs: 'Puñetazo',
    nameFr: 'Mains Nues',
    type: 'melee',
    damageMin: 0,
    damageMax: 2,
    sprite: 'bareHands',
  },
  {
    alias: 'knife',
    nameEn: 'Knife',
    nameEs: 'Cuchillo',
    nameFr: 'Couteau',
    type: 'fast',
    damageMin: 7,
    damageMax: 11,
    sprite: 'knife',
  },
  {
    alias: 'shuriken',
    nameEn: 'Shuriken',
    nameEs: 'Shuriken',
    nameFr: 'Shuriken',
    type: 'thrown',
    damageMin: 5,
    damageMax: 8,
    sprite: 'shuriken',
  },
  {
    alias: 'sword',
    nameEn: 'Sword',
    nameEs: 'Espada',
    nameFr: 'Épée',
    type: 'sharp',
    damageMin: 15,
    damageMax: 25,
    sprite: 'sword',
  },
  {
    alias: 'scimitar',
    nameEn: 'Scimitar',
    nameEs: 'Cimitarra',
    nameFr: 'Cimeterre',
    type: 'sharp',
    damageMin: 18,
    damageMax: 28,
    sprite: 'scimitar',
  },
  {
    alias: 'axe',
    nameEn: 'Axe',
    nameEs: 'Hacha',
    nameFr: 'Hache',
    type: 'heavy',
    damageMin: 25,
    damageMax: 40,
    sprite: 'axe',
  },
  {
    alias: 'hammer',
    nameEn: 'Hammer',
    nameEs: 'Martillo',
    nameFr: 'Marteau',
    type: 'heavy',
    damageMin: 30,
    damageMax: 50,
    sprite: 'hammer',
  },
  {
    alias: 'spear',
    nameEn: 'Spear',
    nameEs: 'Lanza',
    nameFr: 'Lance',
    type: 'long',
    damageMin: 12,
    damageMax: 20,
    sprite: 'spear',
  },
  {
    alias: 'mace',
    nameEn: 'Mace',
    nameEs: 'Maza',
    nameFr: 'Masse',
    type: 'heavy',
    damageMin: 20,
    damageMax: 35,
    sprite: 'mace',
  },
  {
    alias: 'dagger',
    nameEn: 'Dagger',
    nameEs: 'Daga',
    nameFr: 'Dague',
    type: 'fast',
    damageMin: 5,
    damageMax: 9,
    sprite: 'dagger',
  },
  {
    alias: 'whip',
    nameEn: 'Whip',
    nameEs: 'Látigo',
    nameFr: 'Fouet',
    type: 'long',
    damageMin: 8,
    damageMax: 15,
    sprite: 'whip',
  },
  {
    alias: 'nunchaku',
    nameEn: 'Nunchaku',
    nameEs: 'Nunchaku',
    nameFr: 'Nunchaku',
    type: 'fast',
    damageMin: 10,
    damageMax: 18,
    sprite: 'nunchaku',
  },
  {
    alias: 'trident',
    nameEn: 'Trident',
    nameEs: 'Tridente',
    nameFr: 'Trident',
    type: 'long',
    damageMin: 18,
    damageMax: 30,
    sprite: 'trident',
  },
  {
    alias: 'hatchet',
    nameEn: 'Hatchet',
    nameEs: 'Hacha de mano',
    nameFr: 'Hachette',
    type: 'thrown',
    damageMin: 12,
    damageMax: 20,
    sprite: 'hatchet',
  },
  {
    alias: 'flail',
    nameEn: 'Flail',
    nameEs: 'Mangual',
    nameFr: 'Fléau',
    type: 'heavy',
    damageMin: 22,
    damageMax: 38,
    sprite: 'flail',
  },
];

export class WeaponService {
  /**
   * Get all weapons
   */
  static async getAll(): Promise<Weapon[]> {
    return prisma.weapon.findMany({
      orderBy: { nameEn: 'asc' },
    });
  }
  
  /**
   * Get weapon by ID
   */
  static async getById(id: number): Promise<Weapon | null> {
    return prisma.weapon.findUnique({
      where: { id },
    });
  }
  
  /**
   * Get weapon by alias
   */
  static async getByAlias(alias: string): Promise<Weapon | null> {
    return prisma.weapon.findUnique({
      where: { alias },
    });
  }
  
  /**
   * Get weapons by type
   */
  static async getByType(type: string): Promise<Weapon[]> {
    return prisma.weapon.findMany({
      where: { type },
      orderBy: { damageMax: 'desc' },
    });
  }
  
  /**
   * Seed default weapons into database
   */
  static async seedWeapons() {
    for (const weapon of WEAPON_DEFINITIONS) {
      await prisma.weapon.upsert({
        where: { alias: weapon.alias },
        update: {
          nameEn: weapon.nameEn,
          nameEs: weapon.nameEs,
          nameFr: weapon.nameFr,
          type: weapon.type,
          damageMin: weapon.damageMin,
          damageMax: weapon.damageMax,
          sprite: weapon.sprite,
        },
        create: {
          alias: weapon.alias,
          nameEn: weapon.nameEn,
          nameEs: weapon.nameEs,
          nameFr: weapon.nameFr,
          type: weapon.type,
          damageMin: weapon.damageMin,
          damageMax: weapon.damageMax,
          sprite: weapon.sprite,
        },
      });
    }
    
    console.log(`Seeded ${WEAPON_DEFINITIONS.length} weapons`);
  }
  
  /**
   * Get weapons for a brute
   */
  static async getByBruteId(bruteId: number) {
    const bruteWeapons = await prisma.bruteWeapon.findMany({
      where: { bruteId },
      include: { weapon: true },
    });
    
    return bruteWeapons.map(bw => bw.weapon);
  }
  
  /**
   * Add weapon to brute
   */
  static async addToBrute(bruteId: number, weaponId: number) {
    // Check if brute already has this weapon
    const existing = await prisma.bruteWeapon.findUnique({
      where: {
        bruteId_weaponId: { bruteId, weaponId },
      },
    });
    
    if (existing) {
      throw new Error('Brute already has this weapon');
    }
    
    return prisma.bruteWeapon.create({
      data: { bruteId, weaponId },
      include: { weapon: true },
    });
  }
  
  /**
   * Remove weapon from brute
   */
  static async removeFromBrute(bruteId: number, weaponId: number) {
    return prisma.bruteWeapon.delete({
      where: {
        bruteId_weaponId: { bruteId, weaponId },
      },
    });
  }
  
  /**
   * Get random weapon for level up reward
   */
  static async getRandomWeapon(): Promise<Weapon | null> {
    const weapons = await prisma.weapon.findMany();
    if (weapons.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * weapons.length);
    return weapons[randomIndex];
  }
  
  /**
   * Calculate average damage for a weapon
   */
  static calculateAverageDamage(weapon: Weapon): number {
    return Math.floor((weapon.damageMin + weapon.damageMax) / 2);
  }
}

export default WeaponService;

