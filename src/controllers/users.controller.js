const {constants: http} = require("http2");
const {User, Sequelize, Profile, sequelize} = require("../models");
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
  const t = await sequelize.transaction();
  try {
    const id = req.userId;
    const newData = req.body;
    const filename = req.file ? req.file.filename : null;

    const user = await User.findByPk(id, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!user) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    if (newData.email && newData.email !== user.email) {
      const found = await User.findOne({ where: { email: newData.email } });
      if (found) {
        return res.status(http.HTTP_STATUS_CONFLICT).json({
          success: false,
          message: "Email has been used by other user",
        });
      }
    }

    const profile = await Profile.findOne({
      where: { id_user: id },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (filename && profile?.profile_picture) {
      const oldPath = path.join("uploads", "profile-picture", profile.profile_picture);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await User.update(
      {
        email: newData.email || user.email,
        updated_at: new Date(),
      },
      { where: { id }, transaction: t }
    );
    if (profile) {
      await Profile.update(
        {
          name: newData.name || profile.name,
          phone_number: newData.phone_number || profile.phone_number,
          profile_picture: filename || profile.profile_picture,
          updated_at: new Date(),
        },
        { where: { id_user: id }, transaction: t }
      );
    }
    await t.commit();

    const updatedUser = await User.findByPk(id, {
      include: Profile,
    });

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Successful to update user's data",
      results: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.Profile.name,
        phone_number: updatedUser.Profile.phone_number,
        profile_picture: updatedUser.Profile.profile_picture,
      },
    });
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to update user's data",
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