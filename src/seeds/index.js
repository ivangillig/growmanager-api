import mongoose from 'mongoose';
import { seedUsers } from './users.seed.js';

const runSeeds = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27018/growmanager', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Running seeds...');
    await seedUsers();
    
    console.log('All seeds completed successfully');
  } catch (error) {
    console.error('Error running seeds:', error);
  } finally {
    await mongoose.connection.close();
  }
};

runSeeds();
