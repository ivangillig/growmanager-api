import { Router } from 'express'
import authRoutes from './auth.routes.js'
import seedsRoutes from './seedsRoutes.js'
import batchRoutes from './batchRoutes.js'
import batchLogRoutes from './batchLogRoutes.js'
import organizationRoutes from './organization.routes.js'

const router = Router()

// API health check route
router.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Routes
router.use('/auth', authRoutes)
router.use('/seeds', seedsRoutes)
router.use('/batch', batchRoutes)
router.use('/batchlog', batchLogRoutes)
router.use('/organizations', organizationRoutes)

export default router
