'use strict'
const { SequelizeSlugify } = require('sequelize-slugify')
const { Model } = require('sequelize')
const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate({ Post }) {
      // define association here
      this.hasMany(Post, { foreignKey: 'userId', as: 'posts' })
    }

    // fields to not return
    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        password: undefined,
        resetPasswordToken: undefined,
        email: undefined,
      }
    }
  }

  User.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      slug: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'User must have a name' },
          len: {
            args: [2, 32],
            msg: 'Name must have 2 - 32 caracters.',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'User must have a password' },
          len: {
            args: [6, 255],
            msg: 'The password length should be min 6 characters.',
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'User must have a email' },
          isEmail: { msg: 'Must be a valid email address' },
        },
      },
      role: {
        type: DataTypes.ENUM('admin', 'user', 'moderator'),
        defaultValue: 'user',
        allowNull: false,
        validate: {
          notNull: { msg: 'User must have a role' },
          isIn: {
            args: [['admin', 'moderator', 'user']],
            msg: 'Role must be admin, moderator or user',
          },
        },
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
    },
    {
      sequelize,
      tableName: 'users',
      modelName: 'User',
    }
  )

  SequelizeSlugify.slugifyModel(User, {
    source: ['name'],
    overwrite: false,
  })

  User.beforeSave(user => {
    if (user.changed('password')) {
      user.password = bcrypt.hashSync(
        user.password,
        bcrypt.genSaltSync(10),
        null
      )
    }
  })

  User.prototype.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
  }

  return User
}
