import BatchLog from '../models/BatchLog.js'

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
