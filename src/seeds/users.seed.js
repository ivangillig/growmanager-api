import mongoose from 'mongoose'
import User from '../models/User.js'

const users = [
  {
    email: 'guillermo@growmanager.com',
    password: 'guillermo',
    username: 'guillermo',
    role: 'grower',
  },
]

export const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({})

    // Insert new users
    const createdUsers = await User.create(users)
    console.log('Users seeded successfully:', createdUsers.length)

    return createdUsers
  } catch (error) {
    console.error('Error seeding users:', error)
    throw error
  }
}
