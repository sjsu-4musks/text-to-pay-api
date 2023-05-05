const express = require("express");
const crypto = require("crypto");
const { nanoid } = require("nanoid");

const router = express.Router();

const members = require("./members");
const alerts = require("./alerts");
const customers = require("./customers");
const discounts = require("./discounts");
const products = require("./products");

const UsersModel = require("../../../models/Users");
const MerchantsModel = require("../../../models/Merchants");

const {
  UserRoles,
  UserStatus,
  UserTypes
} = require("../../../constants/Users");
const { createSalt, hashPassword, encodeJWT } = require("../../../utils/jwt");
const { validateToken } = require("../../../utils/common");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../../constants/App");
const logger = require("../../../utils/logger");

router.use("/members", members);
router.use("/alerts", alerts);
router.use("/customers", customers);
router.use("/discounts", discounts);
router.use("/products", products);

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
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      businessName
    } = req.body;

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

    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required." });
    }

    if (!confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Confirm password is required." });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match." });
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

    const hashedPassword = hashPassword(password, createSalt());

    const newUser = await new UsersModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: UserRoles.ADMIN,
      avatar: crypto
        .createHash("md5")
        .update(email)
        .digest("hex"),
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
