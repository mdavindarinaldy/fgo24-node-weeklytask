"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    static associate(models) {
      Movie.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });

      Movie.belongsToMany(models.Genre, {
        through: "movies_genres",
        foreignKey: "id_movie",
        otherKey: "id_genre",
        as: "genres",
      });

      Movie.belongsToMany(models.Director, {
        through: "movies_directors",
        foreignKey: "id_movie",
        otherKey: "id_director",
        as: "directors",
      });

      Movie.belongsToMany(models.Cast, {
        through: "movies_casts",
        foreignKey: "id_movie",
        otherKey: "id_cast",
        as: "casts",
      });

      Movie.hasMany(models.Showtimes, {
        foreignKey: "id_movie",
        as: "showtimes",
      });
    }
  }

  Movie.init(
    {
      title: DataTypes.STRING,
      synopsis: DataTypes.TEXT,
      release_date: DataTypes.DATEONLY,
      price: DataTypes.DECIMAL(10, 2),
      runtime: DataTypes.INTEGER,
      poster: DataTypes.STRING,
      backdrop: DataTypes.STRING,
      created_by: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Movie",
      tableName: "movies",
      timestamps: false,
      underscored: true,
    }
  );

  return Movie;
};
