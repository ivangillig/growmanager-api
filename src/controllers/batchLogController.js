import {
  ERROR_CREATING_BATCH_LOG,
  ERROR_INVALID_INTERVENTION,
  ERROR_INVALID_PRUNING_TYPE,
  ERROR_INVALID_TRAINING_TECHNIQUE,
  ERROR_UPDATING_BATCH_LOG,
  ERROR_DELETING_BATCH_LOG,
  SUCCESS_BATCH_LOG_DELETED,
  SUCCESS_BATCH_LOG_CREATED,
  ERROR_FETCHING_BATCH_LOGS,
} from '../constants/messages.js'
import {
  buildSuccessResponse,
  getBusinessErrorResponse,
  getServerErrorResponse,
} from '../utils/responseUtils.js'
import {
  createBatchLogService,
  updateBatchLogService,
  deleteBatchLogService,
  getBatchLogsService,
} from '../services/batchLogService.js'

export const createBatchLog = async (req, res) => {
  const {
    batchId,
    interventionDate,
    plantHeight,
    relativeHumidity,
    soilHumidity,
    temperature,
    ph,
    interventions,
    fertilizerType,
    fertilizerDose,
    pesticideType,
    pesticideDose,
    pruningType,
    trainingTechnique,
    observations,
  } = req.body

  try {
    const newBatchLog = await createBatchLogService({
      batchId,
      interventionDate,
      plantHeight,
      relativeHumidity,
      soilHumidity,
      temperature,
      ph,
      interventions,
      fertilizerType,
      fertilizerDose,
      pesticideType,
      pesticideDose,
      pruningType,
      trainingTechnique,
      observations,
    })

    res.status(201).json(buildSuccessResponse({ batchLog: newBatchLog }))
  } catch (error) {
    res
      .status(500)
      .json(getServerErrorResponse(ERROR_CREATING_BATCH_LOG, error.message))
  }
}

export const updateBatchLog = async (req, res) => {
  const { id } = req.params
  const {
    batchId,
    interventionDate,
    plantHeight,
    relativeHumidity,
    soilHumidity,
    temperature,
    ph,
    interventions,
    fertilizerType,
    fertilizerDose,
    pesticideType,
    pesticideDose,
    pruningType,
    trainingTechnique,
    observations,
  } = req.body

  try {
    const updatedBatchLog = await updateBatchLogService(id, {
      batchId,
      interventionDate,
      plantHeight,
      relativeHumidity,
      soilHumidity,
      temperature,
      ph,
      interventions,
      fertilizerType,
      fertilizerDose,
      pesticideType,
      pesticideDose,
      pruningType,
      trainingTechnique,
      observations,
    })

    res.json(buildSuccessResponse({ batchLog: updatedBatchLog }))
  } catch (error) {
    res
      .status(500)
      .json(getServerErrorResponse(ERROR_UPDATING_BATCH_LOG, error.message))
  }
}

export const deleteBatchLog = async (req, res) => {
  const { id } = req.params

  try {
    await deleteBatchLogService(id)
    res.json(buildSuccessResponse({ message: SUCCESS_BATCH_LOG_DELETED }))
  } catch (error) {
    res
      .status(500)
      .json(getServerErrorResponse(ERROR_DELETING_BATCH_LOG, error.message))
  }
}

export const getBatchLogs = async (req, res) => {
  const { id: batchId } = req.params
  const limit = parseInt(req.query.limit) || 10
  const page = parseInt(req.query.page) || 1

  try {
    const { logs, totalLogs } = await getBatchLogsService(batchId, limit, page)
    res.json(
      buildSuccessResponse({
        data: logs,
        pagination: {
          limit,
          page,
          total: totalLogs,
        },
      })
    )
  } catch (error) {
    res
      .status(500)
      .json(getServerErrorResponse(ERROR_FETCHING_BATCH_LOGS, error.message))
  }
}
