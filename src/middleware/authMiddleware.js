// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const privateKey = crypto.randomBytes(64).toString("hex");

module.exports = {
  privateKey,
};