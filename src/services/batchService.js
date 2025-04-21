import Batch from '../models/Batch.js'
import Seed from '../models/Seed.js'
import {
  ERROR_SEED_NOT_FOUND,
  ERROR_BATCH_NOT_FOUND,
} from '../constants/messages.js'
import User from '../models/User.js'
import { getOrganization } from './authService.js'

export const generateBatchCode = async (productionDate, seedId) => {
  const seed = await Seed.findById(seedId)
  if (!seed) {
    throw new Error(ERROR_SEED_NOT_FOUND)
  }

  const dateStr = productionDate.toISOString().slice(0, 10).replace(/-/g, '')
  const genetic = seed.genetic.toUpperCase().replace(/\s+/g, '')
  const existingBatches = await Batch.find({
    productionDate,
    seedId,
  })

  const batchNumber = (existingBatches.length + 1).toString().padStart(3, '0')
  return `${dateStr}-${genetic}-${batchNumber}`
}

export const getAllBatchesService = async (req, res) => {
  const user = await User.findById(req.user._id)

  return await Batch.find({ organization: user.organization }).populate(
    'seedId',
    'genetic'
  )
}

export const createBatchService = async (user, batchData) => {
  const organization = await getOrganization(user)

  const newBatch = new Batch({ ...batchData, organization: organization._id })
  await newBatch.save()
  return await newBatch.populate('seedId', 'genetic')
}

export const updateBatchService = async (id, batchData) => {
  const batch = await Batch.findById(id)
  if (!batch) {
    throw new Error(ERROR_BATCH_NOT_FOUND)
  }

  Object.assign(batch, batchData)
  await batch.save()
  return batch
}

export const deleteBatchService = async (id) => {
  const batch = await Batch.findById(id)
  if (!batch) {
    throw new Error(ERROR_BATCH_NOT_FOUND)
  }

  await batch.deleteOne()
  return batch
}
