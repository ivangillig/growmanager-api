import SeedBank from '../models/SeedBank.js';
import { ERROR_SEED_NOT_FOUND } from '../constants/messages.js';

export const getAllSeedBanksService = async () => {
  return await SeedBank.find().select('_id name email phone');
};

export const createSeedBankService = async (seedBankData) => {
  const newSeedBank = new SeedBank(seedBankData);
  await newSeedBank.save();
  return newSeedBank;
};

export const updateSeedBankService = async (id, seedBankData) => {
  const seedBank = await SeedBank.findById(id);
  if (!seedBank) {
    throw new Error(ERROR_SEED_NOT_FOUND);
  }

  Object.assign(seedBank, seedBankData);
  await seedBank.save();
  return seedBank;
};

export const deleteSeedBankService = async (id) => {
  const seedBank = await SeedBank.findById(id);
  if (!seedBank) {
    throw new Error(ERROR_SEED_NOT_FOUND);
  }

  await seedBank.deleteOne();
  return seedBank;
};
