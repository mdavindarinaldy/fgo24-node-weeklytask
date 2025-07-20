"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("movies_genres", {
      id_genre: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "genres",
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

    // Composite primary key
    await queryInterface.addConstraint("movies_genres", {
      fields: ["id_genre", "id_movie"],
      type: "primary key",
      name: "pk_movies_genres",
    });
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("movies_genres");
  },
};
