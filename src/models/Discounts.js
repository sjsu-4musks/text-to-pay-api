const mongoose = require("mongoose");

const collection = "Discounts";

const { Schema } = mongoose;

const { DiscountType } = require("../constants/Discounts");

const DiscountScheduleSchema = mongoose.Schema(
  {
    startTime: {
      type: Date,
      default: null
    },
    endTime: {
      type: Date,
      default: null
    }
  },
  { _id: false }
);

const DiscountsSchema = new Schema(
  {
    title: {
      type: String,
      default: null
    },
    discountType: {
      enum: Object.values(DiscountType),
      type: String,
      default: null
    },
    discountAmount: {
      type: Number,
      default: null
    },
    message: {
      type: String,
      default: ""
    },
    discountSchedule: {
      type: DiscountScheduleSchema,
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
    }
  },
  { timestamps: true, collection }
);

const Discounts = mongoose.model(collection, DiscountsSchema);

module.exports = Discounts;
