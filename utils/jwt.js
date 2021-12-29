const jwt = require('jsonwebtoken')

const createJWT = ({ payload, expireTime }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expireTime,
  })
  return token
}

const isTokenValid = ({ token, fn }) =>
  jwt.verify(token, process.env.JWT_SECRET, fn)

const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({
    payload: user,
    expireTime: process.env.JWT_EXPIRES_IN,
  })

  const month = process.env.JWT_EXPIRES_IN

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + month),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  })
}

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
}
