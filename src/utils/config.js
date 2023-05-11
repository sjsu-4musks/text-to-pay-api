const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT || 7000,
  APP_ENV: process.env.APP_ENV,
  LOG_LEVEL: process.env.LOG_LEVEL,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  APP_HOST_URL: process.env.APP_HOST_URL,
  APP_AWS_BUCKET_NAME: process.env.APP_AWS_BUCKET_NAME,
  APP_AWS_BUCKET_REGION: process.env.APP_AWS_BUCKET_REGION,
  APP_AWS_ACCESS_KEY: process.env.APP_AWS_ACCESS_KEY,
  APP_AWS_SECRET_KEY: process.env.APP_AWS_SECRET_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOKS_SIGNING_SECRET: process.env.STRIPE_WEBHOOKS_SIGNING_SECRET,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_FROM_NUMBER: process.env.TWILIO_FROM_NUMBER
};
