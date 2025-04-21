import { Router } from 'express'
import {
  authenticateUser,
  authorizeRoles,
} from '../middlewares/auth.middleware.js'
import { check, validationResult } from 'express-validator'
import {
  ERROR_INVALID_INTERVENTION,
  ERROR_INVALID_PRUNING_TYPE,
  ERROR_INVALID_TRAINING_TECHNIQUE,
} from '../constants/messages.js'
import {
  createBatchLog,
  updateBatchLog,
  deleteBatchLog,
  getBatchLogs,
} from '../controllers/batchLogController.js'

const router = Router()

const validateBatchLog = [
  check('batchId').notEmpty().isMongoId(),
  check('eventDate').notEmpty().isISO8601().toDate(),
  check('eventType').notEmpty().isString(),
  check('plantHeight').optional().isNumeric(),
  check('relativeHumidity').optional().isNumeric(),
  check('soilHumidity').optional().isNumeric(),
  check('temperature').optional().isNumeric(),
  check('ph').optional().isNumeric(),
  check('pesticideType').optional().isString(),
  check('pesticideDose').optional().isNumeric(),
  check('fertilizerType').optional().isString(),
  check('fertilizerDose').optional().isNumeric(),
  check('pruningType')
    .optional()
    .isString()
    .custom((value) => {
      const validPruningTypes = ['topping', 'fimming', 'lollipopping']
      if (!validPruningTypes.includes(value)) {
        throw new Error(ERROR_INVALID_PRUNING_TYPE)
      }
      return true
    }),
  check('trainingTechnique')
    .optional()
    .isString()
    .custom((value) => {
      const validTrainingTechniques = ['lst', 'hst', 'scrog', 'sog']
      if (!validTrainingTechniques.includes(value)) {
        throw new Error(ERROR_INVALID_TRAINING_TECHNIQUE)
      }
      return true
    }),
  check('observations').optional().isString().isLength({ max: 500 }),
]

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  next()
}

router.get(
  '/:id',
  authenticateUser(),
  authorizeRoles('grower', 'admin'),
  handleValidationErrors,
  getBatchLogs
)

router.post(
  '/',
  authenticateUser(),
  authorizeRoles('grower', 'admin'),
  validateBatchLog,
  handleValidationErrors,
  createBatchLog
)

router.put(
  '/:id',
  authenticateUser(),
  authorizeRoles('grower', 'admin'),
  validateBatchLog,
  handleValidationErrors,
  updateBatchLog
)

router.delete('/:id', authenticateUser(), authorizeRoles('admin'), deleteBatchLog)

export default router
