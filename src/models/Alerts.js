const mongoose = require("mongoose");

const collection = "Alerts";

const { Schema } = mongoose;

const { AlertType } = require("../constants/Alerts");

const AlertsSchema = new Schema(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Orders",
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
    },
    type: {
      type: String,
      enum: Object.values(AlertType)
    }
  },
  { timestamps: true, collection }
);

const Alerts = mongoose.model(collection, AlertsSchema);

module.exports = Alerts;
