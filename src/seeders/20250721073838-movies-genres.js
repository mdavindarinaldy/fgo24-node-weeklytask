/* eslint-disable no-unused-vars */
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert("movies_genres", [
      { id_movie: 1, id_genre: 1, created_at: now },
      { id_movie: 1, id_genre: 5, created_at: now },

      { id_movie: 2, id_genre: 3, created_at: now },
      { id_movie: 2, id_genre: 6, created_at: now },

      { id_movie: 3, id_genre: 2, created_at: now },
      { id_movie: 3, id_genre: 4, created_at: now },

      { id_movie: 4, id_genre: 5, created_at: now },
      { id_movie: 4, id_genre: 1, created_at: now },

      { id_movie: 5, id_genre: 2, created_at: now },
      { id_movie: 5, id_genre: 4, created_at: now },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("movies_genres", null, {});
  },
};
