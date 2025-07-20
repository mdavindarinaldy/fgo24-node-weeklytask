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
        through: models.Movies_Genres,
        foreignKey: "id_movie",
        otherKey: "id_genre",
        as: "genres",
        timestamps: false
      });

      Movie.belongsToMany(models.Director, {
        through: models.Movies_Directors,
        foreignKey: "id_movie",
        otherKey: "id_director",
        as: "directors",
        timestamps: false
      });

      Movie.belongsToMany(models.Cast, {
        through: models.Movies_Casts,
        foreignKey: "id_movie",
        otherKey: "id_cast",
        as: "casts",
        timestamps: false
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
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
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
