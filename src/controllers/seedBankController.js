import {
  getAllSeedBanksService,
  createSeedBankService,
} from '../services/seedBankService.js';
import {
  buildSuccessResponse,
  getBusinessErrorResponse,
  getServerErrorResponse,
} from '../utils/responseUtils.js';

export const getAllSeedBanks = async (req, res) => {
  try {
    const seedBanks = await getAllSeedBanksService();
    res.json(buildSuccessResponse({ seedBanks }));
  } catch (error) {
    res.status(500).json(getServerErrorResponse('Error fetching seed banks', error.message));
  }
};

export const createSeedBank = async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(422).json(getBusinessErrorResponse('All fields are required'));
  }

  try {
    const newSeedBank = await createSeedBankService({ name, email, phone });
    res.status(201).json(buildSuccessResponse({ seedBanks: newSeedBank }));
  } catch (error) {
    res.status(500).json(getServerErrorResponse('Error creating seed bank', error.message));
  }
};

