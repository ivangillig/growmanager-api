import { Router } from 'express'
import { authenticateUser } from '../middlewares/auth.middleware.js'
import { updateUser } from '../controllers/user.controller.js'

const router = Router()

router.put('/', authenticateUser(), updateUser)

export default router
