let users = [];
let success;
let message;

exports.createUser = function(email, password) {
  if (users.length > 0) {
    let userId = users[users.length-1].id+1;
    let user = {id: userId, email: email, password: password};
    if (users.some((item)=>user.email === item.email)) {
      success = false;
      message = "Email is already registered";
      return {success, message};
    } else {
      users = [...users, user];
      success = true;
      message = "Success register user";
      return {success, message};
    }
  } else {
    let userId = users.length + 1;
    let user = {id: userId, email: email, password: password};
    users = [...users, user];
    success = true;
    message = "Success register user";
    return {success, message};
  }
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

exports.updateUser = function(){

};

exports.deleteUser = function(id){
  let index = users.findIndex((item)=>item.id === parseInt(id));
  if (index===-1) {
    success = false;
    message = "Tidak ada user dengan email tersebut!";
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

exports.getUser = function(){

};