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
  const user = users.find((item)=> item.email === email);
  if (user.password === password) {
    return {result:true, user};
  } else if (user.password !== password) {
    return {result:false};
  } 
};

exports.getUser = function(id){
  let userIndex = users.findIndex((item)=>item.id === parseInt(id));
  if (userIndex !==-1) {
    return {result:true, userIndex, user: users[userIndex]};
  } else {
    return {result:false};
  }
};

exports.getAllUsers = function(){
  return users;
};

exports.updateUser = function(userIndex, newData){
  users[userIndex] = {...users[userIndex], ...newData};
  return users[userIndex];
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