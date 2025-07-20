"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Movies_Genres extends Model {
    static associate(models) {
      Movies_Genres.belongsTo(models.Movies, {
        foreignKey: "id_movie",
      });

      Movies_Genres.belongsTo(models.Genres, {
        foreignKey: "id_genre",
      });
    }
  }

  Movies_Genres.init(
    {
      id_movie: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Movies",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_genre: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Genres",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Movies_Genres",
      tableName: "movies_genres",
      timestamps: false,
      underscored: true,
    }
  );

  return Movies_Genres;
};
