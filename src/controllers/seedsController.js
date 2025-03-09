import Seed from "../models/Seed.js";
import {
  ERROR_FETCHING_SEEDS,
  ERROR_CREATING_SEED,
  ERROR_INVALID_FILE_FORMAT,
} from "../constants/messages.js";
import {
  buildSuccessResponse,
  getBusinessErrorResponse,
  getServerErrorResponse,
} from "../utils/responseUtils.js";
import path from "path";
import fs from "fs";
import multer from "multer";

const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error(ERROR_INVALID_FILE_FORMAT));
  },
});

export const getAllSeeds = async (req, res) => {
  try {
    const seeds = await Seed.find().select(
      "_id genetic seedBank chemoType imageUrl"
    );
    res.json(seeds);
  } catch (error) {
    res.status(500).json({
      message: ERROR_FETCHING_SEEDS,
      error: error.message,
    });
  }
};

export const createSeed = [
  upload.single("image"),
  async (req, res) => {
    const { genetic, seedBank, chemoType } = req.body;
    if (!genetic || !seedBank || !chemoType) {
      return res
        .status(422)
        .json(getBusinessErrorResponse("All fields are required"));
    }

    const image = req.file;
    if (!image) {
      return res
        .status(422)
        .json(getBusinessErrorResponse("Image is required"));
    }

    const imageUrl = `${seedBank} - ${genetic} - QT ${chemoType}${path.extname(
      image.originalname
    )}`;
    const imagePath = path.join("uploads", imageUrl);

    try {
      fs.renameSync(image.path, imagePath);

      const newSeed = new Seed({
        genetic,
        seedBank,
        chemoType,
        imageUrl,
      });

      await newSeed.save();
      res.status(201).json(buildSuccessResponse({ seed: newSeed }));
    } catch (error) {
      res
        .status(500)
        .json(getServerErrorResponse(ERROR_CREATING_SEED, error.message));
    }
  },
];
