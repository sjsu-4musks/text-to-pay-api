const mongoose = require("mongoose");

const collection = "Merchants";

const { Schema } = mongoose;

const MerchantsSchema = new Schema(
  {
    stripeAccountId: {
      type: String,
      default: null
    },
    stripeMetadata: {
      type: Schema.Types.Mixed,
      default: null
    },
    squareMetadata: {
      type: Schema.Types.Mixed,
      default: null
    },
    addressLine1: {
      type: String
    },
    addressLine2: {
      type: String
    },
    city: {
      type: String
    },
    state: {
      type: String
    },
    country: {
      type: String
    },
    zipcode: {
      type: String
    },
    businessName: {
      type: String
    },
    businessType: {
      type: String
    },
    businessLogo: {
      type: String
    },
    businessBanner: {
      type: String
    },
    businessDescription: {
      type: String
    },
    subdomain: {
      type: String,
      default: null
    },
    stripeEnabled: {
      type: Boolean,
      default: false
    },
    squareEnabled: {
      type: Boolean,
      default: false
    },
    productsSynced: {
      type: Boolean,
      default: false
    },
    ruleSetCreated: {
      type: Boolean,
      default: false
    },
    businessProfileCreated: {
      type: Boolean,
      default: false
    },
    businessPageViewed: {
      type: Boolean,
      default: false
    },
    processingFeesType: {
      type: String,
      default: null
    },
    isB2B: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true, collection }
);

const Merchants = mongoose.model(collection, MerchantsSchema);

module.exports = Merchants;
