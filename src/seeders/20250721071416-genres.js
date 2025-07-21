/* eslint-disable no-unused-vars */
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("genres", [
      {
        id: 1,
        name: "Action",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: "Drama",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name: "Comedy",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        name: "Thriller",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        name: "Sci-Fi",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 6,
        name: "Fantasy",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("genres", null, {});
  },
};
