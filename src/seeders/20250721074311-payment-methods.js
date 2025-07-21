/* eslint-disable no-unused-vars */
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert("payment_methods", [
      {
        id: 1,
        name: "Gopay",
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        name: "OVO",
        created_at: now,
        updated_at: now,
      },
      {
        id: 3,
        name: "Dana",
        created_at: now,
        updated_at: now,
      },
      {
        id: 4,
        name: "LinkAja",
        created_at: now,
        updated_at: now,
      },
      {
        id: 5,
        name: "BCA",
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("payment_methods", null, {});
  },
};
