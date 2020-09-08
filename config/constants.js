require("dotenv").config();

module.exports = {
  SALT_ROUNDS: 10,
  PORT: process.env.PORT || 5000,
  API_URL: process.env.API_URL || "localhost:3000",
  BACKEND_API: process.env.BACKEND_API || "localhost:5000",
  AUTH_USER: process.env.AUTH_USER,
  AUTH_PASS: process.env.AUTH_PASS,
};
