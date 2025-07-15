let users = [];
let success;
let message;

exports.isExist = function(email) {
  return users.some((item)=> item.email === email);
};

exports.createUser = function(email, password) {
  let userId;
  if (users.length > 0) {
    userId = users[users.length-1].id+1;
  } else {
    userId = 1;
  }
  let user = {id: userId, email: email, password: password};
  users = [...users, user];
  return user;
};

exports.login = function(email, password) {
  if (users.length > 0) {
    const user = users.find((item)=> item.email === email);
    if (user) {
      if (user.password === password) {
        success = true;
        message = "Login berhasil";
        return {success, message};
      } else if (user.password !== password) {
        success = false;
        message = "Password salah!";
        return {success, message};
      } 
    } else {
      success = false;
      message = "Email tidak terdaftar!";
      return {success, message};
    }
  } else {
    success = false;
    message = "Belum ada user yang terdaftar";
    return {success, message};
  }
};

exports.updateUser = function(id, newData){
  const userIndex = users.findIndex((item)=>item.id === parseInt(id));
  if (userIndex===-1) {
    success = false;
    message = "Tidak ada user yang ditemukan";
    return {success, message};
  } else {
    users[userIndex] = {...users[userIndex], ...newData};
    success = true;
    message = "Berhasil melakukan perubahan data";
    return {success, message, user: users[userIndex]};
  }
};

exports.deleteUser = function(id){
  let index = users.findIndex((item)=>item.id === parseInt(id));
  if (index===-1) {
    success = false;
    message = "Tidak ada user yang ditemukan";
    return {success, message};
  } else {
    let deletedUser = users.splice(index, 1);
    success = true;
    message = "Berhasil menghapus user";
    return {success, message, deletedUser};
  }
};

exports.getAllUsers = function(){
  if (users.length > 0) {
    success = true;
    message = "Berhasil mendapatkan semua user";
    return {success, message, users};
  } else {
    success = false;
    message = "Belum ada user yang terdaftar";
    return {success, message};
  }
};

exports.getUser = function(id){
  let user = users.find((item)=>item.id === parseInt(id));
  if (user) {
    success = true;
    message = "Berhasil mendapatkan detail user";
    return {success, message, user};
  } else {
    success = false;
    message = "User tidak ditemukan";
    return {success, message};
  }
};