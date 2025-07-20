"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Showtimes extends Model {
    static associate(models) {
      Showtimes.belongsTo(models.Movies, {
        foreignKey: "id_movie",
      });

      Showtimes.hasMany(models.Transactions_Detail, {
        foreignKey: "id_showtime",
      });
    }
  }

  Showtimes.init(
    {
      id_movie: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "movies",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cinema: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      showtime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Showtimes",
      tableName: "showtimes",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
      underscored: true,
    }
  );

  return Showtimes;
};
