import mongoose from 'mongoose'

const seedSchema = new mongoose.Schema(
  {
    genetic: {
      type: String,
      required: true,
      trim: true,
    },
    seedBank: {
      type: String,
      required: true,
      trim: true,
    },
    chemoType: {
      type: String,
      required: true,
      enum: ['1', '2', '3'],
    },
    imageUrl: {
      type: String,
      default: null,
    },
    ratio: {
      type: String,
      default: null,
    },
    dominance: {
      type: String,
      default: null,
    },
    cannabinoids: {
      type: [String],
      enum: ['THC', 'CBD', 'CBG', 'CBN', 'CBC'],
      default: [],
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Seed = mongoose.model('Seed', seedSchema)

export default Seed
