const express = require("express");

const router = express.Router();

const paymentMethods = require("./payment-methods");

const MerchantsModel = require("../../../models/Merchants");
const CustomersModel = require("../../../models/Customers");
const {
  createSetupIntent,
  createConnectAccount,
  createConnectAccountLink,
  getConnectAccount
} = require("../../../services/stripe");
const { validateToken } = require("../../../utils/common");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../../constants/App");
const { APP_HOST_URL } = require("../../../utils/config");
const logger = require("../../../utils/logger");

router.use("/payment-methods", paymentMethods);

router.post("/setup-intent", async (req, res) => {
  try {
    const { platformCustomerId } = req.body;

    if (!platformCustomerId) {
      return res.status(400).json({
        success: false,
        message: "Platform Customer ID is required."
      });
    }

    const customer = CustomersModel.findOne({
      merchant: null,
      stripeConnectCustomerId: null,
      "stripeMetadata.platformCustomerId": platformCustomerId
    });

    if (!customer) {
      return res
        .status(400)
        .json({ success: false, message: "Customer does not exist." });
    }

    // create setup intent on platform account
    const response = await createSetupIntent({
      customer: platformCustomerId
    });

    logger.debug("setup intent : ", response);

    return res.status(200).json({
      success: true,
      data: {
        clientSecret: response.client_secret,
        platformCustomerId
      }
    });
  } catch (error) {
    logger.error("POST /api/v1/payments/setup-intent -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.post("/account", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const {
      user: {
        email,
        merchant: { _id: merchantId }
      }
    } = token;

    let payload = {
      success: false
    };

    const createConnectAccountResponse = await createConnectAccount({
      email,
      merchantId
    });

    logger.debug(
      "createConnectAccountResponse : ",
      createConnectAccountResponse
    );

    if (createConnectAccountResponse && createConnectAccountResponse.id) {
      const stripeAccountId = createConnectAccountResponse.id;

      await MerchantsModel.findOneAndUpdate(
        {
          _id: merchantId
        },
        {
          stripeAccountId
        }
      );

      const baseConnectReturnUrl = `https://merchant.${APP_HOST_URL}/connect/stripe`;

      const createConnectAccountLinkResponse = await createConnectAccountLink({
        account: stripeAccountId,
        refresh_url: `${baseConnectReturnUrl}?type=refresh`,
        return_url: `${baseConnectReturnUrl}?type=return`
      });

      logger.debug(
        "createConnectAccountLinkResponse : ",
        createConnectAccountLinkResponse
      );

      if (
        createConnectAccountLinkResponse &&
        createConnectAccountLinkResponse.url
      ) {
        payload = {
          success: true,
          data: { url: createConnectAccountLinkResponse.url }
        };
      }
    }

    if (payload.success) {
      return res.status(200).json(payload);
    }

    return res.status(400).json({ message: "Failed to connect with Stripe." });
  } catch (error) {
    logger.error("POST /api/v1/payments/account -> error : ", error);

    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.get("/account/link", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const {
      user: {
        merchant: { _id: merchantId, stripeAccountId }
      }
    } = token;

    if (!merchantId) {
      return res
        .status(400)
        .json({ success: false, message: "Merchant ID is required." });
    }

    const merchant = await MerchantsModel.findById(merchantId);

    if (!merchant) {
      return res
        .status(400)
        .json({ success: false, message: "Merchant does not exist." });
    }

    const baseConnectReturnUrl = `https://merchant.${APP_HOST_URL}/connect/stripe`;

    const response = await createConnectAccountLink({
      account: stripeAccountId,
      refresh_url: `${baseConnectReturnUrl}?type=refresh`,
      return_url: `${baseConnectReturnUrl}?type=return`
    });

    let payload = { success: false };

    if (response && response.url) {
      payload = { success: true, data: { url: response.url } };
    }

    if (payload.success) {
      return res.status(200).json(payload);
    }

    return res
      .status(400)
      .json({ message: "Failed to generate Stripe account link." });
  } catch (error) {
    logger.error("GET /api/v1/payments/account/link -> error : ", error);

    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.get("/account", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const {
      merchant: { _id: merchantId, stripeAccountId }
    } = token.user;

    const merchant = await MerchantsModel.findById(merchantId);

    if (!merchant) {
      return res
        .status(400)
        .json({ success: false, message: "Merchant does not exist." });
    }

    const data = {
      stripe: null,
      square: null
    };

    if (merchant.stripeEnabled) {
      const response = await getConnectAccount(stripeAccountId);

      data.stripe = {
        country: response.country,
        defaultCurrency: response.default_currency,
        payoutsEnabled: response.payouts_enabled,
        chargesEnabled: response.charges_enabled,
        detailsSubmitted: response.details_submitted
      };
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    logger.error("GET /api/v1/payments/account -> error : ", error);

    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

module.exports = router;
