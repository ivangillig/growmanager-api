import Session from '../models/Session.js'

export const invalidateToken = async (token) => {
  await Session.findOneAndDelete({ token })
}
