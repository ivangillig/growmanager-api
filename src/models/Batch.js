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
    productionDate: {
      type: Date,
      required: false,
    },
    seedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seed',
      required: true,
    },
    thc: {
      type: Number,
      required: false,
    },
    cbd: {
      type: Number,
      required: false,
    },
    dryingTime: {
      type: Number,
      required: false,
    },
    qtyProduced: {
      type: Number,
      required: false,
    },
    rav: {
      type: String,
      required: false,
    },
    germinationDate: {
      type: Date,
      required: true,
    },
    isCutting: {
      type: Boolean,
      required: false,
    },
    firstTransplateDate: {
      type: Date,
      required: false,
    },
    secondTransplateDate: {
      type: Date,
      required: false,
    },
    photoperiodChangeDate: {
      type: Date,
      required: false,
    },
    cuttingDate: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
)

const Batch = mongoose.model('Batch', batchSchema)

export default Batch
