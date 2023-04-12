const router = require("express").Router({ mergeParams: true });

const AlertsModel = require("../../../../models/Alerts");
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

    const {
      user: { merchant }
    } = token;

    const { type } = req.query;

    if (!type) {
      return res
        .status(400)
        .json({ success: false, message: "Type is required." });
    }

    const alerts = await AlertsModel.find({
      type,
      merchant: merchant._id
    }).populate("order user");

    return res.status(200).json({ success: true, data: alerts });
  } catch (error) {
    logger.error("GET /api/v1/merchant/alerts -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

module.exports = router;
