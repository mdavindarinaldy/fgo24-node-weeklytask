let users = [
  {
    id:1,
    email:"huhu@gmail.com",
    password:"yahu"
  }, {
    id:2,
    email:"haha@gmail.com",
    password:"yahu"
  }, {
    id:3,
    email:"yuyu@gmail.com",
    password:"yahu"
  }, {
    id:4,
    email:"yahu@gmail.com",
    password:"yahu"
  }, {
    id:5,
    email:"enom@gmail.com",
    password:"yahu"
  }, {
    id:6,
    email:"hihi@gmail.com",
    password:"yahu"
  }, {
    id:7,
    email:"dini@gmail.com",
    password:"yahu"
  }, {
    id:8,
    email:"dana@gmail.com",
    password:"yahu"
  }, {
    id:9,
    email:"runmi@gmail.com",
    password:"yahu"
  }, {
    id:10,
    email:"dino@gmail.com",
    password:"yahu"
  }
];

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

exports.getUserByEmail = function(email, password) {
  const user = users.find((item)=> item.email === email);
  if (user.password === password) {
    return {result:true, user};
  } else if (user.password !== password) {
    return {result:false};
  } 
};

exports.getUserById = function(id){
  let userIndex = users.findIndex((item)=>item.id === parseInt(id));
  if (userIndex !==-1) {
    return {result:true, userIndex, user: users[userIndex]};
  } else {
    return {result:false};
  }
};

exports.getAllUsers = function(search){
  return users.filter((item)=>item.email.includes(search));
};

exports.updateUser = function(userIndex, newData){
  users[userIndex] = {...users[userIndex], ...newData};
  return users[userIndex];
};

exports.deleteUser = function(index){
  let deletedUser = users.splice(index, 1);
  return deletedUser;
};