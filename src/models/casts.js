"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Cast extends Model {
    static associate(models) {
      Cast.belongsToMany(models.Movie, {
        through: "movies_casts",
        foreignKey: "id_cast",
        otherKey: "id_movie",
      });
    }
  }

  Cast.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Cast",
      tableName: "casts",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Cast;
};