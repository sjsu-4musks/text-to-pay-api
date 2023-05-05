// as accepted by Stripe
const Intervals = {
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
  YEAR: "year"
};

const PaymentSchedules = {
  WEEK: "WEEK",
  BI_WEEK: "BI_WEEK",
  MONTH: "MONTH",
  QUATER: "QUATER",
  HALF_YEAR: "HALF_YEAR",
  YEAR: "YEAR"
};

const getPaymentSchedule = schedule => {
  const mapper = {
    [PaymentSchedules.WEEK]: {
      interval: Intervals.WEEK
    },
    [PaymentSchedules.BI_WEEK]: {
      interval: Intervals.WEEK,
      interval_count: 2 // bills every 2 weeks
    },
    [PaymentSchedules.MONTH]: {
      interval: Intervals.MONTH
    },
    [PaymentSchedules.QUATER]: {
      interval: Intervals.MONTH,
      interval_count: 3 // bills every 3 months
    },
    [PaymentSchedules.HALF_YEAR]: {
      interval: Intervals.MONTH,
      interval_count: 6 // bills every 6 months
    },
    [PaymentSchedules.YEAR]: {
      interval: Intervals.YEAR
    }
  };

  return mapper[schedule] || null;
};

const PurchaseType = {
  ONE_TIME: "ONE_TIME",
  SUBSCRIPTION: "SUBSCRIPTION",
  BUY_MORE_PAY_LESS: "BUY_MORE_PAY_LESS"
};

// Stripe
const PaymentStatus = {
  SUCCEEDED: "succeeded",
  PROCESSING: "processing",
  REQUIRES_PAYMENT_METHOD: "requires_payment_method"
};

const ProcessingFeesType = {
  MERCHANT: "MERCHANT",
  CUSTOMER: "CUSTOMER",
  SPLIT: "SPLIT"
};

module.exports = {
  Intervals,
  PaymentSchedules,
  PurchaseType,
  PaymentStatus,
  ProcessingFeesType,
  getPaymentSchedule
};
