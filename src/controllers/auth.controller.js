import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Session from '../models/Session.js'
import {
  buildSuccessResponse,
  getServerErrorResponse,
} from '../utils/responseUtils.js'
import {
  ERROR_LOGOUT,
  LOGOUT_SUCCESSFUL,
  ERROR_INVALID_CREDENTIALS,
  ERROR_PASSWORDS_DO_NOT_MATCH,
  ERROR_INVALID_PASSWORD_FORMAT,
  ERROR_CREATING_USER,
} from '../constants/messages.js'
import { invalidateToken, createUser } from '../services/authService.js'

export const register = async (req, res) => {
  try {
    const { email, password, confirmPassword, username } = req.body

    if (password !== confirmPassword) {
      return res.status(400).json({ message: ERROR_PASSWORDS_DO_NOT_MATCH })
    }

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/
    if (!passwordPattern.test(password)) {
      return res.status(400).json({ message: ERROR_INVALID_PASSWORD_FORMAT })
    }

    const { token, user } = await createUser({
      email,
      password,
      username,
      role: 'admin',
    })

    res.status(201).json({ token, user })
  } catch (error) {
    res.status(422).json({ message: ERROR_CREATING_USER, error: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username }).populate('organization')
    if (!user) {
      return res.status(401).json({ message: ERROR_INVALID_CREDENTIALS })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: ERROR_INVALID_CREDENTIALS })
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    )

    const session = new Session({
      userId: user._id,
      token,
      expiresAt: new Date(
        Date.now() + parseInt(process.env.JWT_EXPIRES_IN) * 1000
      ),
    })
    await session.save()

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        organization: user.organization,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message })
  }
}

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    await invalidateToken(token)
    res.json(buildSuccessResponse({ message: LOGOUT_SUCCESSFUL }))
  } catch (error) {
    res.status(500).json(getServerErrorResponse(ERROR_LOGOUT, error.message))
  }
}
