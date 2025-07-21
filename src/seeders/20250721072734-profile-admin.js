/* eslint-disable no-unused-vars */
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("profiles", [
      {
        id: 1,
        id_user: 1,
        name: "Admin",
        phone_number: "081234567890",
        profile_picture: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("profiles", { id_user: 1 }, {});
  },
};
