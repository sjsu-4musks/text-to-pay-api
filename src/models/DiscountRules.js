const mongoose = require("mongoose");

const collection = "DiscountRules";

const { Schema } = mongoose;

const { DiscountRuleType } = require("../constants/DiscountRules");

// schedules
// {
//   label: "",
//   value: "",
//   price: ""
// }

// rule

// straight

// discountType: {
//   enum: Object.values(DiscountType),
//   type: String,
//   default: null
// },
// discountAmount: {
//   type: Number,
//   default: null
// }
// schedules: {
//   type: [String],
//   default: []
// }

// slider

// maxDiscountPercentage: {
//   type: Number
// },
// maxUnits: {
//   type: Number
// }

// product discount schema
const DiscountSchema = mongoose.Schema(
  {
    SUBSCRIPTION: {
      type: {
        type: String,
        enum: Object.values(DiscountRuleType)
      },
      rule: {
        type: mongoose.Schema.Types.Mixed,
        default: null
      }
    },
    BUY_MORE_PAY_LESS: {
      maxDiscountPercentage: {
        type: Number
      },
      maxUnits: {
        type: Number
      },
      rules: {
        type: mongoose.Schema.Types.Mixed,
        default: null
      }
    }
  },
  {
    _id: false
  }
);

const DiscountRulesSchema = new Schema(
  {
    title: {
      type: String
    },
    discount: {
      type: DiscountSchema,
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

const DiscountRules = mongoose.model(collection, DiscountRulesSchema);

module.exports = DiscountRules;
