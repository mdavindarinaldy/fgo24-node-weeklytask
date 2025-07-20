"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Movies_Casts extends Model {
    static associate(models) {
      Movies_Casts.belongsTo(models.Movie, {
        foreignKey: "id_movie",
      });
      Movies_Casts.belongsTo(models.Cast, {
        foreignKey: "id_cast",
      });
    }
  }

  Movies_Casts.init(
    {
      id_movie: DataTypes.INTEGER,
      id_cast: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Movies_Casts",
      tableName: "movies_casts",
      timestamps: false,
    }
  );

  return Movies_Casts;
};
