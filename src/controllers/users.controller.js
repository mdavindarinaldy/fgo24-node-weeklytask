const {constants: http} = require("http2");
const {User, Sequelize} = require("../models");
const fs = require("fs");
const path = require("path");

exports.getUser = async function(req, res) {
  const {id} = req.params;
  const user = await User.findByPk(parseInt(id));
  if (user) {
    const responseUser = {id:user.id, email:user.email, picture: user.picture};
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

exports.getAllUser = async function(req, res) {
  let search = req.query.search;
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);
  if (!search) {search="";} else {search=search.toLowerCase();}
  if (!page) {page=1;}
  if (!limit) {limit=5;}

  const {count, rows} = await User.findAndCountAll({
    where: {
      email: {
        [Sequelize.Op.iLike]: "%"+search+"%"
      }
    }
  });

  const totalPage = Math.ceil(count/limit);
  if (page>totalPage) { page=totalPage; }

  const startIndex = (page - 1) * limit;
  const lastIndex = (page * limit); 

  const slicedUsers = rows.slice(startIndex, lastIndex);
  let nextLink, prevLink;
  if (page < totalPage) {
    nextLink = "localhost:8080/users?search="+search+"&page="+(page+1)+"&limit="+limit;
  } else { nextLink = null; }
  if (page > 1 ) {
    prevLink = "localhost:8080/users?search="+search+"&page="+(page-1)+"&limit="+limit;
  } else { prevLink = null; }

  const pageInfo = {
    totalPage: totalPage,
    currentPage: page,
    item: "Showing "+slicedUsers.length+" Of "+count, 
    prevPage: prevLink,
    nextPage: nextLink,
  };

  let message;
  if (slicedUsers.length>0) {
    message="Berhasil mendapatkan daftar user";
    const responseUsers = slicedUsers?.map((item)=> item={id:item.id,email: item.email,picture:item.picture});
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

exports.updateUser = async function(req, res) {
  const {id} = req.params;
  const newData = req.body;
  const filename = req.file ? req.file.filename : null;
  const user = await User.findByPk(parseInt(id));
  if (user) {
    let found;
    if (newData.email !== user.email) {
      found = await User.findOne({where: {email:newData.email}});
    }
    if (!found) {
      let userUpdate;
      if (filename) {
        if (user.picture) {
          const filePath = path.join("uploads", "profile-picture", user.picture);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        userUpdate = await User.update(
          {
            ...newData,
            picture:filename
          },
          {
            where: {
            id: parseInt(id),
            },
            returning: true,
          }
        );
      }
      else {
        userUpdate = await User.update(
        {
          ...newData,
        },
        {
          where: {
            id: parseInt(id),
          },
          returning: true,
        });
      }
      userUpdate = userUpdate[1][0];
      const responseUser = {id:userUpdate.id,email:userUpdate.email,picture:userUpdate.picture};
      res.status(http.HTTP_STATUS_OK).json({
        success: true,
        message: "Berhasil melakukan update data",
        results: responseUser,
      });
    } else {
      res.status(http.HTTP_STATUS_CONFLICT).json({
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

exports.deleteUser = async function(req, res) {
  const {id} = req.params;
  const user = await User.findByPk(parseInt(id));
  if (user) {
    if (user.picture) {
      const filePath = path.join("uploads", "profile-picture", user.picture);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    await User.destroy({
      where: {
        id:parseInt(id)
      }
    });
    const responseUser = {id:user.id,email:user.email,picture:user.picture};
    res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Berhasil menghapus user",
      results: responseUser
    });
  } else {
    res.status(http.HTTP_STATUS_NOT_FOUND).json({
      success: false,
      message: "User tidak ditemukan",
    });
  }
};