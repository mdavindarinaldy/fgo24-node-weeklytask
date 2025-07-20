"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    static associate(models) {
      Profile.belongsTo(models.User, { foreignKey: "id_user", onDelete: "CASCADE" });
    }
  }

  Profile.init({
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    profile_picture: {
      type: DataTypes.STRING
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: "Profile",
    tableName: "profiles",
    underscored: true,
    timestamps: false
  });

  return Profile;
};