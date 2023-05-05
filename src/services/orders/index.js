const moment = require("moment-timezone");
const { nanoid } = require("nanoid");

const MerchantsModel = require("../../models/Merchants");
const CustomersModel = require("../../models/Customers");
const OrdersModel = require("../../models/Orders");
const CartModel = require("../../models/Cart");
const ProductsModel = require("../../models/Products");
const DiscountsModel = require("../../models/Discounts");
const AlertsModel = require("../../models/Alerts");
const {
  createCustomer,
  retrievePaymentMethod,
  createPaymentMethod,
  attachPaymentMethod,
  listPaymentMethods,
  createSubscription,
  createPaymentIntent,
  createPrice,
  transferFunds
} = require("../stripe");
const {
  PurchaseType,
  ProcessingFeesType,
  getPaymentSchedule
} = require("../../constants/Payments");
const {
  OrderStatus,
  OrderScheduleType,
  OrderType
} = require("../../constants/Orders");
const { PaymentSchedules } = require("../../constants/Payments");
const { ItemType } = require("../../constants/Products");
const { AlertType } = require("../../constants/Alerts");
const logger = require("../../utils/logger");
const { MenuType } = require("../../constants/Menu");
const { DiscountType } = require("../../constants/Discounts");

const createCustomerOrder = async ({
  merchantId,
  userId,
  cartId,
  items,
  paymentMethodId
}) => {
  try {
    let connectPaymentMethodId = null;

    const merchant = await MerchantsModel.findById(merchantId);

    const platformCustomer = await CustomersModel.findOne({
      user: userId,
      merchant: null,
      "stripeMetadata.platformCustomerId": { $ne: null }
    });

    const { platformCustomerId } = platformCustomer.stripeMetadata;

    let connectCustomer = await CustomersModel.findOne({
      merchant: merchantId,
      user: userId
    });

    if (!connectCustomer) {
      // create payment method on Stripe connect account from platform customer
      const createPaymentMethodResponse = await createPaymentMethod({
        customer: platformCustomerId,
        payment_method: paymentMethodId,
        stripeAccount: merchant.stripeAccountId
      });

      logger.debug(
        "createPaymentMethodResponse : ",
        createPaymentMethodResponse
      );

      // create new Stripe connect customer
      connectCustomer = await new CustomersModel({
        name: platformCustomer.name,
        phone: platformCustomer.phone,
        merchant: merchantId,
        user: userId
      }).save();

      // create customer on Stripe connect account
      const connectCustomerResponse = await createCustomer({
        name: platformCustomer.name,
        phone: platformCustomer.phone,
        metadata: {
          merchantId,
          userId,
          platformCustomerId: platformCustomer._id
        },
        stripeAccount: merchant.stripeAccountId
      });

      logger.debug("connectCustomerResponse : ", connectCustomerResponse);

      if (connectCustomerResponse && connectCustomerResponse.id) {
        // set connect customer id for Stripe connect customer
        connectCustomer.stripeConnectCustomerId = connectCustomerResponse.id;
        connectCustomer.save();

        const attachPaymentMethodResponse = await attachPaymentMethod({
          customer: connectCustomerResponse.id,
          paymentMethodId: createPaymentMethodResponse.id,
          stripeAccount: merchant.stripeAccountId
        });

        logger.debug(
          "attachPaymentMethodResponse : ",
          attachPaymentMethodResponse
        );

        if (attachPaymentMethodResponse && attachPaymentMethodResponse.id) {
          connectCustomer.stripePaymentMethods = [
            attachPaymentMethodResponse.id
          ];

          connectCustomer.save();

          connectPaymentMethodId = attachPaymentMethodResponse.id;
        }
      }
    } else {
      // check if payment method exists
      const platformPaymentMethodResponse = await retrievePaymentMethod({
        paymentMethodId
      });

      logger.debug(
        "platformPaymentMethodResponse : ",
        platformPaymentMethodResponse
      );

      const connectCustomerPaymentMethods = await listPaymentMethods({
        customer: connectCustomer.stripeConnectCustomerId,
        stripeAccount: merchant.stripeAccountId
      });

      logger.debug(
        "connectCustomerPaymentMethods : ",
        connectCustomerPaymentMethods
      );

      const connectPaymentMethod = connectCustomerPaymentMethods.data.find(
        elem =>
          elem.card &&
          elem.card.brand === platformPaymentMethodResponse.card.brand &&
          elem.card.exp_month ===
            platformPaymentMethodResponse.card.exp_month &&
          elem.card.exp_year === platformPaymentMethodResponse.card.exp_year &&
          elem.card.last4 === platformPaymentMethodResponse.card.last4
      );

      if (!connectPaymentMethod) {
        // create payment method on Stripe connect account from platform customer
        const createPaymentMethodResponse = await createPaymentMethod({
          customer: platformCustomerId,
          payment_method: paymentMethodId,
          stripeAccount: merchant.stripeAccountId
        });

        logger.debug(
          "createPaymentMethodResponse : ",
          createPaymentMethodResponse
        );

        const attachPaymentMethodResponse = await attachPaymentMethod({
          customer: connectCustomer.stripeConnectCustomerId,
          paymentMethodId: createPaymentMethodResponse.id,
          stripeAccount: merchant.stripeAccountId
        });

        logger.debug(
          "attachPaymentMethodResponse : ",
          attachPaymentMethodResponse
        );

        if (attachPaymentMethodResponse && attachPaymentMethodResponse.id) {
          connectCustomer.stripePaymentMethods = [
            ...connectCustomer.toObject().stripePaymentMethods,
            attachPaymentMethodResponse.id
          ];

          connectCustomer.save();

          connectPaymentMethodId = attachPaymentMethodResponse.id;
        }
      } else {
        connectPaymentMethodId = connectPaymentMethod.id;
      }
    }

    if (connectCustomer && !connectCustomer.stripePaymentMethods.length) {
      logger.error("No payment method available for customer.");
      return;
    }

    let consolidatedAmount = 0;

    const processedItems = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      const {
        product: productId,
        discount: discountId = null,
        menuType,
        price: {
          purchaseType,
          totalAmount,
          amount,
          quantity,
          variation,
          modifiers
        }
      } = item;

      const product = await ProductsModel.findById(productId).populate(
        "merchant"
      );

      let discount = null;

      if (discountId) {
        discount = await DiscountsModel.findById(discountId).populate(
          "products"
        );
      }

      if (menuType === MenuType.COMMUNITY_CART) {
        const platformPaymentIntentResponse = await createPaymentIntent({
          customer: platformCustomerId,
          amount: parseFloat((totalAmount * 100).toFixed(2)), // convert to cents,
          paymentMethodId
        });

        logger.debug(
          "platformPaymentIntentResponse : ",
          platformPaymentIntentResponse
        );

        if (platformPaymentIntentResponse && platformPaymentIntentResponse.id) {
          const sellerMerchantAmount = Number(totalAmount) * 0.25;

          const sellerMerchantTransferResponse = await transferFunds({
            amount: parseFloat((sellerMerchantAmount * 100).toFixed(2)), // convert to cents,
            stripeAccount: merchant.stripeAccountId
          });

          logger.debug(
            "sellerMerchantTransferResponse : ",
            sellerMerchantTransferResponse
          );

          const { merchant: originalMerchant } = product;

          const originalMerchantAmount = Number(totalAmount) * 0.5;

          const originalMerchantTransferResponse = await transferFunds({
            amount: parseFloat((originalMerchantAmount * 100).toFixed(2)), // convert to cents,
            stripeAccount: originalMerchant.stripeAccountId
          });

          logger.debug(
            "originalMerchantTransferResponse : ",
            originalMerchantTransferResponse
          );

          processedItems.push({
            ...item,
            stripeMetadata: {
              platformPaymentIntentId: platformPaymentIntentResponse.id,
              totalAmount,
              sellerMerchantTransferId: sellerMerchantTransferResponse.id,
              sellerMerchantAmount,
              originalMerchantTransferId: originalMerchantTransferResponse.id,
              originalMerchantAmount,
              paymentMethodId
            }
          });
        }
      }

      if (menuType !== MenuType.COMMUNITY_CART) {
        if (
          purchaseType === PurchaseType.ONE_TIME ||
          purchaseType === PurchaseType.BUY_MORE_PAY_LESS
        ) {
          let purchaseAmount = Number(totalAmount);

          if (discount) {
            if (discount.discountType === DiscountType.PERCENTAGE) {
              purchaseAmount -=
                purchaseAmount * (Number(discount.discountAmount) / 100);
            }

            if (discount.discountType === DiscountType.AMOUNT) {
              purchaseAmount -= Number(discount.discountAmount);
            }
          }

          consolidatedAmount += purchaseAmount;

          const payload = {
            ...item
          };

          processedItems.push(payload);
        }
      }
    }

    let orderStripeMetadata = null;

    if (consolidatedAmount > 0) {
      let processingFees = 0;

      if (merchant.processingFeesType === ProcessingFeesType.CUSTOMER) {
        processingFees = parseFloat(
          (consolidatedAmount * (2.9 / 100) + 0.3).toFixed(2)
        ); // Stripe processing fees
      }

      const buyAmount = consolidatedAmount + processingFees;

      const paymentIntentResponse = await createPaymentIntent({
        customer: connectCustomer.stripeConnectCustomerId,
        amount: parseFloat((buyAmount * 100).toFixed(2)), // convert to cents,
        paymentMethodId: connectPaymentMethodId,
        stripeAccount: merchant.stripeAccountId
      });

      logger.debug("paymentIntentResponse : ", paymentIntentResponse);

      if (paymentIntentResponse && paymentIntentResponse.id) {
        orderStripeMetadata = {
          stripePaymentIntentId: paymentIntentResponse.id,
          status: paymentIntentResponse.status,
          connectPaymentMethodId,
          consolidatedAmount,
          processingFees,
          buyAmount
        };
      }
    }

    // update customer cart with processed cart details
    const updatedCart = await CartModel.findOneAndUpdate(
      { cartId },
      {
        items: processedItems,
        customer: connectCustomer._id,
        user: userId
      },
      {
        new: true
      }
    );

    const newOrder = await new OrdersModel({
      status: OrderStatus.PENDING,
      type: OrderType.PURCHASE,
      scheduleType: OrderScheduleType.IMMEDIATE,
      scheduledDate: new Date(),
      scheduledTime: new Date(),
      cart: updatedCart._id,
      merchant: merchantId,
      user: userId,
      customer: connectCustomer._id,
      stripeMetadata: orderStripeMetadata
    }).save();

    await AlertsModel({
      order: newOrder._id,
      user: userId,
      merchant: merchantId,
      type: AlertType.ORDERS
    }).save();
  } catch (error) {
    logger.error("createCustomerOrder() -> error : ", error);
  }
};

module.exports = { createCustomerOrder };
