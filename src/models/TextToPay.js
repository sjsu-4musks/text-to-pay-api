const mongoose = require("mongoose");

const collection = "TextToPay";

const { Schema } = mongoose;

const {
  TextToPayFlow,
  // TextToPayStep,
  TextToPayStatus
} = require("../constants/TextToPay");
const { VariationSchema } = require("./common");

const TextToPaySchema = new Schema(
  {
    phone: {
      type: String
    },
    steps: {
      type: Array
    },
    demoType: {
      type: String
    },
    flow: {
      type: String,
      enum: Object.values(TextToPayFlow)
    },
    currentStep: {
      type: String
      // enum: Object.values(TextToPayStep)
    },
    status: {
      type: String,
      enum: Object.values(TextToPayStatus)
    },
    productOptions: {
      type: [Schema.Types.ObjectId],
      ref: "Products",
      default: null
    },
    selectedProduct: {
      type: Schema.Types.ObjectId,
      ref: "Products",
      default: null
    },
    quantity: {
      type: Number
    },
    selectedVariation: {
      type: VariationSchema,
      default: null
    },
    discount: {
      type: Schema.Types.ObjectId,
      ref: "Discounts",
      default: null
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customers",
      default: null
    },
    merchant: {
      type: Schema.Types.ObjectId,
      ref: "Merchants",
      default: null
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Orders",
      default: null
    }
  },
  { timestamps: true, collection }
);

const TextToPay = mongoose.model(collection, TextToPaySchema);

module.exports = TextToPay;
