"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Transactions extends Model {
    static associate(models) {
      Transactions.belongsTo(models.User, {
        foreignKey: "id_user",
      });
      Transactions.belongsTo(models.Payment_Methods, {
        foreignKey: "id_payment_method",
      });
      Transactions.hasMany(models.Transaction_Detail, {
        foreignKey: "id_transaction",
      });
    }
  }

  Transactions.init(
    {
      id_user: DataTypes.INTEGER,
      id_payment_method: DataTypes.INTEGER,
      total_price: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "Transactions",
      tableName: "transactions",
      timestamps: false,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  return Transactions;
};
