import { Router } from 'express'
import { authenticateUser } from '../middlewares/auth.middleware.js'
import {
  createOrganization,
  updateOrganization,
} from '../controllers/organization.controller.js'

const router = Router()

router.post('/', authenticateUser(true), createOrganization)
router.put('/:id', authenticateUser, updateOrganization)

export default router
