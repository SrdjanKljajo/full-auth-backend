'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'posts',
      [
        {
          uuid: '18f9b500-8b9e-4266-b2dd-7ddc048d2261',
          slug: 'post-jedan',
          title: 'Post jedan',
          body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions ',
          userId: 1,
          createdAt: '2021-12-22T11:10:13.294Z',
          updatedAt: '2021-12-22T11:10:13.294Z',
        },
        {
          uuid: '18f9b500-8b9e-4266-b2dd-7ddc048d2262',
          slug: 'post-dva',
          title: 'Post dva',
          body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions ',
          userId: 1,
          createdAt: '2021-12-22T11:10:13.294Z',
          updatedAt: '2021-12-22T11:10:13.294Z',
        },
        {
          uuid: '18f9b500-8b9e-4266-b2dd-7ddc048d2263',
          slug: 'post-tri',
          title: 'Post tri',
          body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions ',
          userId: 2,
          createdAt: '2021-12-22T11:10:13.294Z',
          updatedAt: '2021-12-22T11:10:13.294Z',
        },
        {
          uuid: '18f9b500-8b9e-4266-b2dd-7ddc048d2264',
          slug: 'post-cetiri',
          title: 'Post četiri',
          body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions ',
          userId: 3,
          createdAt: '2021-12-22T11:10:13.294Z',
          updatedAt: '2021-12-22T11:10:13.294Z',
        },
        {
          uuid: '18f9b500-8b9e-4266-b2dd-7ddc048d2265',
          slug: 'post-pet',
          title: 'Post pet',
          body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions ',
          userId: 4,
          createdAt: '2021-12-22T11:10:13.294Z',
          updatedAt: '2021-12-22T11:10:13.294Z',
        },
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('posts', null, {})
  },
}
