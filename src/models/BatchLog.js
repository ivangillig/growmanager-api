import mongoose from 'mongoose'

const batchLogSchema = new mongoose.Schema(
  {
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
    },
    interventionDate: {
      type: Date,
      required: true,
    },
    plantHeight: {
      type: Number,
      required: false,
    },
    relativeHumidity: {
      type: Number,
      required: false,
    },
    soilHumidity: {
      type: Number,
      required: false,
    },
    temperature: {
      type: Number,
      required: false,
    },
    ph: {
      type: Number,
      required: false,
    },
    interventions: {
      type: [String],
      enum: [
        'fertilization',
        'pesticides',
        'pruning',
        'defoliation',
        'training',
      ],
      required: false,
    },
    fertilizerType: {
      type: String,
      required: false,
    },
    fertilizerDose: {
      type: Number,
      required: false,
    },
    pesticideType: {
      type: String,
      required: false,
    },
    pesticideDose: {
      type: Number,
      required: false,
    },
    pruningType: {
      type: String,
      enum: ['topping', 'fimming', 'lollipopping'],
      required: false,
    },
    trainingTechnique: {
      type: String,
      enum: ['lst', 'hst', 'scrog', 'sog'],
      required: false,
    },
    observations: {
      type: String,
      maxlength: 500,
      required: false,
    },
  },
  { timestamps: true }
)

const BatchLog = mongoose.model('BatchLog', batchLogSchema)

export default BatchLog
