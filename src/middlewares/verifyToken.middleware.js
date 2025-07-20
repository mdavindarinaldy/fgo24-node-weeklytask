const jwt = require("jsonwebtoken");
const redis = require("../db/redis");
const { constants: http } = require("http2");

const verifyToken = async (req, res, next) => {
  try {
    const secretKey = process.env.APP_SECRET;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token = authHeader.split("Bearer ")[1];

    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted === "true") {
      return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized",
        errors: "Token has been blacklisted",
      });
    }

    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.userId;
    req.role = decoded.role;
    req.tokenExp = decoded.exp;
    next();
    
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = verifyToken;