import Batch from '../models/Batch.js'
import Seed from '../models/Seed.js'
import {
  ERROR_SEED_NOT_FOUND,
  ERROR_BATCH_NOT_FOUND,
} from '../constants/messages.js'

export const generateBatchCode = async (production_date, seedId) => {
  const seed = await Seed.findById(seedId)
  if (!seed) {
    throw new Error(ERROR_SEED_NOT_FOUND)
  }

  const dateStr = production_date.toISOString().slice(0, 10).replace(/-/g, '')
  const genetic = seed.genetic.toUpperCase().replace(/\s+/g, '')
  const existingBatches = await Batch.find({
    production_date,
    seedId,
  })

  const batchNumber = (existingBatches.length + 1).toString().padStart(3, '0')
  return `${dateStr}-${genetic}-${batchNumber}`
}

export const getAllBatchesService = async () => {
  return await Batch.find().populate('seedId', 'genetic')
}

export const createBatchService = async (batchData) => {
  const newBatch = new Batch(batchData)
  await newBatch.save()
  return newBatch
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

  await batch.remove()
  return batch
}
