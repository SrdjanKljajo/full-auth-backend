const createTokenUser = user => {
  return {
    name: user.name,
    userId: user.uuid,
    email: user.email,
    slug: user.slug,
    role: user.role,
  }
}

module.exports = createTokenUser
