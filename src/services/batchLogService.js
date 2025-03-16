import BatchLog from '../models/BatchLog.js'
import Batch from '../models/Batch.js'
import { ERROR_BATCH_NOT_FOUND } from '../constants/messages.js'

export const createBatchLogService = async (batchLogData) => {
  const { eventType, ...data } = batchLogData
  const newBatchLog = new BatchLog({ ...data, eventType })
  await newBatchLog.save()
  return newBatchLog
}

export const updateBatchLogService = async (id, batchLogData) => {
  const batchLog = await BatchLog.findById(id)
  if (!batchLog) {
    throw new Error(ERROR_BATCH_NOT_FOUND)
  }

  Object.assign(batchLog, batchLogData)
  await batchLog.save()
  return batchLog
}

export const deleteBatchLogService = async (id) => {
  const batchLog = await BatchLog.findById(id)
  if (!batchLog) {
    throw new Error(ERROR_BATCH_NOT_FOUND)
  }

  await batchLog.deleteOne()
  return batchLog
}

export const getBatchLogsService = async (
  batchId,
  limit = 10,
  page = 1,
  eventTypes = null,
  sortField = 'eventDate',
  sortOrder = 'desc'
) => {
  const batch = await Batch.findById(batchId)
  if (!batch) {
    throw new Error(ERROR_BATCH_NOT_FOUND)
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
}
