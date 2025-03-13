import BatchLog from '../models/BatchLog.js'

export const createBatchLogService = async (batchLogData) => {
  const newBatchLog = new BatchLog(batchLogData)
  await newBatchLog.save()
  return newBatchLog
}
