const express = require("express");
const crypto = require("crypto");
const { nanoid } = require("nanoid");

const router = express.Router();

const members = require("./members");
const orders = require("./orders");
const stats = require("./stats");
const alerts = require("./alerts");
const products = require("./products");
const customers = require("./customers");
const discounts = require("./discounts");

const UsersModel = require("../../../models/Users");
const MerchantsModel = require("../../../models/Merchants");

const {
  UserRoles,
  UserStatus,
  UserTypes
} = require("../../../constants/Users");
const { encodeJWT } = require("../../../utils/jwt");
const { validateToken } = require("../../../utils/common");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../../constants/App");
const { ProcessingFeesType } = require("../../../constants/Payments");
const logger = require("../../../utils/logger");

router.use("/members", members);
router.use("/orders", orders);
router.use("/stats", stats);
router.use("/alerts", alerts);
router.use("/products", products);
router.use("/customers", customers);
router.use("/discounts", discounts);

router.get("/", async (req, res) => {
  try {
    const { mId = null, subdomain = null } = req.query;

    if (!mId && !subdomain) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid params." });
    }

    let merchant = {};

    if (mId) {
      merchant = await MerchantsModel.findById(mId);
    }

    if (subdomain) {
      merchant = await MerchantsModel.findOne({ subdomain });
    }

    return res.status(200).json({
      success: true,
      data: merchant
    });
  } catch (error) {
    logger.error("GET /api/v1/merchant -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.post("/onboard", async (req, res) => {
  try {
    const { firstName, lastName, email, businessName } = req.body;

    if (!firstName) {
      return res
        .status(400)
        .json({ success: false, message: "First name is required." });
    }

    if (!lastName) {
      return res
        .status(400)
        .json({ success: false, message: "Last name is required." });
    }

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required." });
    }

    if (!businessName) {
      return res.status(400).json({
        success: false,
        message: "Business name is required."
      });
    }

    const user = await UsersModel.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User with email already exists."
      });
    }

    const newMerchant = await MerchantsModel({
      businessName,
      processingFeesType: ProcessingFeesType.MERCHANT
    }).save();

    const newUser = await new UsersModel({
      firstName,
      lastName,
      email,
      role: UserRoles.ADMIN,
      avatar: crypto
        .createHash("md5")
        .update(email)
        .digest("hex"),
      merchant: newMerchant._id,
      status: UserStatus.ACTIVE,
      type: UserTypes.MERCHANT
    }).save();

    const token = encodeJWT({ userId: newUser._id });

    return res
      .status(200)
      .json({ success: true, data: { id: newUser._id, token } });
  } catch (error) {
    logger.error("POST /api/v1/merchant/onboard -> error : ", error);

    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.post("/setup", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Id is required." });
    }

    const user = await UsersModel.findById(id).populate("merchant");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist."
      });
    }

    if (!user.merchant) {
      return res.status(400).json({
        success: false,
        message: "User is not associated with any merchant."
      });
    }

    const token = encodeJWT({ userId: user._id });

    return res.status(200).json({ success: true, data: { user, token } });
  } catch (error) {
    logger.error("POST /api/v1/merchant/setup -> error : ", error);

    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.get("/profile", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const { merchant } = token.user;

    if (!merchant) {
      return res.status(400).json({
        success: false,
        message: "User is not associated with any merchant."
      });
    }

    return res.status(200).json({ success: true, data: merchant });
  } catch (error) {
    logger.error("GET /api/v1/merchant/profile -> error : ", error);

    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.put("/profile", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const { merchant } = token.user;

    if (!merchant) {
      return res.status(400).json({
        success: false,
        message: "User is not associated with merchant."
      });
    }

    const {
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      zipcode,
      businessName,
      businessType,
      businessDescription,
      businessBannerBase64,
      businessBannerContentType,
      businessLogoBase64,
      businessLogoContentType
    } = req.body;

    const payload = {
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      zipcode,
      businessName,
      businessType,
      businessDescription
    };

    // if (businessBannerBase64 && businessBannerContentType) {
    //   const uploadedImage = await uploadImage({
    //     id: nanoid(10),
    //     imagePath: businessBannerBase64
    //   });

    //   if (uploadedImage && uploadedImage.secure_url) {
    //     payload.businessBanner = uploadedImage.secure_url;
    //   }
    // }

    // if (businessLogoBase64 && businessLogoContentType) {
    //   const uploadedImage = await uploadImage({
    //     id: nanoid(10),
    //     imagePath: businessLogoBase64
    //   });

    //   if (uploadedImage && uploadedImage.secure_url) {
    //     payload.businessLogo = uploadedImage.secure_url;
    //   }
    // }

    payload.businessProfileCreated = true;

    await MerchantsModel.findOneAndUpdate({ _id: merchant._id }, payload);

    return res.status(200).json({
      success: true,
      message: "Business profile updated successfully."
    });
  } catch (error) {
    logger.error("PUT /api/v1/merchant/profile -> error : ", error);

    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.post("/viewed", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const { merchant } = token.user;

    await MerchantsModel.findOneAndUpdate(
      { _id: merchant._id },
      { businessPageViewed: true }
    );

    return res.status(200).json({
      success: true
    });
  } catch (error) {
    logger.error("POST /api/v1/merchant/viewed -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.put("/processing-fees-type", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const { merchant } = token.user;

    const { processingFeesType } = req.body;

    if (!processingFeesType) {
      return res.status(400).json({
        success: false,
        message: "Processing fees type is required."
      });
    }

    await MerchantsModel.findOneAndUpdate(
      { _id: merchant._id },
      { processingFeesType }
    );

    return res.status(200).json({
      success: true,
      message: "Processing fees type updated."
    });
  } catch (error) {
    logger.error(
      "POST /api/v1/merchant/processing-fees-type -> error : ",
      error
    );
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

module.exports = router;
