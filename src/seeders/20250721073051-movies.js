/* eslint-disable no-unused-vars */
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert("movies", [
      {
        id: 1,
        created_by: 1,
        title: "Inception",
        synopsis: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
        release_date: "2010-07-16",
        price: 15000,
        runtime: 148,
        poster: "inception-poster.jpg",
        backdrop: "inception-backdrop.jpg",
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        created_by: 1,
        title: "Barbie",
        synopsis: "Barbie suffers a crisis that leads her to question her world and her existence.",
        release_date: "2023-07-21",
        price: 15000,
        runtime: 114,
        poster: "barbie-poster.jpg",
        backdrop: "barbie-backdrop.jpg",
        created_at: now,
        updated_at: now,
      },
      {
        id: 3,
        created_by: 1,
        title: "Oppenheimer",
        synopsis: "The story of J. Robert Oppenheimer and the development of the atomic bomb.",
        release_date: "2023-07-21",
        price: 15000,
        runtime: 180,
        poster: "oppenheimer-poster.jpg",
        backdrop: "oppenheimer-backdrop.jpg",
        created_at: now,
        updated_at: now,
      },
      {
        id: 4,
        created_by: 1,
        title: "Dune",
        synopsis: "Paul Atreides leads nomadic tribes in a battle to control the desert planet Arrakis.",
        release_date: "2021-10-22",
        price: 15000,
        runtime: 155,
        poster: "dune-poster.jpg",
        backdrop: "dune-backdrop.jpg",
        created_at: now,
        updated_at: now,
      },
      {
        id: 5,
        created_by: 1,
        title: "Parasite",
        synopsis: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
        release_date: "2019-05-30",
        price: 15000,
        runtime: 132,
        poster: "parasite-poster.jpg",
        backdrop: "parasite-backdrop.jpg",
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("movies", null, {});
  },
};
