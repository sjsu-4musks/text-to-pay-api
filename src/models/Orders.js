const mongoose = require("mongoose");

const collection = "Orders";

const { Schema } = mongoose;

const { _ModifiersSchema, VariationSchema } = require("./common");
const {
  OrderType,
  OrderStatus,
  OrderScheduleType
} = require("../constants/Orders");

const OrdersSchema = new Schema(
  {
    status: {
      type: String,
      enum: Object.values(OrderStatus)
    },
    type: {
      type: String,
      enum: Object.values(OrderType)
    },
    scheduleType: {
      type: String,
      enum: Object.values(OrderScheduleType)
    },
    servicedAt: {
      type: Date,
      default: null
    },
    scheduledDate: {
      type: Date,
      default: null
    },
    scheduledTime: {
      type: Date,
      default: null
    },
    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
      default: null
    },
    modifiers: {
      type: [_ModifiersSchema]
    },
    variation: {
      type: VariationSchema
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
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customers",
      default: null
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
  { timestamps: true, collection }
);

const Orders = mongoose.model(collection, OrdersSchema);

module.exports = Orders;
