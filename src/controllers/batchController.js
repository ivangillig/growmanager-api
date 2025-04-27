import { buildSuccessResponse } from '../utils/responseUtils.js'
import {
  generateBatchCode,
  getAllBatchesService,
  createBatchService,
  updateBatchService,
  deleteBatchService,
} from '../services/batchService.js'

export const getAllBatches = async (req, res, next) => {
  const { page = 1, limit = 10, search = '' } = req.query

  try {
    const data = await getAllBatchesService(
      req.user,
      { page, limit, search },
      next
    )
    res.json(buildSuccessResponse({ data }))
  } catch (error) {
    next(error)
  }
}

export const createBatch = async (req, res, next) => {
  const {
    productionDate,
    seedId,
    thc,
    cbd,
    dryingTime,
    curingTime,
    qtyProduced,
    rav,
    germinationDate,
    isCutting,
    cuttingDate,
    firstTransplateDate,
    secondTransplateDate,
    photoperiodChangeDate,
  } = req.body

  try {
    const batchCode = await generateBatchCode(
      new Date(productionDate),
      seedId,
      next
    )

    const newBatch = await createBatchService(
      req.user,
      {
        batchCode,
        productionDate,
        seedId,
        thc,
        cbd,
        dryingTime,
        curingTime,
        qtyProduced,
        rav,
        germinationDate,
        cuttingDate,
        isCutting,
        firstTransplateDate,
        secondTransplateDate,
        photoperiodChangeDate,
      },
      next
    )

    res.status(201).json(buildSuccessResponse({ batch: newBatch }))
  } catch (error) {
    next(error)
  }
}

export const updateBatch = async (req, res, next) => {
  const { id } = req.params
  const {
    productionDate,
    seedId,
    thc,
    cbd,
    dryingTime,
    qtyProduced,
    curingTime,
    rav,
    germinationDate,
    isCutting,
    cuttingDate,
    firstTransplateDate,
    secondTransplateDate,
    photoperiodChangeDate,
  } = req.body

  try {
    const updatedBatch = await updateBatchService(
      id,
      {
        productionDate,
        seedId,
        thc,
        cbd,
        dryingTime,
        qtyProduced,
        curingTime,
        rav,
        germinationDate,
        cuttingDate,
        isCutting,
        firstTransplateDate,
        secondTransplateDate,
        photoperiodChangeDate,
      },
      next
    )

    res.json(buildSuccessResponse({ batch: updatedBatch }))
  } catch (error) {
    next(error)
  }
}

export const deleteBatch = async (req, res, next) => {
  const { id } = req.params

  try {
    await deleteBatchService(id)
    res.json(buildSuccessResponse({ message: 'Batch deleted successfully' }))
  } catch (error) {
    next(error)
  }
}
