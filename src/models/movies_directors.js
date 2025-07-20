"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Movies_Directors extends Model {
    static associate(models) {
      Movies_Directors.belongsTo(models.Movies, {
        foreignKey: "id_movie",
      });
      Movies_Directors.belongsTo(models.Directors, {
        foreignKey: "id_director",
      });
    }
  }

  Movies_Directors.init(
    {
      id_movie: DataTypes.INTEGER,
      id_director: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Movies_Directors",
      tableName: "movies_directors",
      timestamps: false,
    }
  );

  return Movies_Directors;
};
