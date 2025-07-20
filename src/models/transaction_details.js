"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Transaction_Detail extends Model {
    static associate(models) {
      Transaction_Detail.belongsTo(models.Transactions, {
        foreignKey: "id_transaction",
      });
      Transaction_Detail.belongsTo(models.Showtimes, {
        foreignKey: "id_showtime",
      });
    }
  }

  Transaction_Detail.init(
    {
      id_transaction: DataTypes.INTEGER,
      id_showtime: DataTypes.INTEGER,
      seat: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Transaction_Detail",
      tableName: "transactions_detail",
      timestamps: false,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  return Transaction_Detail;
};
