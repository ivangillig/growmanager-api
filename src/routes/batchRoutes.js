import { Router } from 'express'
import {
  authenticateUser,
  authorizeRoles,
} from '../middlewares/auth.middleware.js'
import {
  getAllBatches,
  createBatch,
  updateBatch,
  deleteBatch,
} from '../controllers/batchController.js'
import { check, validationResult } from 'express-validator'
import {
  ERROR_PRODUCTION_DATE_REQUIRED,
  ERROR_SEED_ID_REQUIRED,
  ERROR_THC_REQUIRED,
  ERROR_CBD_REQUIRED,
  ERROR_DRYING_TIME_REQUIRED,
  ERROR_QUANTITY_PRODUCED_REQUIRED,
  ERROR_RAV_REQUIRED,
} from '../constants/messages.js'

const router = Router()

const validateBatch = [
  check('production_date')
    .notEmpty()
    .withMessage(ERROR_PRODUCTION_DATE_REQUIRED),
  check('seedId').notEmpty().withMessage(ERROR_SEED_ID_REQUIRED),
  check('thc').notEmpty().withMessage(ERROR_THC_REQUIRED),
  check('cbd').notEmpty().withMessage(ERROR_CBD_REQUIRED),
  check('drying_time').notEmpty().withMessage(ERROR_DRYING_TIME_REQUIRED),
  check('quantity_produced')
    .notEmpty()
    .withMessage(ERROR_QUANTITY_PRODUCED_REQUIRED),
  check('rav').notEmpty().withMessage(ERROR_RAV_REQUIRED),
]

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  next()
}

router.get('/', authenticateUser, authorizeRoles('grower'), getAllBatches)
router.post(
  '/',
  authenticateUser,
  authorizeRoles('grower'),
  validateBatch,
  handleValidationErrors,
  createBatch
)
router.put(
  '/:id',
  authenticateUser,
  authorizeRoles('grower'),
  validateBatch,
  handleValidationErrors,
  updateBatch
)
router.delete('/:id', authenticateUser, authorizeRoles('grower'), deleteBatch)

export default router
