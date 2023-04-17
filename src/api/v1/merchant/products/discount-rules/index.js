const router = require("express").Router({ mergeParams: true });

const DiscountRulesModel = require("../../../../../models/DiscountRules");
const { validateToken } = require("../../../../../utils/common");
const {
  INTERNAL_SERVER_ERROR_MESSAGE
} = require("../../../../../constants/App");
const logger = require("../../../../../utils/logger");

router.get("/", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const { merchant } = token.user;

    const discountRules = await DiscountRulesModel.find({
      merchant: merchant._id
    }).populate("merchant");

    return res.status(200).json({ success: true, data: discountRules });
  } catch (error) {
    logger.error(
      "GET /api/v1/merchant/products/discount-rules -> error : ",
      error
    );
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

    const { merchant } = token.user;

    const { id: discountRuleId } = req.params;

    if (!discountRuleId) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required." });
    }

    const discountRule = await DiscountRulesModel.findOne({
      _id: discountRuleId,
      merchant: merchant._id
    }).populate("merchant");

    return res.status(200).json({ success: true, data: discountRule });
  } catch (error) {
    logger.error(
      "GET /api/v1/merchant/products/discount-rules/:id -> error : ",
      error
    );
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.post("/", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const { title, discount } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required." });
    }

    if (!discount) {
      return res
        .status(400)
        .json({ success: false, message: "Discount is required." });
    }

    const { merchant } = token.user;

    await new DiscountRulesModel({
      title,
      discount,
      merchant
    }).save();

    return res
      .status(200)
      .json({ success: true, message: "Discount rule created successfully!" });
  } catch (error) {
    logger.error(
      "POST /api/v2/merchant/products/discount-rules -> error : ",
      error
    );
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.put("/", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const { merchant } = token.user;

    const { id: discountRuleId, title, discount } = req.body;

    if (!discountRuleId) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required." });
    }

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required." });
    }

    if (!discount) {
      return res
        .status(400)
        .json({ success: false, message: "Discount is required." });
    }

    const updatedDiscountRule = await DiscountRulesModel.findOneAndUpdate(
      { _id: discountRuleId, merchant: merchant._id },
      {
        title,
        discount
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: updatedDiscountRule,
      message: "Discount rule updated successfully!"
    });
  } catch (error) {
    logger.error(
      "PUT /api/v1/merchant/products/discount-rules -> error : ",
      error
    );
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

module.exports = router;
