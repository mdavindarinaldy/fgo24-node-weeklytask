const {constants: http} = require("http2");
const userModel = require("../models/users.model");
const { validationResult } = require("express-validator");

exports.login = function(req, res){
  const {email, password} = req.body;

  const validate = validationResult(req);

  if (!validate.isEmpty()) {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Validation error",
      errors: validate.array(),
    });
  }

  if(userModel.isExist(email)) {
    const {result, user} = userModel.getUserByEmail(email, password);
    const responseUser = {id: user.id, email: user.email};
    if (result) {
      return res.status(http.HTTP_STATUS_OK).json({
        success: true,
        message: "Berhasil login",
        result: responseUser
      });
    } else {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Password salah",
      });
    }
  } else {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Email tidak terdaftar"
    });
  }
};

exports.register = function(req, res) {
  const {email, password} = req.body;
  const filename = req.file ? req.file.filename : null;

  if (!userModel.isExist(email)) {
    const user = userModel.createUser(email, password, filename);
    const responseUser = {id:user.id, email:user.email, profilePicture:user.profilePicture};
    return res.status(http.HTTP_STATUS_CREATED).json({
      success: true,
      message: "User berhasil melakukan registrasi",
      result: responseUser
    });
  } else {
    return res.status(http.HTTP_STATUS_CONFLICT).json({
      success: false,
      message: "Email sudah digunakan"
    });
  }
};