const express = require('express')
const router = express.Router()

const {
  authenticateUser,
  authorizePermissions,
} = require('../middlewares/auth')

const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  updateUserRole,
  deleteUser,
  showCurrentUser,
} = require('../controllers/user')

router.use(authenticateUser)

router.route('/show-me').get(showCurrentUser)
router
  .route('/')
  .get(authorizePermissions('admin', 'moderator'), getAllUsers)
  .post(authorizePermissions('admin', 'moderator'), createUser)
router
  .route('/:slug')
  .get(getUser)
  .put(updateUser)
  .patch(authorizePermissions('admin'), updateUserRole)
  .delete(deleteUser)

module.exports = router
