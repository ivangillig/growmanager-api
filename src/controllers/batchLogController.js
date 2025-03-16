import {
  ERROR_CREATING_BATCH_LOG,
  ERROR_UPDATING_BATCH_LOG,
  ERROR_DELETING_BATCH_LOG,
  SUCCESS_BATCH_LOG_DELETED,
  SUCCESS_BATCH_LOG_CREATED,
  ERROR_FETCHING_BATCH_LOGS,
} from '../constants/messages.js'
import {
  buildSuccessResponse,
  getServerErrorResponse,
} from '../utils/responseUtils.js'
import {
  createBatchLogService,
  updateBatchLogService,
  deleteBatchLogService,
  getBatchLogsService,
} from '../services/batchLogService.js'

export const createBatchLog = async (req, res) => {
  try {
    const newBatchLog = await createBatchLogService(req.body)
    res.status(201).json(buildSuccessResponse({ batchLog: newBatchLog }))
  } catch (error) {
    res
      .status(500)
      .json(getServerErrorResponse(ERROR_CREATING_BATCH_LOG, error.message))
  }
}

export const updateBatchLog = async (req, res) => {
  const { id } = req.params

  try {
    const updatedBatchLog = await updateBatchLogService(id, req.body)
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
  const limit = parseInt(req.query.limit)
  const page = parseInt(req.query.page)
  const eventTypes = req.query.eventType ? req.query.eventType.split(',') : null
  const { sortField, sortOrder } = req.query

  try {
    const { logs, totalLogs } = await getBatchLogsService(
      batchId,
      limit,
      page,
      eventTypes,
      sortField,
      sortOrder
    )
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
