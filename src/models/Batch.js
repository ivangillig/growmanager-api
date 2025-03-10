import mongoose from 'mongoose'

const batchSchema = new mongoose.Schema(
  {
    batchCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    production_date: {
      type: Date,
      required: true,
    },
    seedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seed',
      required: true,
    },
    thc: {
      type: Number,
      required: true,
    },
    cbd: {
      type: Number,
      required: true,
    },
    drying_time: {
      type: Number,
      required: true,
    },
    quantity_produced: {
      type: Number,
      required: true,
    },
    rav: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Batch = mongoose.model('Batch', batchSchema)

export default Batch
