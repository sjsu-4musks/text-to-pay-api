const mongoose = require("mongoose");

const collection = "OTP";

const { Schema } = mongoose;

const OTPSchema = new Schema(
  {
    phone: {
      type: String,
      index: true
    },
    otp: {
      type: String
    }
  },
  { timestamps: true, collection }
);

const OTP = mongoose.model(collection, OTPSchema);

module.exports = OTP;
