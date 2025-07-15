const {constants: http} = require("http2");
const {createUser, isExist, getUserByEmail} = require("../models/users.model");

exports.login = function(req, res){
  const {email, password} = req.body;
  if(isExist(email)) {
    const {result, user} = getUserByEmail(email, password);
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
  if (!isExist(email)) {
    const user = createUser(email, password);
    const responseUser = {id:user.id,email:user.email};
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