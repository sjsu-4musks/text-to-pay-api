const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_FROM_NUMBER
} = require("../../utils/config");
const twilio = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN); // eslint-disable-line
const logger = require("../../utils/logger");

const from = TWILIO_FROM_NUMBER;

const sendSMS = async ({ body, to, mediaUrl }) => {
  try {
    return await twilio.messages.create({ body, from, to, mediaUrl });
  } catch (error) {
    logger.error("sendSMS() -> error : ", error);
    throw error;
  }
};

module.exports = { sendSMS };
