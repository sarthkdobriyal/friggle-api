require("dotenv").config();

const api_config = {
  DB_URL: process.env.DB_URL,
  FRONTEND_URL: process.env.FRONT_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  BYTEZ_KEY: process.env.BYTEZ_KEY,
  RUNWAYML_API_SECRET: process.env.RUNWAYML_API_SECRET,
  EDEN_AI_KEY: process.env.EDEN_AI_KEY,
  REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
  S3_BUCKET: process.env.S3_BUCKET,
  S3_BUCKET_URL: process.env.S3_BUCKET_URL,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_EMAIL: process.env.SMTP_EMAIL,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD
};

module.exports = api_config;