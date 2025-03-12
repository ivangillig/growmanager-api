import Seed from '../models/Seed.js'

const seeds = [
  {
    genetic: 'Only CBD',
    seedBank: 'Eva seed',
    chemoType: '3',
    imageUrl: null,
    ratio: '1:1',
    dominance: 'Indica',
  },
  {
    genetic: 'Shark CBD',
    seedBank: 'Pyramid seeds',
    chemoType: '2',
    imageUrl: null,
    ratio: '2:1',
    dominance: 'Sativa',
  },
  {
    genetic: 'Recovery CBD',
    seedBank: 'Medical seeds',
    chemoType: '3',
    imageUrl: null,
    ratio: '1:2',
    dominance: 'Hybrid',
  },
  {
    genetic: 'Northen Light CBD',
    seedBank: 'Pyramid seeds',
    chemoType: '2',
    imageUrl: null,
    ratio: '1:1',
    dominance: 'Indica',
  },
]

export const seedSeeds = async () => {
  try {
    await Seed.deleteMany({})
    const createdSeeds = await Seed.create(seeds)
    console.log('Seeds seeded successfully:', createdSeeds.length)
    return createdSeeds
  } catch (error) {
    console.error('Error seeding seeds:', error)
    throw error
  }
}
