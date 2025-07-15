const {constants: http} = require("http2");
const { deleteUser, getAllUsers, getUser } = require("../models/users.model");

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

exports.getUser = function(req, res) {
  const {id} = req.params;
  const {success, message, user} = getUser(id);
  const responseUser = {id:user.id, email:user.email};
  if (success) {
    res.status(http.HTTP_STATUS_OK).json({
      success: success,
      message: message,
      results: responseUser,
    });
  } else {
    res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: success,
      message: message,
    });
  }
};

exports.getAllUser = function(_req, res) {
  const {success, message, users} = getAllUsers();
  const responseUsers = users.map((item)=> item={id:item.id,email: item.email});
  if (success) {
    res.status(http.HTTP_STATUS_OK).json({
      success: success,
      message: message,
      results: responseUsers,
    });
  } else {
    res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: success,
      message: message,
    });
  }
};