const express = require("express");
const crypto = require("crypto");

const router = express.Router();

const UsersModel = require("../../../models/Users");
const OTPModel = require("../../../models/OTP");
const CustomersModel = require("../../../models/Customers");
const MerchantsModel = require("../../../models/Merchants");
const {
  UserRoles,
  UserTypes,
  UserStatus
} = require("../../../constants/Users");
const { createCustomer } = require("../../../services/stripe");
const { sendSMS } = require("../../../services/twilio");
const { createSalt, hashPassword, encodeJWT } = require("../../../utils/jwt");
const { validateToken } = require("../../../utils/common");
const { APP_HOST_URL } = require("../../../utils/config");
const { decodeJWT } = require("../../../utils/jwt");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../../constants/App");
const logger = require("../../../utils/logger");

// for consumers
router.post("/signup/email", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName) {
      return res
        .status(400)
        .json({ success: false, message: "First name is required." });
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

    const user = await UsersModel.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User with email already exists. Please sign in."
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
      type: UserTypes.CUSTOMER
    }).save();

    const name = `${firstName}${lastName ? ` ${lastName}` : ""}`;

    const newCustomer = await new CustomersModel({
      name,
      email,
      user: newUser._id
    }).save();

    newUser.customer = newCustomer._id;
    newUser.save();

    // create customer on Stripe platform account
    const customerResponse = await createCustomer({
      name,
      email,
      metadata: {
        userId: newUser._id,
        platformCustomerId: newCustomer._id
      }
    });

    logger.debug("customerResponse : ", customerResponse);

    if (customerResponse && customerResponse.id) {
      newCustomer.stripeMetadata = { platformCustomerId: customerResponse.id };
      newCustomer.save();
    }

    const updatedUser = await UsersModel.findById(newUser._id).populate(
      "merchant customer"
    );

    return res.status(200).json({
      success: true,
      data: {
        user: updatedUser,
        token: encodeJWT({ userId: newUser._id })
      }
    });
  } catch (error) {
    logger.error("POST /api/v1/users/signup -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.post("/signin/email", async (req, res) => {
  try {
    const { email, password } = req.body;

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

    const user = await UsersModel.findOne({ email }).populate(
      "merchant customer"
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "User with email does not exist. Please check your credentials and try again."
      });
    }

    const salt = user.password.split("$")[0];

    const hashedPassword = hashPassword(password, salt);

    if (hashedPassword !== user.password) {
      return res.status(403).json({
        success: false,
        message: "Incorrect password. Please try again."
      });
    }

    const token = encodeJWT({ userId: user._id });

    return res.status(200).json({ success: true, data: { user, token } });
  } catch (error) {
    logger.error("POST /api/v1/users/signin/email -> error : ", error);

    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.post("/generate-otp", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res
        .status(400)
        .json({ success: false, message: "Phone is required." });
    }

    // generate 6 digit random number
    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

    const smsResponse = await sendSMS({
      body: `Text-to-Pay - Your OTP is ${otp}. OTP expires in 10 mins, never share with anyone.`,
      to: phone
    });

    logger.debug("smsResponse : ", smsResponse);

    const encodedOtp = encodeJWT({ otp }, { expiresIn: 600 });

    await OTPModel({
      phone,
      otp: encodedOtp
    }).save();

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully."
    });
  } catch (error) {
    logger.error("POST /api/v1/users/generate-otp -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const {
      email,
      phone,
      otp,
      isSignUp,
      firstName,
      lastName,
      subdomain,
      address = null
    } = req.body;

    if (!phone) {
      return res
        .status(400)
        .json({ success: false, message: "Phone is required." });
    }

    if (!otp) {
      return res
        .status(400)
        .json({ success: false, message: "OTP is required." });
    }

    if (isSignUp && !firstName) {
      return res
        .status(400)
        .json({ success: false, message: "First name is required." });
    }

    let merchant = null;
    let redirectUrl = null;

    if (subdomain) {
      merchant = await MerchantsModel.findOne({ subdomain });

      if (!merchant) {
        return res
          .status(400)
          .json({ success: false, message: "Merchant does not exist." });
      }

      redirectUrl = `https://app.${APP_HOST_URL}/menu?mId=${merchant._id}`;
    }

    const savedOtp = await OTPModel.findOne({
      phone
    }).sort({ createdAt: -1 });

    logger.debug("savedOtp : ", savedOtp);

    if (!savedOtp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request." });
    }

    const decodedOtp = decodeJWT(savedOtp.otp);

    if (!decodedOtp || !decodedOtp.otp || !decodedOtp.exp) {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }

    if (Date.now() >= decodedOtp.exp * 1000) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please try again."
      });
    }

    if (decodedOtp.otp !== otp) {
      return res.status(403).json({
        success: false,
        message: "Incorrect OTP."
      });
    }

    const user = await UsersModel.findOne({ phone, type: UserTypes.CUSTOMER });

    if (!isSignUp && !user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist."
      });
    }

    if (user) {
      return res.status(200).json({
        success: true,
        data: {
          user,
          token: encodeJWT({ userId: user._id }),
          redirectUrl
        }
      });
    }

    const newUser = await new UsersModel({
      firstName,
      lastName,
      phone,
      email,
      address,
      role: UserRoles.ADMIN,
      avatar: crypto
        .createHash("md5")
        .update(firstName)
        .digest("hex"),
      status: UserStatus.ACTIVE,
      type: UserTypes.CUSTOMER
    }).save();

    const name = `${firstName}${lastName ? ` ${lastName}` : ""}`;

    const platformCustomer = await new CustomersModel({
      name,
      phone,
      user: newUser._id
    }).save();

    newUser.customer = platformCustomer._id;
    newUser.save();

    // create customer on Stripe platform account
    const stripePlatformCustomerResponse = await createCustomer({
      name,
      phone,
      metadata: {
        userId: newUser._id,
        platformCustomerId: platformCustomer._id
      }
    });

    logger.debug(
      "stripePlatformCustomerResponse : ",
      stripePlatformCustomerResponse
    );

    platformCustomer.stripeMetadata = {
      platformCustomerId: stripePlatformCustomerResponse.id
    };
    platformCustomer.save();

    if (subdomain) {
      // create new Stripe connect customer
      const connectCustomer = await new CustomersModel({
        name,
        phone,
        merchant: merchant._id,
        user: newUser._id
      }).save();

      // create customer on Stripe connect account
      const stripeConnectCustomerResponse = await createCustomer({
        name,
        phone,
        metadata: {
          merchantId: merchant._id,
          userId: newUser._id,
          platformCustomerId: platformCustomer._id
        },
        stripeAccount: merchant.stripeAccountId
      });

      logger.debug(
        "stripeConnectCustomerResponse : ",
        stripeConnectCustomerResponse
      );

      // set connect customer id for Stripe connect customer
      connectCustomer.stripeConnectCustomerId =
        stripeConnectCustomerResponse.id;
      connectCustomer.save();
    }

    const updatedUser = await UsersModel.findById(newUser._id).populate(
      "merchant customer"
    );

    return res.status(200).json({
      success: true,
      data: {
        user: updatedUser,
        token: encodeJWT({ userId: newUser._id }),
        redirectUrl
      }
    });
  } catch (error) {
    logger.error("POST /api/v1/users/verify-otp -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.get("/info", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const { userId } = token;

    const user = await UsersModel.findById(userId).populate(
      "merchant customer"
    );

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    logger.error("GET /api/v1/users/info -> error : ", error);

    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

module.exports = router;
