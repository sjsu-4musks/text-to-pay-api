const express = require("express");

const router = express.Router();

const {
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOKS_SIGNING_SECRET
} = require("../../../../utils/config");

const stripe = require("stripe")(STRIPE_SECRET_KEY); // eslint-disable-line

const {
  handleAccountUpdatedWebhook
} = require("../../../../services/stripe/webhooks/connect");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../../../constants/App");
const logger = require("../../../../utils/logger");

router.post("/", async (req, res) => {
  try {
    const signature = req.headers["stripe-signature"];

    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      STRIPE_WEBHOOKS_SIGNING_SECRET
    );

    if (event.id) {
      res.sendStatus(200);

      if (event.type === "account.updated") {
        return await handleAccountUpdatedWebhook(event);
      }
    }
  } catch (error) {
    logger.error("POST /api/v1/webhooks/stripe -> error : ", error);

    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

module.exports = router;
