const {checkSchema} = require("express-validator");

exports.login = checkSchema({
  email:{
    isEmail:true,
    errorMessage: "Email not valid",
  },
  password:{
    notEmpty: true,
    errorMessage: "Password cannot be empty",
  },
}, ["body"]);