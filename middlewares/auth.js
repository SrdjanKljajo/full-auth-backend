const CustomApiError = require('../errors')
const { isTokenValid } = require('../utils')

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token

  if (!token) {
    throw new CustomApiError.UnauthenticatedError('Authentication Invalid')
  }

  try {
    const { name, userId, slug, role } = isTokenValid({ token })
    req.user = { name, userId, slug, role }
    next()
  } catch (error) {
    throw new CustomApiError.UnauthenticatedError('Authentication Invalid')
  }
}

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomApiError.UnauthorizedError(
        'Unauthorized to access this route'
      )
    }
    next()
  }
}

module.exports = {
  authenticateUser,
  authorizePermissions,
}
