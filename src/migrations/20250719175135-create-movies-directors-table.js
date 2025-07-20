"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("movies_directors", {
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
      id_director: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "directors",
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
    await queryInterface.addConstraint("movies_directors", {
      fields: ["id_movie", "id_director"],
      type: "primary key",
      name: "pk_movies_directors",
    });
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("movies_directors");
  }
};
