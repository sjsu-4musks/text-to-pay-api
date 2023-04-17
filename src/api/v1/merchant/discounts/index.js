const router = require("express").Router({ mergeParams: true });

const DiscountsModel = require("../../../../models/Discounts");
const TextToPayModel = require("../../../../models/TextToPay");
const ConversationsModel = require("../../../../models/Conversations");
const { sendSMS } = require("../../../../services/twilio");
const { getNumberWord } = require("../../../../services/text-to-pay/helper");
const { validateToken } = require("../../../../utils/common");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../../../constants/App");
const {
  TextToPayFlow,
  TextToPayStep,
  TextToPayStatus
} = require("../../../../constants/TextToPay");
const {
  MessageType,
  ContextType,
  ContextStatus
} = require("../../../../constants/Conversations");
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

    const discounts = await DiscountsModel.find({
      merchant
    });

    return res.status(200).json({ success: true, data: discounts });
  } catch (error) {
    logger.error("GET /api/v1/merchant/discounts -> error : ", error);
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

    const { id: discountId } = req.params;

    if (!discountId) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required." });
    }

    const discount = await DiscountsModel.findOne({
      _id: discountId,
      merchant: merchant._id
    }).populate("products");

    return res.status(200).json({ success: true, data: discount });
  } catch (error) {
    logger.error("GET /api/v1/merchant/discounts/:id -> error : ", error);
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

    const { merchant } = token.user;

    const {
      title,
      discountType,
      discountAmount,
      discountSchedule,
      products,
      message
    } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required." });
    }

    if (!discountType) {
      return res
        .status(400)
        .json({ success: false, message: "Discount type is required." });
    }

    if (!discountAmount) {
      return res
        .status(400)
        .json({ success: false, message: "Discount amount is required." });
    }

    if (!discountSchedule) {
      return res
        .status(400)
        .json({ success: false, message: "Discount schedule is required." });
    }

    if (!products || !products.length) {
      return res
        .status(400)
        .json({ success: false, message: "Products are required." });
    }

    if (!message) {
      return res
        .status(400)
        .json({ success: false, message: "Message is required." });
    }

    await new DiscountsModel({
      title,
      discountType,
      discountAmount,
      discountSchedule,
      products,
      message,
      merchant: merchant._id
    }).save();

    return res
      .status(200)
      .json({ success: true, message: "Discount created successfully!" });
  } catch (error) {
    logger.error("POST /api/v2/merchant/discounts -> error : ", error);
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

    const {
      id: discountId,
      title,
      discountType,
      discountAmount,
      discountSchedule,
      products,
      message
    } = req.body;

    if (!discountId) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required." });
    }

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required." });
    }

    if (!discountType) {
      return res
        .status(400)
        .json({ success: false, message: "Discount type is required." });
    }

    if (!discountAmount) {
      return res
        .status(400)
        .json({ success: false, message: "Discount amount is required." });
    }

    if (!discountSchedule) {
      return res
        .status(400)
        .json({ success: false, message: "Discount schedule is required." });
    }

    if (!products || !products.length) {
      return res
        .status(400)
        .json({ success: false, message: "Products are required." });
    }

    if (!message) {
      return res
        .status(400)
        .json({ success: false, message: "Message is required." });
    }

    const updatedDiscount = await DiscountsModel.findOneAndUpdate(
      {
        _id: discountId,
        merchant: merchant._id
      },
      {
        title,
        discountType,
        discountAmount,
        discountSchedule,
        products,
        message
      },
      {
        new: true
      }
    ).populate("products");

    return res.status(200).json({
      success: true,
      data: updatedDiscount,
      message: "Discount updated successfully!"
    });
  } catch (error) {
    logger.error("PUT /api/v1/merchant/discounts -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.post("/invite-customer", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const { merchant } = token.user;

    const { discountId, customers } = req.body;

    if (!discountId) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required." });
    }

    if (!customers || !customers.length) {
      return res
        .status(400)
        .json({ success: false, message: "Customers are required." });
    }

    const discount = await DiscountsModel.findById(discountId).populate(
      "products"
    );

    const { products: productOptions, message } = discount;

    let selectedProduct = null;

    let selectedVariation = null;

    let steps = [];

    let currentStep = "";

    const options = [];

    if (productOptions.length === 1) {
      [selectedProduct] = productOptions;

      selectedVariation =
        selectedProduct.variations.length > 1
          ? null
          : selectedProduct.variations[0];

      steps = [TextToPayStep.SELECT_QUANTITY];

      currentStep = TextToPayStep.SELECT_QUANTITY;

      if (selectedVariation) {
        steps = [...steps, TextToPayStep.PAYMENT, TextToPayStep.ORDER];
      } else {
        steps = [
          ...steps,
          TextToPayStep.SELECT_VARIATION,
          TextToPayStep.PAYMENT,
          TextToPayStep.ORDER
        ];
      }

      options.push({
        label: "1",
        value: 1,
        numberString: "one"
      });

      options.push({
        label: "2",
        value: 2,
        numberString: "two"
      });

      options.push({
        label: "3",
        value: 3,
        numberString: "three"
      });
    } else {
      steps = [
        TextToPayStep.SELECT_PRODUCT,
        TextToPayStep.SELECT_VARIATION,
        TextToPayStep.SELECT_QUANTITY,
        TextToPayStep.PAYMENT,
        TextToPayStep.ORDER
      ];

      currentStep = TextToPayStep.SELECT_PRODUCT;

      productOptions.forEach((product, index) => {
        options.push({
          label: `${index + 1}`,
          value: product._id,
          numberString: getNumberWord(index + 1)
        });
      });
    }

    for (let i = 0; i < customers.length; i++) {
      const customer = customers[i];

      if (customer.phone) {
        const textToPay = await new TextToPayModel({
          phone: customer.phone,
          merchant: merchant._id,
          productOptions: productOptions.map(elem => elem._id),
          selectedProduct,
          selectedVariation,
          discount: discount._id,
          steps,
          currentStep,
          flow: TextToPayFlow.BUY,
          status: TextToPayStatus.INIT
        }).save();

        await new ConversationsModel({
          phone: customer.phone,
          message,
          type: MessageType.SENT,
          context: ContextType.QUESTION,
          status: ContextStatus.PENDING,
          options,
          textToPay: textToPay._id
        }).save();

        await sendSMS({
          to: customer.phone,
          body: message
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Discount sent to customers successfully!"
    });
  } catch (error) {
    logger.error(
      "POST /api/v2/merchant/discounts/invite-customer -> error : ",
      error
    );
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

module.exports = router;
