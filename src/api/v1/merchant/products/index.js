const { nanoid } = require("nanoid");

const router = require("express").Router({ mergeParams: true });

const modifiers = require("./modifiers");
const discountRules = require("./discount-rules");

const MerchantsModel = require("../../../../models/Merchants");
const ProductsModel = require("../../../../models/Products");
const { validateToken } = require("../../../../utils/common");
const { createProduct } = require("../../../../services/stripe");
// const { uploadImage } = require("../../../../services/cloudinary");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../../../constants/App");
const { ItemType, ItemStatus } = require("../../../../constants/Products");
const logger = require("../../../../utils/logger");

router.use("/modifiers", modifiers);
router.use("/discount-rules", discountRules);

router.get("/", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const { merchant } = token.user;

    const products = await ProductsModel.find({
      merchant: merchant._id,
      type: ItemType.PRODUCT,
      deleted: { $ne: true }
    }).populate("merchant");

    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    logger.error("GET /api/v1/merchant/products -> error : ", error);
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

    const { id: productId } = req.params;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required." });
    }

    const product = await ProductsModel.findOne({
      _id: productId,
      merchant: merchant._id,
      type: ItemType.PRODUCT
    }).populate("merchant");

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    logger.error("GET /api/v1/merchant/products/:id -> error : ", error);
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
      description,
      images,
      variations,
      discountRule = undefined,
      timeUnits = "",
      timePeriod = "",
      forCC = false
    } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required." });
    }

    if (!description) {
      return res
        .status(400)
        .json({ success: false, message: "Description is required." });
    }

    if (!variations || !variations.length) {
      return res
        .status(400)
        .json({ success: false, message: "Variations is required." });
    }

    // if (!forCC && !discountRule) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Discount rule is required." });
    // }

    if (merchant.isB2B && (!timeUnits || !timePeriod)) {
      return res
        .status(400)
        .json({ success: false, message: "Lead time is required." });
    }

    // let imageUrls = [];

    // let shouldUploadImages = false;

    // if (images.some(elem => elem.contentType)) {
    //   shouldUploadImages = true;
    // } else {
    //   imageUrls = images;
    // }

    // if (shouldUploadImages) {
    //   for (const image of images) {
    //     const uploadedImage = await uploadImage({
    //       id: nanoid(10),
    //       imagePath: image.base64
    //     });

    //     if (uploadedImage && uploadedImage.secure_url) {
    //       imageUrls.push(uploadedImage.secure_url);
    //     }
    //   }
    // }

    const product = await new ProductsModel({
      title,
      description,
      // images: imageUrls,
      type: ItemType.PRODUCT,
      status: !merchant.stripeEnabled
        ? ItemStatus.UN_PUBLISHED
        : ItemStatus.PUBLISHED,
      merchant: merchant._id,
      variations,
      discountRule,
      timeUnits,
      timePeriod,
      forCC
    }).save();

    if (!merchant.ruleSetCreated) {
      await MerchantsModel.findOneAndUpdate(
        { _id: merchant._id },
        { ruleSetCreated: true }
      );
    }

    if (merchant.stripeEnabled) {
      const productResponse = await createProduct({
        name: title,
        description,
        metadata: {
          merchantId: merchant._id,
          productId: product._id
        },
        stripeAccount: merchant.stripeAccountId
      });

      logger.debug("productResponse : ", productResponse);

      if (productResponse && productResponse.id) {
        product.stripeProductId = productResponse.id;
        product.save();
      }
    }

    return res
      .status(200)
      .json({ success: true, message: "Product created successfully!" });
  } catch (error) {
    logger.error("POST /api/v2/merchant/products -> error : ", error);
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
      id: productId,
      title,
      description,
      images,
      variations,
      discountRule = undefined,
      timeUnits = "",
      timePeriod = ""
    } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required." });
    }

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required." });
    }

    if (!description) {
      return res
        .status(400)
        .json({ success: false, message: "Description is required." });
    }

    if (!variations || !variations.length) {
      return res
        .status(400)
        .json({ success: false, message: "Variations is required." });
    }

    // if (!forCC && !discountRule) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Discount rule is required." });
    // }

    if (merchant.isB2B && (!timeUnits || !timePeriod)) {
      return res
        .status(400)
        .json({ success: false, message: "Lead time is required." });
    }

    // let imageUrls = [];

    // let shouldUploadImages = false;

    // if (images.some(elem => elem.contentType)) {
    //   shouldUploadImages = true;
    // } else {
    //   imageUrls = images;
    // }

    // if (shouldUploadImages) {
    //   for (const image of images) {
    //     const uploadedImage = await uploadImage({
    //       id: nanoid(10),
    //       imagePath: image.base64
    //     });

    //     if (uploadedImage && uploadedImage.secure_url) {
    //       imageUrls.push(uploadedImage.secure_url);
    //     }
    //   }
    // }

    if (!merchant.ruleSetCreated) {
      await MerchantsModel.findOneAndUpdate(
        { _id: merchant._id },
        { ruleSetCreated: true }
      );
    }

    const updatedProduct = await ProductsModel.findOneAndUpdate(
      { _id: productId, type: ItemType.PRODUCT },
      {
        title,
        description,
        // images: imageUrls,
        discountRule,
        timeUnits,
        timePeriod,
        variations
      },
      {
        new: true
      }
    );

    return res.status(200).json({
      success: true,
      data: updatedProduct,
      message: "Product updated successfully!"
    });
  } catch (error) {
    logger.error("PUT /api/v1/merchant/products -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.post("/clone", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const { merchant } = token.user;

    const { id: productId } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required." });
    }

    const parentProduct = await ProductsModel.findById(productId);

    if (!parentProduct) {
      return res
        .status(400)
        .json({ success: false, message: "Parent product does not exists." });
    }

    const clonedProduct = await new ProductsModel({
      title: `${parentProduct.title} (cloned)`,
      description: parentProduct.description,
      images: parentProduct.images,
      type: ItemType.PRODUCT,
      status: !merchant.stripeEnabled
        ? ItemStatus.UN_PUBLISHED
        : ItemStatus.PUBLISHED,
      merchant: merchant._id,
      variations: parentProduct.variations,
      discountRule: parentProduct.discountRule,
      timeUnits: parentProduct.timeUnits,
      timePeriod: parentProduct.timePeriod
    }).save();

    if (merchant.stripeEnabled) {
      const productResponse = await createProduct({
        name: clonedProduct.title,
        description: clonedProduct.description,
        metadata: {
          merchantId: merchant._id,
          productId: clonedProduct._id
        },
        stripeAccount: merchant.stripeAccountId
      });

      logger.debug("productResponse : ", productResponse);

      if (productResponse && productResponse.id) {
        clonedProduct.stripeProductId = productResponse.id;
        clonedProduct.save();
      }
    }

    return res
      .status(200)
      .json({ success: true, message: "Product cloned successfully!" });
  } catch (error) {
    logger.error("POST /api/v2/merchant/products/clone -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.delete("/", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const { merchant } = token.user;

    const { id } = req.query;

    await ProductsModel.findOneAndUpdate(
      { _id: id, merchant: merchant._id },
      { deleted: true }
    );

    return res.status(200).json({ success: true, message: "Product deleted." });
  } catch (error) {
    logger.error("DELETE /api/v1/merchant/products -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

module.exports = router;
