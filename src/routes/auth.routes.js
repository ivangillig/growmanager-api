import { Router } from 'express'
import { authenticateUser } from '../middlewares/auth.middleware.js'
import {
  login,
  register,
  logout,
  changePassword,
} from '../controllers/auth.controller.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', authenticateUser(), logout)
router.post('/change-password', authenticateUser(), changePassword)

router.get('/profile', authenticateUser, (req, res) => {
  res.json(req.user)
})

export default router
