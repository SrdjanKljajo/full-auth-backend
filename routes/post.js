const express = require('express')
const router = express.Router()

const {
  createPost,
  getAllPosts,
  getPost,
  deletePost,
  updatePost,
  getUserPosts,
} = require('../controllers/post')

const { authenticateUser } = require('../middlewares/auth')

router.route('/').get(getAllPosts).post(authenticateUser, createPost)
router
  .route('/:slug')
  .get(getPost)
  .put(authenticateUser, updatePost)
  .delete(authenticateUser, deletePost)
router.route('/:slug/posts').get(getUserPosts)

module.exports = router
