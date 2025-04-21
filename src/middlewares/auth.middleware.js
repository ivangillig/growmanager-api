import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import {
  getUnauthorizedErrorResponse,
  getNotFoundErrorResponse,
} from '../utils/responseUtils.js'
import {
  ERROR_INVALID_TOKEN,
  ERROR_USER_NOT_FOUND,
  ERROR_UNAUTHORIZED,
  ERROR_SESSION_EXPIRED,
  ERROR_ORGANIZATION_REQUIRED,
} from '../constants/messages.js'

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res
      .status(401)
      .json(getUnauthorizedErrorResponse(ERROR_INVALID_TOKEN))
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      const errorMessage =
        err.name === 'TokenExpiredError'
          ? ERROR_SESSION_EXPIRED
          : ERROR_INVALID_TOKEN
      return res.status(403).json(getUnauthorizedErrorResponse(errorMessage))
    }
    req.user = user
    next()
  })
}

export const authenticateUser =
  (skipOrganizationCheck = false) =>
  async (req, res, next) => {
    const authHeader = req.header('Authorization')

    if (!authHeader) {
      return next(getUnauthorizedErrorResponse(ERROR_INVALID_TOKEN))
    }

    const token = authHeader.replace('Bearer ', '')

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.id).select(
        'username email role organization'
      )

      if (!user) {
        return next(getNotFoundErrorResponse(ERROR_USER_NOT_FOUND))
      }

      if (!skipOrganizationCheck && !user.organization) {
        return next(getUnauthorizedErrorResponse(ERROR_ORGANIZATION_REQUIRED))
      }

      req.user = user
      next()
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return next(getUnauthorizedErrorResponse(ERROR_SESSION_EXPIRED))
      }
      next(error)
    }
  }

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user && req.user.role
    const isAuthorized = allowedRoles.some((role) =>
      Array.isArray(role) ? role.includes(userRole) : role === userRole
    )

    if (!isAuthorized) {
      return res
        .status(403)
        .json(getUnauthorizedErrorResponse(ERROR_UNAUTHORIZED))
    }
    next()
  }
}
