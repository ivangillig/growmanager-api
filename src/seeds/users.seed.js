import mongoose from 'mongoose';
import User from '../models/User.js';

const users = [
  {
    email: 'guillermo@greentrack.com',
    password: 'guillermo',
    username: 'guillermo',
    user_type: 'grower'
  }
];

export const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    
    // Insert new users
    const createdUsers = await User.create(users);
    console.log('Users seeded successfully:', createdUsers.length);
    
    return createdUsers;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};
