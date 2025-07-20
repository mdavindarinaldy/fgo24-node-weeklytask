"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Genre extends Model {
    static associate(models) {
      Genre.belongsToMany(models.Movie, {
        through: "movies_genres",
        foreignKey: "id_genre",
        otherKey: "id_movie",
        as: "movies",
      });
    }
  }

  Genre.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Genre",
      tableName: "genres",
      timestamps: false,
      underscored: true,
    }
  );

  return Genre;
};
