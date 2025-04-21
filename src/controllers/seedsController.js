import Seed from '../models/Seed.js'
import {
  ERROR_FETCHING_SEEDS,
  ERROR_CREATING_SEED,
  ERROR_INVALID_FILE_FORMAT,
  INVALID_CANNABINOIDS_FORMAT,
} from '../constants/messages.js'
import {
  buildSuccessResponse,
  getBusinessErrorResponse,
  getServerErrorResponse,
} from '../utils/responseUtils.js'
import path from 'path'
import fs from 'fs'
import multer from 'multer'
import User from '../models/User.js'

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/
    const mimetype = filetypes.test(file.mimetype)
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    )
    if (mimetype && extname) {
      return cb(null, true)
    }
    cb(new Error(ERROR_INVALID_FILE_FORMAT))
  },
})

export const getAllSeeds = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    const seeds = await Seed.find({ organization: user.organization }).select(
      '_id genetic seedBank chemoType cannabinoids imageUrl ratio dominance'
    )
    res.json(seeds)
  } catch (error) {
    res.status(500).json({
      message: ERROR_FETCHING_SEEDS,
      error: error.message,
    })
  }
}

export const createSeed = [
  (req, res, next) => {
    if (req.headers['content-type']?.includes('multipart/form-data')) {
      upload.single('image')(req, res, next)
    } else {
      next()
    }
  },
  async (req, res) => {
    const { genetic, seedBank, chemoType, ratio, dominance } = req.body
    let cannabinoids = req.body.cannabinoids

    if (!genetic || !seedBank || !chemoType) {
      return res
        .status(422)
        .json(getBusinessErrorResponse('All fields are required'))
    }

    if (cannabinoids) {
      try {
        cannabinoids = JSON.parse(cannabinoids)
      } catch (error) {
        return res
          .status(422)
          .json(getBusinessErrorResponse(INVALID_CANNABINOIDS_FORMAT))
      }
    }

    const image = req.file
    let imageUrl = null

    if (image) {
      imageUrl = `${seedBank} - ${genetic} - QT ${chemoType}${path.extname(
        image.originalname
      )}`
      const imagePath = path.join('uploads', imageUrl)
      fs.renameSync(image.path, imagePath)
    }

    try {
      const newSeed = new Seed({
        genetic,
        seedBank,
        chemoType,
        imageUrl,
        cannabinoids,
        ratio,
        dominance,
      })

      await newSeed.save()
      res.status(201).json(buildSuccessResponse({ seed: newSeed }))
    } catch (error) {
      res
        .status(500)
        .json(getServerErrorResponse(ERROR_CREATING_SEED, error.message))
    }
  },
]
