'use strict'
const { SequelizeSlugify } = require('sequelize-slugify')
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      // userId
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' })
    }

    toJSON() {
      return { ...this.get(), id: undefined, userId: undefined }
    }
  }

  Post.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Post must have a title' },
          len: {
            args: [2, 100],
            msg: 'Title must have 2 - 100 caracters.',
          },
        },
      },
      slug: {
        type: DataTypes.STRING,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: 'Post must have a body' },
          len: {
            args: [10, 1000],
            msg: 'Post must have 10 - 1000 caracters.',
          },
        },
      },
    },
    {
      sequelize,
      tableName: 'posts',
      modelName: 'Post',
    }
  )

  SequelizeSlugify.slugifyModel(Post, {
    source: ['title'],
    overwrite: false,
  })

  return Post
}
