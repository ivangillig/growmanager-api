import Organization from '../models/Organization.js'
import {
  ORGANIZATION_CREATED_SUCCESSFULLY,
  ORGANIZATION_UPDATED_SUCCESSFULLY,
  ERROR_ORGANIZATION_NOT_FOUND
} from '../constants/messages.js'
import {
  buildSuccessResponse,
  getServerErrorResponse,
  getNotFoundErrorResponse,
} from '../utils/responseUtils.js'

export const createOrganization = async (req, res) => {
  try {
    const { name, description } = req.body

    const organization = new Organization({ name, description })
    await organization.save()

    return res.json(
      buildSuccessResponse({
        message: ORGANIZATION_CREATED_SUCCESSFULLY,
        organization,
      })
    )
  } catch (error) {
    return res.json(getServerErrorResponse(error.message))
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
    return res.json(getServerErrorResponse(error.message))
  }
}
