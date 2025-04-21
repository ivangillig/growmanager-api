import jwt from 'jsonwebtoken'
import Session from '../models/Session.js'
import User from '../models/User.js'
import { ERROR_USER_ALREADY_EXISTS } from '../constants/messages.js'

export const invalidateToken = async (token) => {
  await Session.findOneAndDelete({ token })
}

export const createUser = async ({ email, password, username, role }) => {
  const userExists = await User.findOne({ email })
  if (userExists) {
    throw new Error(ERROR_USER_ALREADY_EXISTS)
  }

  const user = new User({ email, password, username, role })
  await user.save()

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  )

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.username,
      role: user.role,
    },
  }
}
