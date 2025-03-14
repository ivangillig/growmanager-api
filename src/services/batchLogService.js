import BatchLog from '../models/BatchLog.js'
import Batch from '../models/Batch.js'
import { ERROR_BATCH_NOT_FOUND } from '../constants/messages.js'

export const createBatchLogService = async (batchLogData) => {
  const newBatchLog = new BatchLog(batchLogData)
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

export const getBatchLogsService = async (batchId, limit = 10, page = 1) => {
  const batch = await Batch.findById(batchId)
  if (!batch) {
    throw new Error(ERROR_BATCH_NOT_FOUND)
  }

  const logs = await BatchLog.find({ batchId })
    .sort({ interventionDate: -1 })
    .limit(limit)
    .skip((page - 1) * limit)

  const totalLogs = await BatchLog.countDocuments({ batchId })

  return { logs, totalLogs }
}
