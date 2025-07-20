"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Profiles, {
        foreignKey: "id_user",
      });
      User.hasMany(models.Transactions, {
        foreignKey: "id_user",
      });
    }
  }

  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: "User",
    tableName: "users",
    underscored: true,
    timestamps: false
  });

  return User;
};
