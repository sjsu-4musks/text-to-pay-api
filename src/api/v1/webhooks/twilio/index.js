const express = require("express");

const router = express.Router();

const TextToPayModel = require("../../../../models/TextToPay");

const { buyFlow, demoFlow } = require("../../../../services/text-to-pay");

const { TextToPayFlow } = require("../../../../constants/TextToPay");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../../../constants/App");
const logger = require("../../../../utils/logger");

router.post("/", async (req, res) => {
  try {
    res
      .status(200)
      .json({ success: true, message: "Thanks for delivering this webhook!" });

    const { From, Body: message } = req.body;

    logger.debug("body : ", req.body);

    const phone = String(From).slice(2);

    const textToPay = await TextToPayModel.findOne({
      phone
    }).sort({ createdAt: "desc" });

    logger.debug("textToPay : ", textToPay);

    if (
      !textToPay ||
      textToPay.flow === TextToPayFlow.DEMO ||
      String(message).includes("#demo-croissants") ||
      String(message).includes("#demo-lululemon") ||
      String(message).includes("#demo-express")
    ) {
      return await demoFlow({ phone, message });
    }

    if (textToPay.flow === TextToPayFlow.BUY) {
      return await buyFlow({ phone, message });
    }
  } catch (error) {
    logger.error("POST /api/v1/webhooks/twilio -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

module.exports = router;
