const mongoose = require("mongoose");

const collection = "Cart";

const { Schema } = mongoose;

const { PurchaseType } = require("../constants/Payments");
const { PlanType } = require("../constants/Products");

const PriceSchema = mongoose.Schema(
  {
    purchaseType: {
      type: String,
      enum: Object.values(PurchaseType)
    },
    planType: {
      type: String,
      enum: Object.values(PlanType)
    },
    modifiers: {
      type: Schema.Types.Mixed
    },
    variation: {
      type: Object
    },
    amount: {
      type: Number
    },
    totalAmount: {
      type: Number
    },
    quantity: {
      type: Number
    },
    discountPercentage: {
      type: Number
    },
    schedule: {
      type: String
    }
  },
  {
    _id: false
  }
);

const ItemSchema = mongoose.Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Products",
      default: null
    },
    menuType: {
      type: String
    },
    title: {
      type: String
    },
    description: {
      type: String
    },
    images: {
      type: [String]
    },
    stripeProductId: {
      type: String
    },
    price: {
      type: PriceSchema
    },
    stripeMetadata: {
      type: Schema.Types.Mixed,
      default: null
    },
    squareMetadata: {
      type: Schema.Types.Mixed,
      default: null
    }
  },
  { _id: false }
);

const CartSchema = new Schema(
  {
    cartId: {
      type: String
    },
    items: {
      type: [ItemSchema]
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customers",
      default: null
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      default: null
    },
    merchant: {
      type: Schema.Types.ObjectId,
      ref: "Merchants",
      default: null
    }
  },
  { timestamps: true, collection }
);

const Cart = mongoose.model(collection, CartSchema);

module.exports = Cart;
