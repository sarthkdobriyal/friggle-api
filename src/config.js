require("dotenv").config();

const api_config = {
  DB_URL : process.env.DB_URL,
  JWT_SECRET : process.env.JWT_SECRET,
  JWT_EXPIRES_IN : process.env.JWT_EXPIRES_IN || '7d',
};

module.exports = api_config;