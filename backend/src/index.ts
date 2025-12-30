import app from './app';
import config from './config/env';
import prisma from './config/database';
import SkillService from './services/skill.service';
import WeaponService from './services/weapon.service';
import PetService from './services/pet.service';

async function main() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('Database connected successfully');
    
    // Seed default data
    console.log('Seeding default skills, weapons, and pets...');
    await SkillService.seedSkills();
    await WeaponService.seedWeapons();
    await PetService.seedPets();
    
    // Start server
    app.listen(config.port, () => {
      console.log(`
========================================
  LaBrute API Server
========================================
  Environment: ${config.nodeEnv}
  Port: ${config.port}
  API URL: ${config.api.url}
  Frontend URL: ${config.cors.frontendUrl}
========================================
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

main();

