import Organization from '../models/Organization.js'
import User from '../models/User.js'
import {
  ORGANIZATION_CREATED_SUCCESSFULLY,
  ORGANIZATION_UPDATED_SUCCESSFULLY,
  ERROR_ORGANIZATION_NOT_FOUND,
  ERROR_USER_ALREADY_HAS_ORGANIZATION
} from '../constants/messages.js'
import {
  buildSuccessResponse,
  getServerErrorResponse,
  getNotFoundErrorResponse,
  getBusinessErrorResponse,
} from '../utils/responseUtils.js'

export const createOrganization = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)

    // Check if the user already has an organization assigned
    if (user.organization) {
      throw getBusinessErrorResponse(ERROR_USER_ALREADY_HAS_ORGANIZATION)
    }

    const { name, description } = req.body

    const organization = new Organization({ name, description })
    await organization.save()

    user.organization = organization._id
    await user.save()

    return res.json(
      buildSuccessResponse({
        message: ORGANIZATION_CREATED_SUCCESSFULLY,
        organization,
      })
    )
  } catch (error) {
    next(error)
  }
}

export const updateOrganization = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description } = req.body

    const organization = await Organization.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    )

    if (!organization) {
      return res.json(getNotFoundErrorResponse(ERROR_ORGANIZATION_NOT_FOUND))
    }

    return res.json(
      buildSuccessResponse({
        message: ORGANIZATION_UPDATED_SUCCESSFULLY,
        organization,
      })
    )
  } catch (error) {
    return res.status(500).json(getServerErrorResponse(error.message))
  }
}
