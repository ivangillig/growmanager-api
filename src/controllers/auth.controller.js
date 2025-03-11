import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Session from '../models/Session.js'
import {
  buildSuccessResponse,
  getServerErrorResponse,
} from '../utils/responseUtils.js'
import { ERROR_LOGOUT, LOGOUT_SUCCESSFUL } from '../constants/messages.js'
import { invalidateToken } from '../services/authService.js'

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const user = new User({
      email,
      password,
      name,
    })

    await user.save()

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    )

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating user', error: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
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
      expiresAt: new Date(Date.now() + parseInt(process.env.JWT_EXPIRES_IN) * 1000),
    })
    await session.save()

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
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
