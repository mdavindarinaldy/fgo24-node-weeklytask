const {constants: http} = require("http2");
const {sequelize, User, Profile} = require("../models");
const { generateToken } = require("../utils/generateToken");
const argon2 = require("argon2");

exports.login = async function(req, res){
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Login failed",
        errors: "email is not registered",
      });
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Login failed",
        errors: "password is incorrect",
      });
    }
    const profile = await Profile.findOne({ where: { id_user: user.id } });
    const token = generateToken({ id: user.id, role: user.role });

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Login success!",
      result: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: profile?.name || null,
          phoneNumber: profile?.phone_number || null,
        },
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.register = async function(req, res) {
  const { name, email, phoneNumber, password } = req.body;
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

    return res.status(http.HTTP_STATUS_CREATED).json({
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

      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Failed to register user",
        errors: errorMsg,
      });
    }

    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
};