"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Director extends Model {
    static associate(models) {
      Director.belongsToMany(models.Movie, {
        through: "movies_directors",
        foreignKey: "id_director",
        otherKey: "id_movie",
        as: "movies",
      });
    }
  }

  Director.init(
    {
      name: DataTypes.STRING,
      profile_picture: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Director",
      tableName: "directors",
      timestamps: true,
      underscored: true,
    }
  );

  return Director;
};