const moment = require("moment-timezone");

const router = require("express").Router({ mergeParams: true });

const OrdersModel = require("../../../../models/Orders");
const { validateToken } = require("../../../../utils/common");
const { OrderType } = require("../../../../constants/Orders");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../../../constants/App");
const logger = require("../../../../utils/logger");
const { PurchaseType } = require("../../../../constants/Payments");

router.get("/", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const { merchant } = token.user;

    const startOfMonth = moment().startOf("month");

    const endOfMonth = moment().endOf("month");

    const currentMonthOrders = await OrdersModel.find({
      merchant: merchant._id,
      type: OrderType.PURCHASE,
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    }).populate("cart");

    let onetimeMonthly = 0;

    let subscriptionMonthly = 0;

    let buyMorePayLessMonthly = 0;

    currentMonthOrders.forEach(elem => {
      elem.cart.items.forEach(item => {
        const {
          price: { purchaseType, totalAmount }
        } = item;

        if (purchaseType === PurchaseType.ONE_TIME) {
          onetimeMonthly += Number(totalAmount);
        }

        if (purchaseType === PurchaseType.SUBSCRIPTION) {
          subscriptionMonthly += Number(totalAmount);
        }

        if (purchaseType === PurchaseType.BUY_MORE_PAY_LESS) {
          buyMorePayLessMonthly += Number(totalAmount);
        }
      });
    });

    const totalMonthlyOrders = currentMonthOrders.length;

    const totalMonthlyRevenue = Number(
      onetimeMonthly + subscriptionMonthly + buyMorePayLessMonthly
    ).toFixed(2);

    const monthly = {
      total: totalMonthlyRevenue,
      oneTime: Number(onetimeMonthly).toFixed(2),
      subscription: Number(subscriptionMonthly).toFixed(2),
      buyMorePayLess: Number(buyMorePayLessMonthly).toFixed(2),
      orders: totalMonthlyOrders
    };

    const allOrders = await OrdersModel.find({
      merchant: merchant._id,
      type: OrderType.PURCHASE
    }).populate("cart");

    let onetimeTotal = 0;

    let subscriptionTotal = 0;

    let buyMorePayLessTotal = 0;

    allOrders.forEach(elem => {
      elem.cart.items.forEach(item => {
        const {
          price: { purchaseType, totalAmount }
        } = item;

        if (purchaseType === PurchaseType.ONE_TIME) {
          onetimeTotal += Number(totalAmount);
        }

        if (purchaseType === PurchaseType.SUBSCRIPTION) {
          subscriptionTotal += Number(totalAmount);
        }

        if (purchaseType === PurchaseType.BUY_MORE_PAY_LESS) {
          buyMorePayLessTotal += Number(totalAmount);
        }
      });
    });

    const totalOrders = allOrders.length;

    const totalRevenue = Number(
      onetimeTotal + subscriptionTotal + buyMorePayLessTotal
    ).toFixed(2);

    const averageOrderValue = Number(totalRevenue / totalOrders).toFixed(2);

    const overall = {
      total: totalRevenue,
      oneTime: Number(onetimeTotal).toFixed(2),
      subscription: Number(subscriptionTotal).toFixed(2),
      buyMorePayLess: Number(buyMorePayLessTotal).toFixed(2),
      orders: Number(totalOrders).toFixed(2),
      averageOrderValue
    };

    return res.status(200).json({
      success: true,
      data: {
        overall,
        monthly
      }
    });
  } catch (error) {
    logger.error("GET /api/v1/merchant/stats -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

module.exports = router;
