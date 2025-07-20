"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("showtimes", "showtime", {
      type: Sequelize.TIME,
      allowNull: true,
    });
    await queryInterface.removeColumn("showtimes", "times");
    await queryInterface.changeColumn("showtimes", "showtime", {
      type: Sequelize.TIME,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("showtimes", "times", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });

    await queryInterface.removeColumn("showtimes", "showtime");
    await queryInterface.changeColumn("showtimes", "times", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
    });
  },
};
