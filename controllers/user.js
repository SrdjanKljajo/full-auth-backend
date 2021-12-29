const { StatusCodes } = require('http-status-codes')
const { User, Post } = require('../models')
const CustomApiError = require('../errors')
const { checkPermissions } = require('../utils')

// @desc      Get users
// @route     GET /api/v1/users
// @access    Private (only admin and moderator role)
const getAllUsers = async (req, res) => {
  const users = await User.findAll({ include: 'posts' })
  res.status(StatusCodes.OK).json({
    status: 'success',
    users,
    count: users.length,
  })
}

// @desc      Get single user
// @route     GET /api/v1/users/:slug
// @access    Private (only admin and current user)
const getUser = async (req, res) => {
  const slug = req.params.slug
  const user = await User.findOne({ where: { slug }, include: 'posts' })

  if (!user) throw new CustomApiError.NotFoundError(`User ${slug} not found`)

  checkPermissions(req.user, user.uuid)

  res.status(StatusCodes.OK).json({
    status: 'success',
    user,
  })
}

// @desc      Show current user
// @route     GET /api/v1/users/show-me
// @access    Private
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user })
}

// @desc      Create user
// @route     POST /api/v1/users
// @access    Private (only admin and moderator role)
const createUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  if (password !== confirmPassword)
    throw new CustomApiError.BadRequestError('Passwords dont match')

  const user = await User.create({ name, password, email })
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    msg: `User ${name} add`,
    user,
  })
}

// @desc      Update user
// @route     PUT /api/v1/users/:slug
// @access    Private (only admin role and current user)
const updateUser = async (req, res) => {
  const slug = req.params.slug
  const { name, password } = req.body
  const user = await User.findOne({ where: { slug } })

  if (!user) throw new CustomApiError.NotFoundError(`User ${slug} not found`)

  checkPermissions(req.user, user.uuid)

  user.name = name
  user.password = password
  await user.save()

  res.status(StatusCodes.OK).json({
    status: 'success',
    msg: `User ${name} updated`,
    user,
  })
}

// @desc      Update single user atrribute
// @route     PATCH /api/v1/users/:slug
// @access    Private (only admi role)
const updateUserRole = async (req, res) => {
  const slug = req.params.slug
  const user = await User.findOne({ where: { slug } })

  if (!user) throw new CustomApiError.NotFoundError(`User ${slug} not found`)

  const { role } = req.body

  if (role) {
    user.role = role
    await user.save()
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    msg: `User role updated to ${role}`,
    user,
  })
}

// @desc      Delete user
// @route     DELETE /api/v1/users/:slug
// @access    Private
const deleteUser = async (req, res) => {
  const slug = req.params.slug
  const user = await User.findOne({ where: { slug } })

  if (!user) throw new CustomApiError.NotFoundError(`User ${slug} not found`)

  await Post.destroy({ where: { userId: user.id } })
  await user.destroy()
  res.status(StatusCodes.NO_CONTENT).send()
}

module.exports = {
  showCurrentUser,
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
  updateUserRole,
  getUser,
}
