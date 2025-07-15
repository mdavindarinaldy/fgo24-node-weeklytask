const {constants: http} = require("http2");
const { deleteUser, getAllUsers } = require("../models/users.model");

exports.deleteUser = function(req, res) {
  const {id} = req.params;
  const {success, message, deletedUser} = deleteUser(id);
  if (success) {
    res.status(http.HTTP_STATUS_OK).json({
      success: success,
      message: message,
      results: {
        id: deletedUser[0].id,
        email: deletedUser[0].email
      }
    });
  } else {
    res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: success,
      message: message,
    });
  }
};

exports.getAllUser = function(req, res) {
  const {success, message, users} = getAllUsers();
  if (success) {
    res.status(http.HTTP_STATUS_OK).json({
      success: success,
      message: message,
      results: users,
    });
  } else {
    res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: success,
      message: message,
    });
  }
};