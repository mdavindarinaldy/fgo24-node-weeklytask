const {constants: http} = require("http2");
const {createUser, login, isExist} = require("../models/users.model");

exports.login = function(req, res){
  const {email, password} = req.body;
  const {success, message} = login(email, password);
  if (success) {
    return res.status(http.HTTP_STATUS_OK).json({
      success: success,
      message: message
    });
  } else {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: success,
      message: message
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
      results: responseUser
    });
  } else {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Email sudah digunakan"
    });
  }
};