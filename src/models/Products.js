const mongoose = require("mongoose");

const collection = "Products";

const { Schema } = mongoose;

const { VariationSchema } = require("./common");
const { ItemType, ItemStatus } = require("../constants/Products");

// const PlanPricingSchema = new Schema(
//   {
//     type: {
//       type: String,
//       enum: Object.values(PlanType)
//     },
//     schedule: {
//       type: String,
//       enum: Object.values(PaymentSchedules)
//     },
//     timeLimit: {
//       type: Number
//     },
//     quantity: {
//       type: Number
//     },
//     discountAmount: {
//       type: Number
//     },
//     annualAdditionalDiscountAmount: {
//       type: Number
//     },
//     amount: {
//       type: Number
//     }
//   },
//   { _id: false }
// );

const SquareCategoryType = mongoose.Schema(
  {
    id: {
      type: String
    },
    version: {
      type: Number
    },
    name: {
      type: String
    }
  },
  {
    _id: false
  }
);

const ProductsSchema = new Schema(
  {
    stripeProductId: {
      type: String,
      default: null
    },
    stripePriceId: {
      type: String,
      default: null
    },
    stripeMetadata: {
      type: Schema.Types.Mixed,
      default: null
    },
    squareItemId: {
      type: String,
      default: null
    },
    squareMetadata: {
      type: Schema.Types.Mixed,
      default: null
    },
    squareCategory: {
      type: SquareCategoryType,
      default: null
    },
    title: {
      type: String
    },
    description: {
      type: String
    },
    images: {
      type: Array
    },
    variations: {
      type: [VariationSchema]
    },
    type: {
      type: String,
      enum: Object.values(ItemType)
    },
    status: {
      type: String,
      enum: Object.values(ItemStatus)
    },
    price: {
      type: Schema.Types.Mixed,
      default: null
    },
    forCC: {
      type: Boolean,
      default: false
    },
    discountRule: {
      type: Schema.Types.ObjectId,
      ref: "DiscountRules",
      default: null
    },
    timeUnits: {
      type: String
    },
    timePeriod: {
      type: String
    },
    modifiers: {
      type: [Schema.Types.ObjectId],
      ref: "Modifiers",
      default: null
    },
    products: {
      type: [Schema.Types.ObjectId],
      ref: "Products",
      default: null
    },
    merchant: {
      type: Schema.Types.ObjectId,
      ref: "Merchants",
      default: null
    },
    hidden: {
      type: Boolean,
      default: false
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true, collection }
);

const Products = mongoose.model(collection, ProductsSchema);

module.exports = Products;
