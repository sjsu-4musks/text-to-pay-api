const OrderType = {
  PURCHASE: "PURCHASE",
  REDEMPTION: "REDEMPTION"
};

const OrderScheduleType = {
  IMMEDIATE: "IMMEDIATE",
  SCHEDULED: "SCHEDULED"
};

const OrderStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED"
};

const OrderDurationFilter = {
  TODAY: "TODAY",
  FUTURE: "FUTURE",
  PAST: "PAST"
};

module.exports = {
  OrderType,
  OrderScheduleType,
  OrderStatus,
  OrderDurationFilter
};
