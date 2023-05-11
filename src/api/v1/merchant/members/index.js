const crypto = require("crypto");

const router = require("express").Router({ mergeParams: true });

const UsersModel = require("../../../../models/Users");
const MerchantsModel = require("../../../../models/Merchants");
const { UserTypes, UserStatus } = require("../../../../constants/Users");
const {
  createSalt,
  hashPassword,
  encodeJWT
} = require("../../../../utils/jwt");
const { validateToken } = require("../../../../utils/common");
const { APP_HOST_URL } = require("../../../../utils/config");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../../../constants/App");
const logger = require("../../../../utils/logger");

router.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      merchantId
    } = req.body;

    if (!merchantId) {
      return res
        .status(400)
        .json({ success: false, message: "Merchant ID is required." });
    }

    const merchant = await MerchantsModel.findById(merchantId);

    if (!merchant) {
      return res
        .status(400)
        .json({ success: false, message: "Merchant does not exist." });
    }

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
      return res.status(400).json({
        success: false,
        message: "Password and confirm password does not match."
      });
    }

    const user = await UsersModel.findOne({
      email,
      merchant
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Invitation for this email does not exist. Please contact your account owner."
      });
    }

    if (user && user.status === UserStatus.ACTIVE) {
      return res.status(400).json({
        success: false,
        message:
          "User with this email already exists. Please sign in to continue."
      });
    }

    const hashedPassword = hashPassword(password, createSalt());

    const updatedUser = await UsersModel.findOneAndUpdate(
      { email, merchant: merchantId },
      {
        firstName,
        lastName,
        password: hashedPassword,
        status: UserStatus.ACTIVE
      },
      { new: true }
    ).populate("merchant");

    const token = encodeJWT({ userId: user._id });

    return res
      .status(200)
      .json({ success: true, data: { user: updatedUser, token } });
  } catch (error) {
    logger.error("POST /api/v1/merchant/members/signup -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.get("/", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const { merchant } = token.user;

    const users = await UsersModel.find({ merchant: merchant._id });

    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    logger.error("GET /api/v1/merchant/members -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.post("/invite", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const { merchant } = token.user;

    const { users } = req.body;

    if (!users || !users.length) {
      return res
        .status(400)
        .json({ success: false, message: "Atleast one member is required." });
    }

    for (let i = 0; i < users.length; i++) {
      const member = users[i];

      if (member && member.email && member.role) {
        const memberDetails = await UsersModel.findOne({
          email: member.email,
          merchant: merchant._id
        });

        if (memberDetails && memberDetails.status === UserStatus.ACTIVE) {
          continue; // eslint-disable-line
        }

        await UsersModel.findOneAndUpdate(
          {
            email: member.email,
            merchant: merchant._id
          },
          {
            email: member.email,
            role: member.role,
            status: UserStatus.INVITED,
            avatar: crypto
              .createHash("md5")
              .update(member.email)
              .digest("hex"),
            merchant: merchant._id,
            type: UserTypes.MERCHANT
          },
          {
            upsert: true
          }
        );

        const link = `https://merchant.${APP_HOST_URL}/signup?id=${merchant._id}&email=${member.email}`;

        // await sendEmail({
        //   to: member.email,
        //   subject: "Invitation from Text-to-Pay",
        //   text: `Hey there,\n\nYour team mate is inviting you to Text-to-Pay, please sign up from the below url.\n\n${link}`
        // });
      }
    }

    return res.status(200).json({
      success: true,
      message: `${
        users.length === 1 ? "Member" : "Members"
      } invited successfully.`
    });
  } catch (error) {
    logger.error("POST /api/v1/merchant/members/invite -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.put("/:userId/role", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const { merchant } = token.user;

    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required." });
    }

    const { role } = req.body;

    await UsersModel.findOneAndUpdate(
      { _id: userId, merchant: merchant._id },
      {
        role
      }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    logger.error(
      "PUT /api/v1/merchant/members/:userId/role -> error : ",
      error
    );

    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.put("/:userId/status", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const { merchant } = token.user;

    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required." });
    }

    const { status } = req.body;

    await UsersModel.findOneAndUpdate(
      { _id: userId, merchant: merchant._id },
      {
        status
      }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    logger.error(
      "PUT /api/v1/merchant/members/:userId/status -> error : ",
      error
    );

    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

module.exports = router;
