/* eslint-disable no-unused-vars */
"use strict";
const argon2 = require("argon2");
require("dotenv").config();

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await argon2.hash(process.env.ADMIN_PASS);

    await queryInterface.bulkInsert("users", [
      {
        id: 1,
        email: "admin@mail.com",
        password: hashedPassword,
        role: "admin",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", { id: 1 }, {});
  },
};
