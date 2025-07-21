/* eslint-disable no-unused-vars */
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert("movies_directors", [
      { id_movie: 1, id_director: 1, created_at: now },
      { id_movie: 2, id_director: 2, created_at: now },
      { id_movie: 3, id_director: 1, created_at: now },
      { id_movie: 4, id_director: 4, created_at: now },
      { id_movie: 5, id_director: 5, created_at: now },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("movies_directors", null, {});
  },
};
