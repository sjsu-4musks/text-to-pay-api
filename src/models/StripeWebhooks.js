const mongoose = require("mongoose");

const collection = "StripeWebhooks";

const { Schema } = mongoose;

const StripeWebhooksSchema = new Schema(
  {
    event: {
      type: Schema.Types.Mixed
    }
  },
  { timestamps: true, collection }
);

const StripeWebhooks = mongoose.model(collection, StripeWebhooksSchema);

module.exports = StripeWebhooks;
