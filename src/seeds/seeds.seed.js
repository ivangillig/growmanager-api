import Seed from "../models/Seed.js";

const seeds = [
  {
    genetic: "Only CBD",
    seedBank: "Eva seed",
    chemoType: "3",
    imageUrl: null,
  },
  {
    genetic: "Shark CBD",
    seedBank: "Pyramid seeds",
    chemoType: "2",
    imageUrl: null,
  },
  {
    genetic: "Recovery CBD",
    seedBank: "Medical seeds",
    chemoType: "3",
    imageUrl: null,
  },
  {
    genetic: "Northen Light CBD",
    seedBank: "Pyramid seeds",
    chemoType: "2",
    imageUrl: null,
  },
];

export const seedSeeds = async () => {
  try {
    await Seed.deleteMany({});
    const createdSeeds = await Seed.create(seeds);
    console.log("Seeds seeded successfully:", createdSeeds.length);
    return createdSeeds;
  } catch (error) {
    console.error("Error seeding seeds:", error);
    throw error;
  }
};
