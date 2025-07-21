/* eslint-disable no-unused-vars */
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert("movies_casts", [
      { id_movie: 1, id_cast: 1, created_at: now },
      { id_movie: 1, id_cast: 2, created_at: now },
      { id_movie: 1, id_cast: 3, created_at: now },
      { id_movie: 1, id_cast: 4, created_at: now },
      { id_movie: 1, id_cast: 5, created_at: now },

      { id_movie: 2, id_cast: 3, created_at: now },
      { id_movie: 2, id_cast: 5, created_at: now },
      { id_movie: 2, id_cast: 1, created_at: now },
      { id_movie: 2, id_cast: 6, created_at: now },
      { id_movie: 2, id_cast: 10, created_at: now },

      { id_movie: 3, id_cast: 2, created_at: now },
      { id_movie: 3, id_cast: 6, created_at: now },
      { id_movie: 3, id_cast: 4, created_at: now },
      { id_movie: 3, id_cast: 10, created_at: now },
      { id_movie: 3, id_cast: 5, created_at: now },

      { id_movie: 4, id_cast: 4, created_at: now },
      { id_movie: 4, id_cast: 6, created_at: now },
      { id_movie: 4, id_cast: 3, created_at: now },
      { id_movie: 4, id_cast: 5, created_at: now },
      { id_movie: 4, id_cast: 7, created_at: now },

      { id_movie: 5, id_cast: 8, created_at: now },
      { id_movie: 5, id_cast: 3, created_at: now },
      { id_movie: 5, id_cast: 7, created_at: now },
      { id_movie: 5, id_cast: 10, created_at: now },
      { id_movie: 5, id_cast: 5, created_at: now },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("movies_casts", null, {});
  },
};
