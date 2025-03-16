import mongoose from 'mongoose'

const baseOptions = {
  discriminatorKey: 'eventType',
  collection: 'batchLogs',
  timestamps: true,
}

const batchLogBaseSchema = new mongoose.Schema(
  {
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    observations: {
      type: String,
      maxlength: 500,
      required: false,
    },
  },
  baseOptions
)

const BatchLog = mongoose.model('BatchLog', batchLogBaseSchema)

const PesticidesLog = BatchLog.discriminator(
  'pesticides',
  new mongoose.Schema({
    pesticideType: { type: String, required: false },
    pesticideDose: { type: Number, required: false },
  })
)

const FertilizationLog = BatchLog.discriminator(
  'fertilization',
  new mongoose.Schema({
    fertilizerType: { type: String, required: false },
    fertilizerDose: { type: Number, required: false },
  })
)

const PruningLog = BatchLog.discriminator(
  'pruning',
  new mongoose.Schema({
    pruningType: {
      type: String,
      enum: ['topping', 'fimming', 'lollipopping'],
      required: false,
    },
  })
)

const DataRecordLog = BatchLog.discriminator(
  'dataRecord',
  new mongoose.Schema({
    plantHeight: { type: Number, required: false },
    relativeHumidity: { type: Number, required: false },
    soilHumidity: { type: Number, required: false },
    temperature: { type: Number, required: false },
    ph: { type: Number, required: false },
  })
)

const ManualWateringLog = BatchLog.discriminator(
  'manualWatering',
  new mongoose.Schema({
    waterAmount: { type: Number, required: false },
    waterPh: { type: Number, required: false },
    waterTemperature: { type: Number, required: false },
    fertilized: { type: Boolean, required: false },
  })
)

const TrainingLog = BatchLog.discriminator(
  'training',
  new mongoose.Schema({
    trainingTechnique: {
      type: String,
      enum: ['lst', 'hst', 'scrog', 'sog'],
      required: false,
    },
  })
)

export default BatchLog
