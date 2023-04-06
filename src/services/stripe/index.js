const { STRIPE_SECRET_KEY } = require("../../utils/config");
const stripe = require("stripe")(STRIPE_SECRET_KEY); // eslint-disable-line
const { CURRENCIES } = require("../../constants/Currencies");
const { COUNTRIES } = require("../../constants/Countries");
const logger = require("../../utils/logger");

const createConnectAccount = async ({ email, merchantId }) => {
  try {
    return await stripe.accounts.create({
      country: COUNTRIES.US,
      type: "express",
      email,
      metadata: {
        merchantId
      }
    });
  } catch (error) {
    logger.error("STRIPE - createAccount() -> error : ", error);
    throw error;
  }
};

const createConnectAccountLink = async ({
  account,
  refresh_url,
  return_url
}) => {
  try {
    return await stripe.accountLinks.create({
      account,
      refresh_url,
      return_url,
      type: "account_onboarding"
    });
  } catch (error) {
    logger.error("STRIPE - createConnectAccountLink() -> error : ", error);
    throw error;
  }
};

const getConnectAccount = async account => {
  try {
    return await stripe.accounts.retrieve(account);
  } catch (error) {
    logger.error("STRIPE - getConnectAccount() -> error : ", error);
    throw error;
  }
};

const createCustomer = async ({
  name,
  email = null,
  phone = null,
  payment_method,
  metadata,
  stripeAccount
}) => {
  try {
    return await stripe.customers.create(
      {
        name,
        email,
        phone,
        payment_method,
        metadata
      },
      {
        stripeAccount
      }
    );
  } catch (error) {
    logger.error("STRIPE - createCustomer() -> error : ", error);
    throw error;
  }
};

const createProduct = async ({
  name,
  description,
  metadata,
  stripeAccount
}) => {
  try {
    return await stripe.products.create(
      {
        name,
        description,
        metadata
      },
      {
        stripeAccount
      }
    );
  } catch (error) {
    logger.error("STRIPE - createProduct() -> error : ", error);
    throw error;
  }
};

const createPrice = async ({
  product,
  unit_amount,
  recurring,
  metadata,
  stripeAccount
}) => {
  try {
    return await stripe.prices.create(
      {
        product,
        unit_amount,
        currency: CURRENCIES.USD,
        recurring,
        metadata
      },
      {
        stripeAccount
      }
    );
  } catch (error) {
    logger.error("STRIPE - createPrice() -> error : ", error);
    throw error;
  }
};

const retrieveSubscription = async ({ subscriptionId, stripeAccount }) => {
  try {
    return await stripe.subscriptions.retrieve(subscriptionId, {
      stripeAccount
    });
  } catch (error) {
    logger.error("STRIPE - retrieveSubscription() -> error : ", error);
    throw error;
  }
};

const createSubscription = async ({
  customer,
  items,
  paymentMethodId,
  stripeAccount,
  metadata
}) => {
  try {
    return await stripe.subscriptions.create(
      {
        customer,
        items,
        default_payment_method: paymentMethodId,
        metadata
      },
      {
        stripeAccount
      }
    );
  } catch (error) {
    logger.error("STRIPE - createSubscription() -> error : ", error);
    throw error;
  }
};

const updateSubscription = async ({
  subscriptionId,
  options,
  stripeAccount
}) => {
  try {
    return await stripe.subscriptions.update(subscriptionId, options, {
      stripeAccount
    });
  } catch (error) {
    logger.error("STRIPE - updateSubscription() -> error : ", error);
    throw error;
  }
};

const createSetupIntent = async ({ customer }) => {
  try {
    return await stripe.setupIntents.create({
      customer
    });
  } catch (error) {
    logger.error("createSetupIntent() -> error : ", error);
  }
};

const createPaymentIntent = async ({
  customer,
  amount,
  paymentMethodId,
  stripeAccount = null
}) => {
  try {
    if (stripeAccount) {
      return await stripe.paymentIntents.create(
        {
          customer,
          amount,
          currency: CURRENCIES.USD,
          payment_method: paymentMethodId,
          off_session: false,
          confirm: true
        },
        {
          stripeAccount
        }
      );
    }

    return await stripe.paymentIntents.create({
      customer,
      amount,
      currency: CURRENCIES.USD,
      payment_method: paymentMethodId,
      off_session: false,
      confirm: true
    });
  } catch (error) {
    logger.error("STRIPE - createPaymentIntent() -> error : ", error);
    throw error;
  }
};

const retrieveSetupIntent = async ({ setupIntentId }) => {
  try {
    return await stripe.setupIntents.retrieve(setupIntentId);
  } catch (error) {
    logger.error("STRIPE - retrieveSetupIntent() -> error : ", error);
    throw error;
  }
};

const retrievePaymentIntent = async ({ paymentIntentId, stripeAccount }) => {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId, {
      stripeAccount
    });
  } catch (error) {
    logger.error("STRIPE - retrievePaymentIntent() -> error : ", error);
    throw error;
  }
};

const listPaymentMethods = async ({ customer, stripeAccount = null }) => {
  try {
    if (stripeAccount) {
      return await stripe.paymentMethods.list(
        {
          customer,
          type: "card"
        },
        {
          stripeAccount
        }
      );
    }

    return await stripe.paymentMethods.list({
      customer,
      type: "card"
    });
  } catch (error) {
    logger.error("STRIPE - listPaymentMethods() -> error : ", error);
  }
};

const createPaymentMethod = async ({
  customer,
  payment_method,
  stripeAccount
}) => {
  try {
    return await stripe.paymentMethods.create(
      {
        customer,
        payment_method
      },
      {
        stripeAccount
      }
    );
  } catch (error) {
    logger.error("STRIPE - createPaymentMethod() -> error : ", error);
  }
};

const attachPaymentMethod = async ({
  customer,
  paymentMethodId,
  stripeAccount
}) => {
  try {
    return await stripe.paymentMethods.attach(
      paymentMethodId,
      {
        customer
      },
      {
        stripeAccount
      }
    );
  } catch (error) {
    logger.error("STRIPE - attachPaymentMethod() -> error : ", error);
  }
};

const retrievePaymentMethod = async ({
  paymentMethodId,
  stripeAccount = null
}) => {
  try {
    if (stripeAccount) {
      return await stripe.paymentMethods.retrieve(paymentMethodId, {
        stripeAccount
      });
    }

    return await stripe.paymentMethods.retrieve(paymentMethodId);
  } catch (error) {
    logger.error("STRIPE - retrievePaymentMethod() -> error : ", error);
  }
};

const transferFunds = async ({ amount, stripeAccount }) => {
  try {
    return await stripe.transfers.create({
      amount,
      currency: CURRENCIES.USD,
      destination: stripeAccount
    });
  } catch (error) {
    logger.error("STRIPE - transferFunds() -> error : ", error);
  }
};

module.exports = {
  createConnectAccount,
  createConnectAccountLink,
  getConnectAccount,
  createCustomer,
  createProduct,
  createPrice,
  retrieveSubscription,
  createSubscription,
  updateSubscription,
  createSetupIntent,
  retrieveSetupIntent,
  createPaymentIntent,
  retrievePaymentIntent,
  listPaymentMethods,
  createPaymentMethod,
  attachPaymentMethod,
  retrievePaymentMethod,
  transferFunds
};
