const mongoose = require("mongoose");

const collection = "Customers";

const { Schema } = mongoose;

const CustomersSchema = new Schema(
  {
    stripeConnectCustomerId: {
      type: String,
      default: null
    },
    stripePaymentMethods: {
      type: Array,
      default: []
    },
    stripeMetadata: {
      type: Schema.Types.Mixed,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    email: {
      type: String,
      default: null
    },
    phone: {
      type: String,
      default: null
    },
    merchant: {
      type: Schema.Types.ObjectId,
      ref: "Merchants",
      default: null
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      default: null
    }
  },
  { timestamps: true, collection }
);

const Customers = mongoose.model(collection, CustomersSchema);

module.exports = Customers;
