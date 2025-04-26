import { SUCCESS_BATCH_LOG_DELETED } from '../constants/messages.js'
import { buildSuccessResponse } from '../utils/responseUtils.js'
import {
  createBatchLogService,
  updateBatchLogService,
  deleteBatchLogService,
  getBatchLogsService,
} from '../services/batchLogService.js'

export const createBatchLog = async (req, res, next) => {
  try {
    const newBatchLog = await createBatchLogService(req.body, req.user, next)
    res.status(201).json(buildSuccessResponse({ batchLog: newBatchLog }))
  } catch (error) {
    next(error)
  }
}

export const updateBatchLog = async (req, res, next) => {
  const { id } = req.params

  try {
    const updatedBatchLog = await updateBatchLogService(id, req.body, next)
    res.json(buildSuccessResponse({ batchLog: updatedBatchLog }))
  } catch (error) {
    next(error)
  }
}

export const deleteBatchLog = async (req, res, next) => {
  const { id } = req.params

  try {
    await deleteBatchLogService(id, next)
    res.json(buildSuccessResponse({ message: SUCCESS_BATCH_LOG_DELETED }))
  } catch (error) {
    next(error)
  }
}

export const getBatchLogs = async (req, res, next) => {
  const { id: batchId } = req.params

  const limit = parseInt(req.query.limit) || 10
  const page = parseInt(req.query.page) || 1
  const eventTypes = req.query.eventType ? req.query.eventType.split(',') : null
  const sortField = req.query.sortField || 'createdAt'
  const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1

  if (isNaN(limit) || isNaN(page) || limit <= 0 || page <= 0) {
    return res.status(400).json({
      error:
        'Invalid pagination parameters. Limit and page must be positive numbers.',
    })
  }

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
    next(error)
  }
}
