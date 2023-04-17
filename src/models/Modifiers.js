const mongoose = require("mongoose");

const collection = "Modifiers";

const { Schema } = mongoose;

const { _ModifiersSchema } = require("./common");

const ModifiersSchema = new Schema(
  {
    squareModifierId: {
      type: String,
      default: null
    },
    squareMetadata: {
      type: Schema.Types.Mixed,
      default: null
    },
    title: {
      type: String
    },
    modifiers: {
      type: [_ModifiersSchema]
    },
    merchant: {
      type: Schema.Types.ObjectId,
      ref: "Merchants",
      default: null
    }
  },
  { timestamps: true, collection }
);

const Modifiers = mongoose.model(collection, ModifiersSchema);

module.exports = Modifiers;
