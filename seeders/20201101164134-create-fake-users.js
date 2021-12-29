'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          uuid: '18f9b500-8b9e-4266-b2dd-7ddc048d226a',
          slug: 'test',
          name: 'Test',
          password: 'test1234',
          email: 'test@gmail.com',
          role: 'admin',
          createdAt: '2021-12-22T11:10:13.294Z',
          updatedAt: '2021-12-22T11:10:13.294Z',
        },
        {
          uuid: '18f9b500-8b9e-4266-b2dd-7ddc048d226b',
          slug: 'test-1',
          name: 'Test jedan',
          password: 'test1234',
          email: 'test1@gmail.com',
          role: 'moderator',
          createdAt: '2021-12-22T11:10:13.294Z',
          updatedAt: '2021-12-22T11:10:13.294Z',
        },
        {
          uuid: '18f9b500-8b9e-4266-b2dd-7ddc048d226c',
          slug: 'test-2',
          name: 'Test dva',
          password: 'test1234',
          email: 'test2@gmail.com',
          role: 'user',
          createdAt: '2021-12-22T11:10:13.294Z',
          updatedAt: '2021-12-22T11:10:13.294Z',
        },
        {
          uuid: '18f9b500-8b9e-4266-b2dd-7ddc048d226d',
          slug: 'test-3',
          name: 'Test tri',
          password: 'test1234',
          email: 'test3@gmail.com',
          role: 'user',
          createdAt: '2021-12-22T11:10:13.294Z',
          updatedAt: '2021-12-22T11:10:13.294Z',
        },
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {})
  },
}
