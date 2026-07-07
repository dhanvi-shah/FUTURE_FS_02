import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { seedDatabase } from './seedData.js';

dotenv.config();

const seed = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/minicrm';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB for seeding...');

    const result = await seedDatabase({ force: true });
    console.log(`Admin created: ${result.admin}`);
    console.log(`Seeded ${result.leadCount} leads`);
    console.log('Database seeded successfully!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
