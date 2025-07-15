const {constants: http} = require("http2");
const { deleteUser, getAllUsers, updateUser, isExist, getUserById } = require("../models/users.model");

exports.getUser = function(req, res) {
  const {id} = req.params;
  const {result, user} = getUserById(id);
  if (result) {
    const responseUser = {id:user.id, email:user.email};
    res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Berhasil mendapatkan user",
      results: responseUser,
    });
  } else {
    res.status(http.HTTP_STATUS_NOT_FOUND).json({
      success: false,
      message: "User tidak ditemukan",
    });
  }
};

exports.getAllUser = function(req, res) {
  let search = req.query.search;
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);
  if (!search) {search="";}
  if (!page) {page=1;}
  if (!limit) {limit=5;}

  const filteredUsers = getAllUsers(search.toLowerCase());

  const totalData = filteredUsers.length;
  const totalPage = Math.ceil(totalData/limit);
  if (page>totalPage) { page=totalPage; }

  const startIndex = (page - 1) * limit;
  const lastIndex = (page * limit); 

  const slicedUsers = filteredUsers.slice(startIndex, lastIndex);

  const pageInfo = {
    totalPage: totalPage,
    currentPage: page,
    item: "Showing "+slicedUsers.length+" Of "+totalData, 
  };

  let message;
  if (slicedUsers.length>0) {
    message="Berhasil mendapatkan daftar user";
    const responseUsers = slicedUsers?.map((item)=> item={id:item.id,email: item.email});
    res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: message,
      pageInfo: pageInfo,
      results: responseUsers,
    });
  }
  else {
    message="Tidak ada user yang ditemukan";
    res.status(http.HTTP_STATUS_NOT_FOUND).json({
      success: true,
      message: message,
    });
  }
};

exports.updateUser = function(req, res) {
  const {id} = req.params;
  const newData = req.body;
  const {result, userIndex} = getUserById(id);
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
    res.status(http.HTTP_STATUS_NOT_FOUND).json({
      success: false,
      message: "User tidak ditemukan",
    });
  }
};

exports.deleteUser = function(req, res) {
  const {id} = req.params;
  const {result, userIndex} = getUserById(id);
  if (result) {
    const deletedUser = deleteUser(userIndex);
    res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Berhasil menghapus user",
      results: {
        id: deletedUser[0].id,
        email: deletedUser[0].email
      }
    });
  } else {
    res.status(http.HTTP_STATUS_NOT_FOUND).json({
      success: false,
      message: "User tidak ditemukan",
    });
  }
};