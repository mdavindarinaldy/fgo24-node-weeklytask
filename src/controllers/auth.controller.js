const {constants: http} = require("http2");
const {User} = require("../models");
const { validationResult } = require("express-validator");

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
  const {email, password} = req.body;
  const filename = req.file ? req.file.filename : null;
  const found = await User.findOne({where: {email:email}});
  if (!found) {
    const user = await User.create({email: email, password: password, picture: filename});
    const responseUser = {id:user.id, email:user.email, picture:user.picture};
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