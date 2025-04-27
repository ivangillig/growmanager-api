import User from '../models/User.js'

export const updateUserService = async (userId, updates) => {
  const user = await User.findById(userId)

  if (!user) {
    return null
  }

  if (updates.firstName !== undefined) {
    user.firstName = updates.firstName
  }

  if (updates.lastName !== undefined) {
    user.lastName = updates.lastName
  }

  await user.save()
  return user
}
