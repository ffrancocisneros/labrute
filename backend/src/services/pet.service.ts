import prisma from '../config/database';
import { Pet } from '@prisma/client';

// Pet definitions from original game
export const PET_DEFINITIONS = [
  {
    alias: 'dog',
    nameEn: 'Dog',
    nameEs: 'Perro',
    nameFr: 'Chien',
    description: 'A loyal dog that fights alongside you.',
    healthMod: 0,
    damageMod: 10,
    sprite: 'dog',
  },
  {
    alias: 'wolf',
    nameEn: 'Wolf',
    nameEs: 'Lobo',
    nameFr: 'Loup',
    description: 'A fierce wolf that deals significant damage.',
    healthMod: -5,
    damageMod: 20,
    sprite: 'wolf',
  },
  {
    alias: 'bear',
    nameEn: 'Bear',
    nameEs: 'Oso',
    nameFr: 'Ours',
    description: 'A powerful bear that can take and deal heavy damage.',
    healthMod: 20,
    damageMod: 30,
    sprite: 'bear',
  },
  {
    alias: 'panther',
    nameEn: 'Panther',
    nameEs: 'Pantera',
    nameFr: 'Panthère',
    description: 'A swift panther that strikes quickly.',
    healthMod: -10,
    damageMod: 25,
    sprite: 'panther',
  },
];

export class PetService {
  /**
   * Get all pets
   */
  static async getAll(): Promise<Pet[]> {
    return prisma.pet.findMany({
      orderBy: { nameEn: 'asc' },
    });
  }
  
  /**
   * Get pet by ID
   */
  static async getById(id: number): Promise<Pet | null> {
    return prisma.pet.findUnique({
      where: { id },
    });
  }
  
  /**
   * Get pet by alias
   */
  static async getByAlias(alias: string): Promise<Pet | null> {
    return prisma.pet.findUnique({
      where: { alias },
    });
  }
  
  /**
   * Seed default pets into database
   */
  static async seedPets() {
    for (const pet of PET_DEFINITIONS) {
      await prisma.pet.upsert({
        where: { alias: pet.alias },
        update: {
          nameEn: pet.nameEn,
          nameEs: pet.nameEs,
          nameFr: pet.nameFr,
          description: pet.description,
          healthMod: pet.healthMod,
          damageMod: pet.damageMod,
          sprite: pet.sprite,
        },
        create: {
          alias: pet.alias,
          nameEn: pet.nameEn,
          nameEs: pet.nameEs,
          nameFr: pet.nameFr,
          description: pet.description,
          healthMod: pet.healthMod,
          damageMod: pet.damageMod,
          sprite: pet.sprite,
        },
      });
    }
    
    console.log(`Seeded ${PET_DEFINITIONS.length} pets`);
  }
  
  /**
   * Get pets for a brute
   */
  static async getByBruteId(bruteId: number) {
    const brutePets = await prisma.brutePet.findMany({
      where: { bruteId },
      include: { pet: true },
    });
    
    return brutePets.map(bp => bp.pet);
  }
  
  /**
   * Add pet to brute
   */
  static async addToBrute(bruteId: number, petId: number) {
    // Check if brute already has this pet
    const existing = await prisma.brutePet.findUnique({
      where: {
        bruteId_petId: { bruteId, petId },
      },
    });
    
    if (existing) {
      throw new Error('Brute already has this pet');
    }
    
    return prisma.brutePet.create({
      data: { bruteId, petId },
      include: { pet: true },
    });
  }
  
  /**
   * Remove pet from brute
   */
  static async removeFromBrute(bruteId: number, petId: number) {
    return prisma.brutePet.delete({
      where: {
        bruteId_petId: { bruteId, petId },
      },
    });
  }
  
  /**
   * Get random pet for level up reward
   */
  static async getRandomPet(): Promise<Pet | null> {
    const pets = await prisma.pet.findMany();
    if (pets.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * pets.length);
    return pets[randomIndex];
  }
}

export default PetService;

