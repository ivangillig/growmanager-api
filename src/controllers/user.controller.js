import { updateUserService } from '../services/userService.js'
import {
  buildSuccessResponse,
  getBusinessErrorResponse,
} from '../utils/responseUtils.js'
import {
  ERROR_USER_NOT_FOUND,
  SUCCESS_USER_UPDATED,
} from '../constants/messages.js'

export const updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName } = req.body
    const userId = req.user._id

    const updatedUser = await updateUserService(userId, { firstName, lastName })

    if (!updatedUser) {
      throw getBusinessErrorResponse(ERROR_USER_NOT_FOUND)
    }

    res.json(
      buildSuccessResponse({ message: SUCCESS_USER_UPDATED, data: { firstName, lastName } })
    )
  } catch (error) {
    next(error)
  }
}
