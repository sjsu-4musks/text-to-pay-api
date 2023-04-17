const mongoose = require("mongoose");

const _ModifiersSchema = mongoose.Schema(
  {
    id: {
      type: String
    },
    version: {
      type: Number
    },
    name: {
      type: String
    },
    price: {
      type: Number
    }
  },
  {
    _id: false
  }
);

const VariationSchema = mongoose.Schema(
  {
    id: {
      type: String
    },
    version: {
      type: Number
    },
    name: {
      type: String
    },
    price: {
      type: Number
    }
  },
  {
    _id: false
  }
);

module.exports = { _ModifiersSchema, VariationSchema };
