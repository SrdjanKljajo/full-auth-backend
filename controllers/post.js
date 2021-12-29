const { StatusCodes } = require('http-status-codes')
const CustomApiError = require('../errors')
const { User, Post } = require('../models')

// @desc      Get posts
// @route     GET /api/v1/posts
// @access    Public
const getAllPosts = async (req, res) => {
  const posts = await Post.findAll({
    include: 'user',
  })

  if (posts.length < 1) {
    return res.status(StatusCodes.OK).json({
      status: 'success',
      msg: `No posts found`,
    })
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    posts,
    count: posts.length,
  })
}

// @desc      Get single post
// @route     GET /api/v1/posts/:slug
// @access    Public
const getPost = async (req, res) => {
  const slug = req.params.slug
  const post = await Post.findOne({
    where: { slug },
    include: 'user',
    //include: [{ model: 'user', attributes: ['name'] }],
  })

  if (!post) throw new CustomApiError.NotFoundError(`Post ${slug} not found`)

  res.status(StatusCodes.OK).json({
    status: 'success',
    post,
  })
}

// @desc      Create post
// @route     POST /api/v1/posts
// @access    Private
const createPost = async (req, res) => {
  const { userSlug, title, body } = req.body
  const user = await User.findOne({ where: { slug: userSlug } })
  const post = await Post.create({
    title,
    body,
    userId: user.id,
  })

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    post,
  })
}

// @desc      Update post
// @route     PUT /api/v1/posts/:slug
// @access    Private
const updatePost = async (req, res) => {
  const slug = req.params.slug
  const { title, body } = req.body
  const post = await Post.findOne({ where: { slug } })

  if (!post) throw new CustomApiError.NotFoundError(`Post ${slug} not found`)

  post.title = title
  post.body = body

  await post.save()

  res.status(StatusCodes.OK).json({
    status: 'success',
    post,
  })
}

// @desc      Delete single post
// @route     DELETE /api/v1/posts/:slug
// @access    Private
const deletePost = async (req, res) => {
  const slug = req.params.slug
  const post = await Post.findOne({ where: { slug } })

  if (!post) throw new CustomApiError.NotFoundError(`Post ${slug} not found`)

  await post.destroy()
  res.status(StatusCodes.NO_CONTENT).send()
}

// @desc      Get posts by user
// @route     GET /api/v1/posts/:slug/posts
// @access    Public
const getUserPosts = async (req, res) => {
  const slug = req.params.slug
  const user = await User.findOne({ where: { slug }, include: 'posts' })
  const userPosts = user.posts

  if (userPosts.length < 1) {
    return res.status(StatusCodes.OK).json({
      status: 'success',
      msg: `User ${slug} not have a posts`,
    })
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    user: user.name,
    userPosts,
    count: userPosts.length,
  })
}

module.exports = {
  createPost,
  getPost,
  getAllPosts,
  getUserPosts,
  deletePost,
  updatePost,
}
