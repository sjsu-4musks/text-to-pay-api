const TextToPayFlow = {
  DEMO: "DEMO",
  BUY: "BUY"
};

const TextToPayStep = {
  OFFER: "OFFER",
  SELECT_PRODUCT: "SELECT_PRODUCT",
  SELECT_VARIATION: "SELECT_VARIATION",
  SELECT_QUANTITY: "SELECT_QUANTITY",
  PAYMENT: "PAYMENT",
  ORDER: "ORDER"
};

const TextToPayStatus = {
  INIT: "INIT",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETE: "COMPLETE"
};

module.exports = { TextToPayFlow, TextToPayStep, TextToPayStatus };
