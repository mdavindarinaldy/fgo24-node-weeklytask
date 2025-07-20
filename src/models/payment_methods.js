"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Payment_Methods extends Model {
    static associate(models) {
      Payment_Methods.hasMany(models.Transactions, {
        foreignKey: "id_payment_method",
      });
    }
  }

  Payment_Methods.init(
    {
      name: DataTypes.STRING,
      logo: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Payment_Methods",
      tableName: "payment_methods",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Payment_Methods;
};
