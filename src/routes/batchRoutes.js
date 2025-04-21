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
  ERROR_SEED_ID_REQUIRED,
  ERROR_GERMINATION_DATE_REQUIRED,
} from '../constants/messages.js'

const router = Router()

const validateBatch = [
  check('productionDate').optional().isISO8601().toDate(),
  check('seedId').notEmpty().withMessage(ERROR_SEED_ID_REQUIRED).isMongoId(),
  check('thc').optional().isNumeric(),
  check('cbd').optional().isNumeric(),
  check('dryingTime').optional().isNumeric(),
  check('qtyProduced').optional().isNumeric(),
  check('rav').optional().isString(),
  check('germinationDate')
    .notEmpty()
    .withMessage(ERROR_GERMINATION_DATE_REQUIRED)
    .isISO8601()
    .toDate(),
  check('isCutting').optional().isBoolean(),
  check('firstTransplateDate').optional().isISO8601().toDate(),
  check('secondTransplateDate').optional().isISO8601().toDate(),
  check('photoperiodChangeDate').optional().isISO8601().toDate(),
]

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  next()
}

router.get(
  '/',
  authenticateUser(),
  authorizeRoles('admin', 'grower'),
  getAllBatches
)
router.post(
  '/',
  authenticateUser(),
  authorizeRoles('admin', 'grower'),
  validateBatch,
  handleValidationErrors,
  createBatch
)
router.put(
  '/:id',
  authenticateUser(),
  authorizeRoles('admin', 'grower'),
  validateBatch,
  handleValidationErrors,
  updateBatch
)
router.delete(
  '/:id',
  authenticateUser(),
  authorizeRoles('admin', 'grower'),
  deleteBatch
)

export default router
