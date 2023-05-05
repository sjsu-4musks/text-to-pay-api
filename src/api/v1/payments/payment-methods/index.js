const router = require("express").Router({ mergeParams: true });

const CustomersModel = require("../../../../models/Customers");
const {
  retrieveSetupIntent,
  listPaymentMethods,
  retrievePaymentMethod
} = require("../../../../services/stripe");
const { demoFlow, buyFlow } = require("../../../../services/text-to-pay");
const { validateToken } = require("../../../../utils/common");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../../../constants/App");
const { TextToPayFlow } = require("../../../../constants/TextToPay");
const logger = require("../../../../utils/logger");

router.get("/", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const { userId } = token;

    const platformCustomer = await CustomersModel.findOne({
      user: userId,
      merchant: null,
      "stripeMetadata.platformCustomerId": { $ne: null }
    });

    if (!platformCustomer) {
      return res
        .status(400)
        .json({ success: false, message: "Could not find customer details." });
    }

    const response = await listPaymentMethods({
      customer: platformCustomer.stripeMetadata.platformCustomerId
    });

    logger.debug("payment methods : ", response);

    const cards = response.data.map(elem => ({
      id: elem.id,
      brand: elem.card.brand,
      expiryMonth: elem.card.exp_month,
      expiryYear: elem.card.exp_year,
      lastFourDigits: elem.card.last4
    }));

    return res.status(200).json({ success: true, data: { cards } });
  } catch (error) {
    logger.error("GET /api/v1/payments/payment-methods -> error : ", error);

    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.post("/", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const {
      pmId: paymentMethodId,
      pcId: platformCustomerId,
      flow = "",
      isTextToPay = false
    } = req.body;

    if (!paymentMethodId) {
      return res
        .status(400)
        .json({ success: false, message: "PM ID is required." });
    }

    if (!platformCustomerId) {
      return res.status(400).json({
        success: false,
        message: "PC ID is required."
      });
    }

    const platformCustomer = await CustomersModel.findOne({
      merchant: null,
      stripeConnectCustomerId: null,
      "stripeMetadata.platformCustomerId": platformCustomerId
    });

    logger.debug("platformCustomer : ", platformCustomer);

    if (!platformCustomer) {
      return res.status(400).json({
        success: false,
        message: "Customer does not exist."
      });
    }

    const paymentMethodResponse = await retrievePaymentMethod({
      paymentMethodId
    });

    if (paymentMethodResponse && paymentMethodResponse.id) {
      platformCustomer.stripePaymentMethods = [
        ...platformCustomer.toObject().stripePaymentMethods,
        paymentMethodResponse.id
      ];

      platformCustomer.save();
    }

    if (isTextToPay) {
      if (flow === TextToPayFlow.DEMO) {
        await demoFlow({
          phone: platformCustomer.phone,
          message: "edit",
          retryPayment: true
        });
      }

      if (flow === TextToPayFlow.BUY) {
        await buyFlow({
          phone: platformCustomer.phone,
          message: "edit",
          retryPayment: true
        });
      }
    }

    return res
      .status(200)
      .json({ success: true, message: "Card added successfully!" });
  } catch (error) {
    logger.error("POST /api/v1/payments/payment-methods -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.post("/confirm", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const { setupIntentId, platformCustomerId } = req.body;

    if (!setupIntentId) {
      return res
        .status(400)
        .json({ success: false, message: "Setup Intent ID is required." });
    }

    if (!platformCustomerId) {
      return res.status(400).json({
        success: false,
        message: "Platform Customer ID is required."
      });
    }

    const platformCustomer = await CustomersModel.findOne({
      merchant: null,
      stripeConnectCustomerId: null,
      "stripeMetadata.platformCustomerId": platformCustomerId
    });

    logger.debug("platformCustomer : ", platformCustomer);

    if (!platformCustomer) {
      return res.status(400).json({
        success: false,
        message: "Customer does not exist."
      });
    }

    // get setup intent on platform
    const setupIntentResponse = await retrieveSetupIntent({
      setupIntentId
    });

    logger.debug("setupIntentResponse : ", setupIntentResponse);

    let success = false;

    if (setupIntentResponse && setupIntentResponse.id) {
      const paymentMethodId = setupIntentResponse.payment_method;

      const paymentMethodResponse = await retrievePaymentMethod({
        paymentMethodId
      });

      if (paymentMethodResponse && paymentMethodResponse.id) {
        platformCustomer.stripePaymentMethods = [
          ...platformCustomer.toObject().stripePaymentMethods,
          paymentMethodResponse.id
        ];

        platformCustomer.save();

        success = true;
      }
    }

    const payload = { success };

    if (success) {
      payload.message = "Payment method added successfully!";
      return res.status(200).json(payload);
    }

    payload.message = "Failed to add new payment method.";
    return res.status(400).json(payload);
  } catch (error) {
    logger.error(
      "POST /api/v1/payments/payment-methods/confirm -> error : ",
      error
    );
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

module.exports = router;
