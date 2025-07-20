const {constants: http} = require("http2");
const {sequelize, User, Profile} = require("../models");
const { validationResult } = require("express-validator");
const argon2 = require("argon2");

exports.login = async function(req, res){
  const {email, password} = req.body;
  const validate = validationResult(req);
  if (!validate.isEmpty()) {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Validation error",
      errors: validate.array(),
    });
  }

  const found = await User.findOne({where: {email:email, password:password}});
  if(found) {
    const responseUser = {id: found.id, email: found.email, picture: found.picture};
    return res.status(http.HTTP_STATUS_OK).json({
        success: true,
        message: "Berhasil login",
        result: responseUser
    });
  } else {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Email atau password salah",
    });
  }
};

exports.register = async function(req, res) {
  const { name, email, phoneNumber, password, confPass } = req.body;
  if (!name || !email || !phoneNumber || !password || !confPass) {
    return res.status(400).json({
      success: false,
      message: "Failed to register user",
      errors: "user data should not be empty",
    });
  }

  if (password !== confPass) {
    return res.status(400).json({
      success: false,
      message: "Failed to register user",
      errors: "password and confirm password doesn't match",
    });
  }

  try {
    const hashedPassword = await argon2.hash(password);
    await sequelize.transaction(async (t) => {
      const user = await User.create({
        email,
        password: hashedPassword,
        role: "user",
        created_at: new Date(),
      }, { transaction: t });

      await Profile.create({
        id_user: user.id,
        name,
        phone_number: phoneNumber,
        created_at: new Date(),
      }, { transaction: t });

      return user;
    });

    return res.status(201).json({
      success: true,
      message: "Create user success!",
      result: {
        name,
        email,
        phoneNumber,
      }
    });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      const errorMsg = err.errors[0].message.includes("email")
        ? "email already used by another user"
        : "phone number already used by another user";

      return res.status(400).json({
        success: false,
        message: "Failed to register user",
        errors: errorMsg,
      });
    }

    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};