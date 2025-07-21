/* eslint-disable no-unused-vars */
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("directors", [
      {
        id: 1,
        name: "Christopher Nolan",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: "Greta Gerwig",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name: "James Cameron",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        name: "Denis Villeneuve",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        name: "Bong Joon-ho",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("directors", null, {});
  },
};
