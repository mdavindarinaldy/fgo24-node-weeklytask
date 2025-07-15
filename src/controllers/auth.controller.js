const {constants: http} = require("http2");
const {createUser, login} = require("../models/users.model");

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
  const {success, message} = createUser(email, password);
  if (success) {
    return res.status(http.HTTP_STATUS_CREATED).json({
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