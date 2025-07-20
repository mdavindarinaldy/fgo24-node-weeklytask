const {constants: http} = require("http2");
const {User, Profile, sequelize} = require("../models");
const fs = require("fs");
const path = require("path");
const argon2 = require("argon2");

exports.getUser = async function(req, res) {
  try {
    const userId = req.userId;
    const user = await User.findByPk(userId, {
      include: {
        model: Profile,
        attributes: ["name", "phone_number", "profile_picture"],
      },
      attributes: ["email", "role"],
    });

    if (!user || !user.Profile) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Success to get user's profile",
      result: {
        email: user.email,
        role: user.role,
        name: user.Profile.name,
        phone_number: user.Profile.phone_number,
        profile_picture: user.Profile.profile_picture,
      },
    });
  } catch(err) {
    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.updateUser = async function(req, res) {
  const t = await sequelize.transaction();
  try {
    const id = req.userId;
    const newData = req.body;
    const filename = req.file ? req.file.filename : null;

    const user = await User.findByPk(id, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!user) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    if (newData.email && newData.email !== user.email) {
      const found = await User.findOne({ where: { email: newData.email } });
      if (found) {
        return res.status(http.HTTP_STATUS_CONFLICT).json({
          success: false,
          message: "Email has been used by other user",
        });
      }
    }

    let hashedPassword = null;
    if (newData.password && newData.password.trim() !== "") {
      hashedPassword = await argon2.hash(newData.password);
    }

    const profile = await Profile.findOne({
      where: { id_user: id },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (filename && profile?.profile_picture) {
      const oldPath = path.join("uploads", "profile-picture", profile.profile_picture);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await User.update(
      {
        email: newData.email || user.email,
        password: hashedPassword || user.password,
        updated_at: new Date(),
      },
      { where: { id }, transaction: t }
    );
    if (profile) {
      await Profile.update(
        {
          name: newData.name || profile.name,
          phone_number: newData.phone_number || profile.phone_number,
          profile_picture: filename || profile.profile_picture,
          updated_at: new Date(),
        },
        { where: { id_user: id }, transaction: t }
      );
    }
    await t.commit();

    const updatedUser = await User.findByPk(id, {
      include: Profile,
    });

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Successful to update user's data",
      results: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.Profile.name,
        phone_number: updatedUser.Profile.phone_number,
        profile_picture: updatedUser.Profile.profile_picture,
      },
    });
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to update user's data",
    });
  }
};

exports.confirmPassword = async function(req, res) {
  try {
    const userId = req.userId;
    const { password } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: "User not found",
        result: false,
      });
    }

    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Wrong password",
        result: false,
      });
    }

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Password is confirmed",
      result: true,
    });
  } catch(err) {
    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      result: false,
    });
  }
};