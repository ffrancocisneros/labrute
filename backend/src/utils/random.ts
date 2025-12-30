/**
 * Seeded random number generator
 * Port of the PHP Random class
 */
export class SeededRandom {
  private seed: number;
  
  constructor(seed?: number) {
    this.seed = seed ?? Math.floor(Math.random() * 2147483647);
  }
  
  /**
   * Get current seed
   */
  getSeed(): number {
    return this.seed;
  }
  
  /**
   * Set seed
   */
  setSeed(seed: number): void {
    this.seed = seed;
  }
  
  /**
   * Generate next random number (0 to 1)
   */
  next(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }
  
  /**
   * Generate random integer between min and max (inclusive)
   */
  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  
  /**
   * Generate random float between min and max
   */
  float(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }
  
  /**
   * Random boolean with probability
   */
  bool(probability: number = 0.5): boolean {
    return this.next() < probability;
  }
  
  /**
   * Pick random element from array
   */
  pick<T>(array: T[]): T {
    return array[this.int(0, array.length - 1)];
  }
  
  /**
   * Shuffle array (Fisher-Yates)
   */
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

/**
 * Non-seeded random utilities
 */
export const Random = {
  /**
   * Generate random integer between min and max (inclusive)
   */
  int(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  /**
   * Generate random float between min and max
   */
  float(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  },
  
  /**
   * Random boolean with probability
   */
  bool(probability: number = 0.5): boolean {
    return Math.random() < probability;
  },
  
  /**
   * Pick random element from array
   */
  pick<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  },
  
  /**
   * Generate random identifier
   */
  identifier(): number {
    return Math.floor(Math.random() * 999999999);
  },
  
  /**
   * Generate random hex color
   */
  color(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  },
  
  /**
   * Generate random seed
   */
  seed(): number {
    return Math.floor(Math.random() * 2147483647);
  },
};

export default Random;

