const { body } = require("express-validator");

exports.registerValidation = [
  body("name")
    .notEmpty().withMessage("Name is required"),
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email format is not valid"),
  body("phoneNumber")
    .notEmpty().withMessage("Phone number is required"),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("confPass")
    .notEmpty().withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password and confirm password do not match");
      }
      return true;
    }),
];

exports.loginValidation = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email is not valid"),
  body("password")
    .notEmpty().withMessage("Password is required")
];
