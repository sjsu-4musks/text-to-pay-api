const mongoose = require("mongoose");

const collection = "Users";

const { UserRoles, UserTypes, UserStatus } = require("../constants/Users");

const { Schema } = mongoose;

const UsersSchema = new Schema(
  {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    email: {
      type: String,
      index: true
    },
    phone: {
      type: String,
      index: true
    },
    password: {
      type: String
    },
    avatar: {
      type: String
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      enum: Object.values(UserRoles)
    },
    status: {
      type: String,
      enum: Object.values(UserStatus)
    },
    type: {
      type: String,
      enum: Object.values(UserTypes)
    },
    address: {
      type: Object,
      default: null
    },
    merchant: {
      type: Schema.Types.ObjectId,
      ref: "Merchants",
      default: null
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customers",
      default: null
    }
  },
  { timestamps: true, collection }
);

const Users = mongoose.model(collection, UsersSchema);

module.exports = Users;
