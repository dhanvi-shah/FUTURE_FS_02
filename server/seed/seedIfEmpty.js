import { seedDatabase } from './seedData.js';

export const seedIfEmpty = async () => {
  const result = await seedDatabase();

  if (result.seeded) {
    console.log(`Seeded admin (${result.admin}) and ${result.leadCount} leads`);
  }

  return result;
};
