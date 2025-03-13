import {
  ERROR_CREATING_BATCH_LOG,
  ERROR_INVALID_INTERVENTION,
  ERROR_INVALID_PRUNING_TYPE,
  ERROR_INVALID_TRAINING_TECHNIQUE,
} from '../constants/messages.js'
import {
  buildSuccessResponse,
  getBusinessErrorResponse,
  getServerErrorResponse,
} from '../utils/responseUtils.js'
import { createBatchLogService } from '../services/batchLogService.js'

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
