const { User } = require('../models')
const { StatusCodes } = require('http-status-codes')
const CustomApiError = require('../errors')
const {
  attachCookiesToResponse,
  createTokenUser,
  createJWT,
  isTokenValid,
} = require('../utils')
const { OAuth2Client } = require('google-auth-library')
const jwt = require('jsonwebtoken')

// sendgrid
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// @desc    Register a new user with account activation
// @route   POST /api/vi/auth/register
// @access  Public
const register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  if (password !== confirmPassword)
    throw new CustomApiError.BadRequestError('Passwords dont match')

  const token = createJWT({
    payload: { name, email, password },
    expireTime: process.env.JWT_ACTIVATION_ACCOUNT_EXPIRES,
  })

  const emailData = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Activation token`,
    html: `
                <h1>Use this token for account activation</h1>
                <p>${token}</p>
                <hr />
            `,
  }

  sgMail.send(emailData)
  return res.json({
    status: 'success',
    message: `Email sent to address ${email}. Follow instructions to activate account`,
  })
}

// @desc    Register a new user with account activation
// @route   POST /api/v1/auth/account-activation
// @access  PRivate
const accountActivation = async (req, res) => {
  const { token } = req.body

  const verifyUser = async tokenErr => {
    try {
      if (tokenErr) {
        return res.status(401).json({
          status: 'fail',
          tokenErr,
        })
      }
      const { name, email, password } = jwt.decode(token)

      const user = await User.findOne({ where: { email } })
      if (user) {
        return res.status(400).json({
          status: 'fail',
          msg: `User with email ${email} already exist`,
        })
      }

      const newUser = await User.create({ name, email, password })
      const tokenUser = createTokenUser(newUser)
      attachCookiesToResponse({ res, user: tokenUser })
      res.status(StatusCodes.CREATED).json({
        status: 'success',
        msg: `User ${name} seccessfuly created`,
        user: tokenUser,
      })
    } catch (error) {
      res.status(401).json({
        status: 'fail',
        error: 'User not verified, please try again later',
      })
    }
  }

  if (token) {
    isTokenValid({ token, fn: verifyUser })
  } else {
    throw new CustomApiError.BadRequestError('Please add token')
  }
}

// @desc    Register a new user - clasic
// @route   POST /api/v1/auth/register
// @access  Public

/*const register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  if (password !== confirmPassword) {
    throw new CustomApiError.BadRequestError('Passwords dont match')
  }

  const user = await User.create({ name, email, password })
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    msg: `User ${name} seccessfuly created`,
    user: tokenUser,
  })
}*/

// @desc    Login user
// @route   POST /api/vi/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password)
    throw new CustomApiError.BadRequestError(
      'Please provide email and password'
    )

  const user = await User.findOne({ where: { email } })

  if (!user)
    throw new CustomApiError.UnauthenticatedError('Invalid Credentials')

  const isPasswordCorrect = await user.validPassword(password)
  if (!isPasswordCorrect)
    throw new CustomApiError.UnauthenticatedError('Invalid Credentials')

  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })

  res.status(StatusCodes.OK).json({
    status: 'success',
    user: tokenUser,
  })
}

// @desc    Forgot password
// @route   PUT /api/v1/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ where: { email } })

  if (!user)
    throw new CustomApiError.BadRequestError(
      `User with email ${email} dont exist`
    )

  const resetPasswordToken = createJWT({
    payload: { payload: { uuid: user.uuid, name: user.name } },
    expireTime: process.env.JWT_ACTIVATION_ACCOUNT_EXPIRES,
  })

  const emailData = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Reset password token`,
    html: `
                <h1>Token for reset your password</h1>
                <p>${resetPasswordToken}</p>
                <hr />
            `,
  }

  await user.update({ resetPasswordToken })

  sgMail.send(emailData)
  return res.json({
    status: 'success',
    message: `Email sent to address ${email}. Follow instructions to activate account`,
  })
}

// @desc    Reset password
// @route   PUT /api/v1/auth/reset-password
// @access  Private
const resetPassword = async (req, res) => {
  const { resetPasswordToken, newPassword, confirmPassword } = req.body

  if (newPassword !== confirmPassword)
    throw new CustomApiError.BadRequestError('Passwords dont match')

  const verifyResetToken = async tokenErr => {
    try {
      if (tokenErr) {
        return res.status(401).json({
          status: 'fail',
          tokenErr,
        })
      }

      const user = await User.findOne({ where: { resetPasswordToken } })
      if (!resetPasswordToken) {
        return res.status(404).json({
          status: 'fail',
          errMsg: 'Token not found',
        })
      }

      await user.update({
        password: newPassword,
        resetPasswordToken: '',
      })

      const tokenUser = createTokenUser(user)
      attachCookiesToResponse({ res, user: tokenUser })
      res.status(StatusCodes.CREATED).json({
        status: 'success',
        msg: `User password seccessfuly updated`,
        user: tokenUser,
      })
    } catch (error) {
      res
        .status(401)
        .json({ status: 'fail', error: 'Token is not valid enymore' })
    }
  }

  if (resetPasswordToken) {
    isTokenValid({ token: resetPasswordToken, fn: verifyResetToken })
  } else {
    throw new CustomApiError.BadRequestError('Please add token')
  }
}

// @desc    Google login
// @route   POST /api/v1/auth/google-login
// @access  Public
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const googleLogin = async (req, res) => {
  const idToken = req.body.tokenId
  client
    .verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    .then(async (response, err) => {
      const { email_verified, name, email, jti } = response.payload

      if (email_verified) {
        const user = await User.findOne({ where: { email } })
        if (user) {
          const tokenUser = createTokenUser(user)
          attachCookiesToResponse({ res, user: tokenUser })
          res.status(StatusCodes.OK).json({
            status: 'success',
            user: tokenUser,
          })
        } else {
          let password = jti
          const user = await User.create({ name, email, password })

          const tokenUser = createTokenUser(user)
          attachCookiesToResponse({ res, user: tokenUser })
          res.status(StatusCodes.OK).json({
            status: 'success',
            user: tokenUser,
          })
        }
      } else {
        throw new CustomApiError.BadRequestError(
          'Google registration failed! Please try again'
        )
      }
    })
}

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  })

  res.status(StatusCodes.OK).json({
    ststus: 'success',
    msg: 'user logged out!',
  })
}

module.exports = {
  register,
  login,
  logout,
  googleLogin,
  accountActivation,
  forgotPassword,
  resetPassword,
}
