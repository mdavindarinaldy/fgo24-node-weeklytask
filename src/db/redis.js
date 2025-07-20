require("dotenv").config();
const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.RDADDRESS,
  port: parseInt(process.env.RDPORT),
  password: process.env.RDPASSWORD,
  db: parseInt(process.env.RDDB),
});

module.exports = redis;
