const mongoose = require("mongoose");

const collection = "Conversations";

const {
  MessageType,
  ContextType,
  ContextStatus
} = require("../constants/Conversations");

const ConversationsSchema = new mongoose.Schema(
  {
    phone: {
      type: String
    },
    message: {
      type: String
    },
    context: {
      type: String,
      enum: Object.values(ContextType)
    },
    status: {
      type: String,
      enum: Object.values(ContextStatus).concat([null])
    },
    options: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    type: {
      type: String,
      enum: Object.values(MessageType)
    },
    textToPay: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TextToPay",
      default: null
    }
  },
  { timestamps: true, collection }
);

const Conversations = mongoose.model(collection, ConversationsSchema);

module.exports = Conversations;
