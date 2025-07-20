const jwt = require("jsonwebtoken");

exports.generateToken = ({ id: userId, role }) => {
  const payload = { userId, role };
  return jwt.sign(payload, process.env.APP_SECRET || "secret", {
    expiresIn: "1d",
  });
};

