"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("movies_casts", {
      id_cast: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "casts",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      id_movie: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "movies",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addConstraint("movies_casts", {
      fields: ["id_cast", "id_movie"],
      type: "primary key",
      name: "pk_movies_casts",
    });
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("movies_casts");
  },
};
