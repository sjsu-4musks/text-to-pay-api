const router = require("express").Router({ mergeParams: true });

const CustomersModel = require("../../../../models/Customers");
const { validateToken } = require("../../../../utils/common");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../../../constants/App");
const logger = require("../../../../utils/logger");

router.get("/", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const { merchant } = token.user;

    const customers = await CustomersModel.find({
      merchant,
      stripeConnectCustomerId: { $ne: null }
    });

    return res.status(200).json({ success: true, data: customers });
  } catch (error) {
    logger.error("GET /api/v1/merchant/customers -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

module.exports = router;
