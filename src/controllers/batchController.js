import Batch from '../models/Batch.js'
import Seed from '../models/Seed.js'
import {
  ERROR_CREATING_BATCH,
  ERROR_FETCHING_BATCHES,
  ERROR_UPDATING_BATCH,
  ERROR_DELETING_BATCH,
  ERROR_INVALID_INPUT,
  ERROR_BATCH_NOT_FOUND,
} from '../constants/messages.js'
import {
  buildSuccessResponse,
  getBusinessErrorResponse,
  getServerErrorResponse,
} from '../utils/responseUtils.js'
import {
  generateBatchCode,
  getAllBatchesService,
  createBatchService,
  updateBatchService,
  deleteBatchService,
} from '../services/batchService.js'

export const getAllBatches = async (req, res) => {
  try {
    const data = await getAllBatchesService(req, res)
    res.json(buildSuccessResponse({ data }))
  } catch (error) {
    res
      .status(500)
      .json(getServerErrorResponse(ERROR_FETCHING_BATCHES, error.message))
  }
}

export const createBatch = async (req, res) => {
  const {
    productionDate,
    seedId,
    thc,
    cbd,
    dryingTime,
    qtyProduced,
    rav,
    germinationDate,
    isCutting,
    firstTransplateDate,
    secondTransplateDate,
    photoperiodChangeDate,
  } = req.body

  try {
    const batchCode = await generateBatchCode(new Date(productionDate), seedId)

    const newBatch = await createBatchService({
      batchCode,
      productionDate,
      seedId,
      thc,
      cbd,
      dryingTime,
      qtyProduced,
      rav,
      germinationDate,
      isCutting,
      firstTransplateDate,
      secondTransplateDate,
      photoperiodChangeDate,
    })

    res.status(201).json(buildSuccessResponse({ batch: newBatch }))
  } catch (error) {
    res
      .status(500)
      .json(getServerErrorResponse(ERROR_CREATING_BATCH, error.message))
  }
}

export const updateBatch = async (req, res) => {
  const { id } = req.params
  const {
    productionDate,
    seedId,
    thc,
    cbd,
    dryingTime,
    qtyProduced,
    rav,
    germinationDate,
    isCutting,
    firstTransplateDate,
    secondTransplateDate,
    photoperiodChangeDate,
  } = req.body

  try {
    const updatedBatch = await updateBatchService(id, {
      productionDate,
      seedId,
      thc,
      cbd,
      dryingTime,
      qtyProduced,
      rav,
      germinationDate,
      isCutting,
      firstTransplateDate,
      secondTransplateDate,
      photoperiodChangeDate,
    })

    res.json(buildSuccessResponse({ batch: updatedBatch }))
  } catch (error) {
    res
      .status(500)
      .json(getServerErrorResponse(ERROR_UPDATING_BATCH, error.message))
  }
}

export const deleteBatch = async (req, res) => {
  const { id } = req.params

  try {
    await deleteBatchService(id)
    res.json(buildSuccessResponse({ message: 'Batch deleted successfully' }))
  } catch (error) {
    res
      .status(500)
      .json(getServerErrorResponse(ERROR_DELETING_BATCH, error.message))
  }
}
