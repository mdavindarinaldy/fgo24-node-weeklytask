const {constants: http} = require("http2");
const { deleteUser, getAllUsers, getUser, updateUser, isExist } = require("../models/users.model");

exports.getUser = function(req, res) {
  const {id} = req.params;
  const {result, user} = getUser(id);
  if (result) {
    const responseUser = {id:user.id, email:user.email};
    res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Berhasil mendapatkan user",
      results: responseUser,
    });
  } else {
    res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "User tidak ditemukan",
    });
  }
};

exports.getAllUser = function(_req, res) {
  const users = getAllUsers();
  let message;
  if (users.length>0) {message="Berhasil mendapatkan daftar users";}
  else {message="Beluma ada user yang terdaftar";}
  const responseUsers = users?.map((item)=> item={id:item.id,email: item.email});
  res.status(http.HTTP_STATUS_OK).json({
    success: true,
    message: message,
    results: responseUsers,
  });
};

exports.updateUser = function(req, res) {
  const {id} = req.params;
  const newData = req.body;
  const {result, userIndex} = getUser(id);
  if (result) {
    if (!isExist(newData.email)) {
      const user = updateUser(userIndex, newData);
      res.status(http.HTTP_STATUS_OK).json({
        success: true,
        message: "Berhasil melakukan update data",
        results: user,
      });
    } else {
      res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Email sudah digunakan oleh user lain",
      });
    }
  } else {
    res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "User tidak ditemukan",
    });
  }
};

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