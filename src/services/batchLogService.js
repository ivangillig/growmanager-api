import BatchLog from '../models/BatchLog.js'
import Batch from '../models/Batch.js'
import {
  getServerErrorResponse,
  getNotFoundErrorResponse,
} from '../utils/responseUtils.js'
import {
  ERROR_BATCH_NOT_FOUND,
  ERROR_CREATING_BATCH_LOG,
} from '../constants/messages.js'
import { getOrganization } from './authService.js'

export const createBatchLogService = async (batchLogData, user, next) => {
  try {
    const organization = await getOrganization(user)
    const { eventType, ...data } = batchLogData
    const newBatchLog = new BatchLog({
      ...data,
      eventType,
      organization: organization._id,
    })
    await newBatchLog.save()
    return newBatchLog
  } catch (error) {
    next(getServerErrorResponse(ERROR_CREATING_BATCH_LOG))
  }
}

export const updateBatchLogService = async (id, batchLogData, next) => {
  try {
    const batchLog = await BatchLog.findById(id)
    if (!batchLog) {
      throw getNotFoundErrorResponse(ERROR_BATCH_NOT_FOUND)
    }

    Object.assign(batchLog, batchLogData)
    await batchLog.save()
    return batchLog
  } catch (error) {
    next(error)
  }
}

export const deleteBatchLogService = async (id, next) => {
  try {
    const batchLog = await BatchLog.findById(id)
    if (!batchLog) {
      throw getNotFoundErrorResponse(ERROR_BATCH_NOT_FOUND)
    }

    await batchLog.deleteOne()
    return batchLog
  } catch (error) {
    next(error)
  }
}

export const getBatchLogsService = async (
  batchId,
  limit = 10,
  page = 1,
  eventTypes = null,
  sortField = 'eventDate',
  sortOrder = 'desc',
  next
) => {
  try {
    const batch = await Batch.findById(batchId)
    if (!batch) {
      throw getNotFoundErrorResponse(ERROR_BATCH_NOT_FOUND)
    }

    const query = { batchId }
    if (eventTypes) {
      query.eventType = { $in: eventTypes }
    }

    const logs = await BatchLog.find(query)
      .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 })
      .limit(limit)
      .skip((page - 1) * limit)

    const totalLogs = await BatchLog.countDocuments(query)

    return { logs, totalLogs }
  } catch (error) {
    next(error)
  }
}
