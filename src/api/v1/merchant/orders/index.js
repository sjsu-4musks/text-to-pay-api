const router = require("express").Router({ mergeParams: true });
const moment = require("moment-timezone");

const OrdersModel = require("../../../../models/Orders");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../../../constants/App");
const {
  OrderStatus,
  OrderDurationFilter
} = require("../../../../constants/Orders");
const { validateToken } = require("../../../../utils/common");
const logger = require("../../../../utils/logger");

router.get("/", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const {
      user: { merchant }
    } = token;

    const { duration } = req.query;

    if (!duration) {
      return res
        .status(400)
        .json({ success: false, message: "Duration is required." });
    }

    let todayOrders = [];
    let futureOrders = [];
    let pastOrders = [];

    if (duration === OrderDurationFilter.TODAY) {
      todayOrders = await OrdersModel.find({
        merchant: merchant._id,
        scheduledDate: {
          $gte: moment()
            .startOf("day")
            .toISOString(),
          $lte: moment()
            .endOf("day")
            .toISOString()
        }
      }).populate("merchant user cart");
    }

    if (
      duration === OrderDurationFilter.TODAY ||
      duration === OrderDurationFilter.FUTURE
    ) {
      futureOrders = await OrdersModel.find({
        merchant: merchant._id,
        scheduledDate: {
          $gte: moment()
            .add(1, "day")
            .startOf("day")
            .toISOString()
        }
      }).populate("merchant user cart");
    }

    if (duration === OrderDurationFilter.PAST) {
      pastOrders = await OrdersModel.find({
        merchant: merchant._id,
        scheduledDate: {
          $lte: moment()
            .subtract(1, "day")
            .endOf("day")
            .toISOString()
        }
      }).populate("merchant user cart");
    }

    let payload = {};

    if (duration === OrderDurationFilter.TODAY) {
      payload.today = todayOrders;
      payload.future = futureOrders;
    }

    if (duration === OrderDurationFilter.FUTURE) {
      payload = futureOrders;
    }

    if (duration === OrderDurationFilter.PAST) {
      payload = pastOrders;
    }

    return res.status(200).json({ success: true, data: payload });
  } catch (error) {
    logger.error("GET /api/v1/merchant/orders -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const {
      user: { merchant }
    } = token;

    const { id: orderId } = req.params;

    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "Order ID is required." });
    }

    const order = await OrdersModel.findOne({
      _id: orderId,
      merchant
    }).populate("merchant user cart");

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    logger.error("GET /api/v1/merchant/orders/:id -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required." });
    }

    const { status } = req.body;

    if (status && !Object.values(OrderStatus).includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Status is invalid." });
    }

    const payload = {
      status
    };

    if (status === OrderStatus.COMPLETED) {
      payload.servicedAt = new Date();
    }

    await OrdersModel.findOneAndUpdate({ _id: id }, payload);

    return res
      .status(200)
      .json({ success: true, message: "Order status updated successfully." });
  } catch (error) {
    logger.error("PUT /api/v1/merchant/orders/:id -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

module.exports = router;
