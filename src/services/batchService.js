import Batch from '../models/Batch.js'
import Seed from '../models/Seed.js'
import {
  ERROR_CREATING_BATCH,
  ERROR_SEED_NOT_FOUND,
  ERROR_DELETING_BATCH,
  ERROR_BATCH_NOT_FOUND,
  ERROR_USER_NOT_FOUND,
} from '../constants/messages.js'
import User from '../models/User.js'
import { getOrganization } from './authService.js'

export const generateBatchCode = async (productionDate, seedId) => {
  try {
    const seed = await Seed.findById(seedId)
    if (!seed) {
      throw getNotFoundErrorResponse(ERROR_SEED_NOT_FOUND)
    }

    const dateStr = productionDate.toISOString().slice(0, 10).replace(/-/g, '')
    const genetic = seed.genetic.toUpperCase().replace(/\s+/g, '')
    const existingBatches = await Batch.find({
      productionDate,
      seedId,
    })

    const batchNumber = (existingBatches.length + 1).toString().padStart(3, '0')
    return `${dateStr}-${genetic}-${batchNumber}`
  } catch (error) {
    next(error)
  }
}

export const getAllBatchesService = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      throw getNotFoundErrorResponse(ERROR_USER_NOT_FOUND)
    }

    const batches = await Batch.find({ organization: user.organization })
      .populate('seedId', 'genetic')
      .sort({ productionDate: -1 })

    return batches
  } catch (error) {
    next(error)
  }
}

export const createBatchService = async (user, batchData, next) => {
  try {
    let organization
    try {
      organization = await getOrganization(user)
      if (!organization) {
        throw getNotFoundErrorResponse(ERROR_ORGANIZATION_NOT_FOUND)
      }
    } catch (error) {
      throw getErrorResponse(ERROR_FETCHING_ORGANIZATION)
    }

    try {
      const newBatch = new Batch({
        ...batchData,
        organization: organization._id,
      })
      await newBatch.save()
      return await newBatch.populate('seedId', 'genetic')
    } catch (error) {
      throw getErrorResponse(ERROR_CREATING_BATCH)
    }
  } catch (error) {
    next(error)
  }
}

export const updateBatchService = async (id, batchData, next) => {
  try {
    const batch = await Batch.findById(id)
    if (!batch) {
      throw getNotFoundErrorResponse(ERROR_BATCH_NOT_FOUND)
    }

    Object.assign(batch, batchData)
    await batch.save()
    return batch
  } catch (error) {
    next(error)
  }
}

export const deleteBatchService = async (id, next) => {
  try {
    const batch = await Batch.findById(id)
    if (!batch) {
      throw getNotFoundErrorResponse(ERROR_BATCH_NOT_FOUND)
    }

    try {
      await batch.deleteOne()
      return batch
    } catch (error) {
      throw getServerErrorResponse(ERROR_DELETING_BATCH, error)
    }
  } catch (error) {
    next(error)
  }
}
