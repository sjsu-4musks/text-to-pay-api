const StripeWebhooksModel = require("../../../../models/StripeWebhooks");
const MerchantsModel = require("../../../../models/Merchants");
const logger = require("../../../../utils/logger");

const handleAccountUpdatedWebhook = async event => {
  try {
    await new StripeWebhooksModel({ event }).save();

    const {
      account: stripeAccountId,
      data: {
        object: {
          charges_enabled,
          default_currency,
          details_submitted,
          payouts_enabled,
          country,
          type
        }
      }
    } = event;

    const merchant = await MerchantsModel.findOne({
      stripeAccountId
    });

    if (!merchant) {
      logger.error("Merchant not found -> stripeAccountId : ", {
        stripeAccountId
      });
      return;
    }

    await MerchantsModel.findOneAndUpdate(
      { stripeAccountId },
      {
        stripeMetadata: {
          charges_enabled,
          default_currency,
          details_submitted,
          payouts_enabled,
          country,
          type
        }
      }
    );

    if (charges_enabled && details_submitted && payouts_enabled) {
      await MerchantsModel.findOneAndUpdate(
        { stripeAccountId },
        { stripeEnabled: true }
      );
    }
  } catch (error) {
    logger.error("handleAccountUpdatedWebhook() -> error : ", error);
  }
};

module.exports = { handleAccountUpdatedWebhook };
