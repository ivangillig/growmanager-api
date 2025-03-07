import Seed from "../models/Seed.js";
import { ERROR_FETCHING_SEEDS } from "../constants/messages.js";

export const getAllSeeds = async (req, res) => {
  
  console.log('paso por el login')
  try {
    const seeds = await Seed.find();
    res.json(seeds);
  } catch (error) {
    res.status(500).json({
      message: ERROR_FETCHING_SEEDS,
      error: error.message,
    });
  }
};
