const router = require("express").Router({ mergeParams: true });

const ModifiersModel = require("../../../../../models/Modifiers");
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

    const modifiers = await ModifiersModel.find({
      merchant: merchant._id
    }).populate("merchant");

    return res.status(200).json({ success: true, data: modifiers });
  } catch (error) {
    logger.error("GET /api/v1/merchant/products/modifiers -> error : ", error);
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

    const { id: modifierId } = req.params;

    if (!modifierId) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required." });
    }

    const modifier = await ModifiersModel.findOne({
      _id: modifierId,
      merchant: merchant._id
    }).populate("merchant");

    return res.status(200).json({ success: true, data: modifier });
  } catch (error) {
    logger.error(
      "GET /api/v1/merchant/products/modifiers/:id -> error : ",
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

    const { title, modifiers } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required." });
    }

    if (!modifiers || !modifiers.length) {
      return res
        .status(400)
        .json({ success: false, message: "Modifiers is required." });
    }

    const { merchant } = token.user;

    const newModifier = await new ModifiersModel({
      title,
      modifiers,
      merchant
    }).save();

    return res
      .status(200)
      .json({ success: true, message: "Modifier set created successfully!" });
  } catch (error) {
    logger.error("POST /api/v2/merchant/products/modifiers -> error : ", error);
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

    const { id: modifierId, title, modifiers } = req.body;

    if (!modifierId) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required." });
    }

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required." });
    }

    if (!modifiers || !modifiers.length) {
      return res
        .status(400)
        .json({ success: false, message: "Modifiers is required." });
    }

    const updatedModifier = await ModifiersModel.findOneAndUpdate(
      { _id: modifierId },
      {
        title,
        modifiers
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: updatedModifier,
      message: "Modifier set updated successfully!"
    });
  } catch (error) {
    logger.error("PUT /api/v1/merchant/products/modifiers -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

module.exports = router;
