const { nanoid } = require("nanoid");

const UsersModel = require("../../models/Users");
const CustomerCartModel = require("../../models/Cart");
const TextToPayModel = require("../../models/TextToPay");
const ConversationsModel = require("../../models/Conversations");
const ProductsModel = require("../../models/Products");

const { sendSMS } = require("../twilio");
const { retrievePaymentMethod } = require("../stripe");
const { createCustomerOrder } = require("../orders");
const { MenuType } = require("../../constants/Menu");
const { PurchaseType } = require("../../constants/Payments");
const {
  TextToPayStep,
  TextToPayStatus,
  TextToPayFlow
} = require("../../constants/TextToPay");
const {
  MessageType,
  ContextType,
  ContextStatus
} = require("../../constants/Conversations");
const { getNumberWord, getNextStep, matchResponse } = require("./helper");
const { APP_HOST_URL } = require("../../utils/config");
const logger = require("../../utils/logger");

const buyFlow = async ({ phone, message }) => {
  try {
    const textToPay = await TextToPayModel.findOne({
      phone
    })
      .sort({ createdAt: "desc" })
      .populate("productOptions selectedProduct");

    const user = await UsersModel.findOne({ phone }).populate("customer");

    if (
      textToPay.currentStep === TextToPayStep.ORDER &&
      textToPay.status === TextToPayStatus.COMPLETE
    ) {
      return await sendSMS({
        to: phone,
        body: `Your order is complete, please contact the store for any further assistance.`
      });
    }

    if (textToPay.status === TextToPayStatus.COMPLETE) {
      return;
    }

    const currentQuestion = await ConversationsModel.findOne({
      context: ContextType.QUESTION,
      status: ContextStatus.PENDING,
      textToPay: textToPay._id
    }).sort({ createdAt: "asc" });

    console.log("currentQuestion : ", currentQuestion);

    if (currentQuestion) {
      let isOptionMatched = false;

      if (textToPay.currentStep === TextToPayStep.SELECT_PRODUCT) {
        const { selectedOption } = matchResponse(
          message,
          currentQuestion.options
        );

        if (selectedOption) {
          isOptionMatched = true;
          textToPay.selectedProduct = selectedOption.value;
        }
      } else if (textToPay.currentStep === TextToPayStep.SELECT_VARIATION) {
        const { selectedOption } = matchResponse(
          message,
          currentQuestion.options
        );

        if (selectedOption) {
          isOptionMatched = true;
          textToPay.selectedVariation = textToPay.selectedProduct.variations.find(
            variation => variation.id === selectedOption.value
          );
        }
      } else if (textToPay.currentStep === TextToPayStep.SELECT_QUANTITY) {
        const { selectedOption } = matchResponse(
          message,
          currentQuestion.options
        );

        if (selectedOption) {
          isOptionMatched = true;
          textToPay.quantity = selectedOption.value;
        }
      } else {
        const { selectedOption } = matchResponse(
          message,
          currentQuestion.options
        );

        isOptionMatched = Boolean(selectedOption);
      }

      console.log("isOptionMatched : ", isOptionMatched);

      if (!isOptionMatched) {
        await new ConversationsModel({
          phone,
          message,
          type: MessageType.RECEIVED,
          textToPay: textToPay._id
        }).save();

        return await sendSMS({
          to: phone,
          body:
            "Sorry, didn't get that! Please choose from the options provided :)"
        });
      }

      if (
        textToPay.currentStep === TextToPayStep.PAYMENT &&
        isOptionMatched &&
        matchResponse(message, currentQuestion.options).responseMessage === "no"
      ) {
        textToPay.status = TextToPayStatus.COMPLETE;
        await textToPay.save();

        await new ConversationsModel({
          phone,
          message,
          type: MessageType.RECEIVED,
          context: ContextType.RESPONSE,
          textToPay: textToPay._id
        }).save();

        return await sendSMS({
          to: phone,
          body: "Sounds good! Hope to see you soon :)"
        });
      }

      // option is matched, mark context as complete
      currentQuestion.status = ContextStatus.COMPLETE;
      currentQuestion.save();
    }

    await textToPay.save();

    await new ConversationsModel({
      phone,
      message,
      type: MessageType.RECEIVED,
      context: ContextType.RESPONSE,
      textToPay: textToPay._id
    }).save();

    // ---------------------------------------------------
    // FOR NEXT STEP
    // ---------------------------------------------------

    let nextStep = getNextStep(textToPay.steps, textToPay.currentStep);

    console.log("nextStep : ", nextStep);

    let sendMessage = "";
    let messageOptions = [];
    let context = "";
    let status = null;

    if (nextStep === TextToPayStep.SELECT_PRODUCT) {
      let productString = "";

      const productOptions = [];

      textToPay.productOptions.forEach((product, index) => {
        productString += `${index + 1} for ${product.title}\n`;

        productOptions.push({
          label: `${index + 1}`,
          value: product._id,
          numberString: getNumberWord(index + 1)
        });
      });

      sendMessage = `Which product do you want?\n\n${productString}`;

      messageOptions = productOptions;

      context = ContextType.QUESTION;

      status = ContextStatus.PENDING;
    }

    if (nextStep === TextToPayStep.SELECT_VARIATION) {
      let variationString = "";

      const variationOptions = [];

      const selectedProduct = await ProductsModel.findById(
        textToPay.selectedProduct
      );

      if (selectedProduct.variations.length === 1) {
        [textToPay.selectedVariation] = selectedProduct.variations;

        nextStep = TextToPayStep.SELECT_QUANTITY;
      } else {
        selectedProduct.variations.forEach((variation, index) => {
          variationString += `${index + 1} for ${variation.name}\n`;

          variationOptions.push({
            label: `${index + 1}`,
            value: variation.id,
            numberString: getNumberWord(index + 1)
          });
        });
      }

      sendMessage = `Which one do you want?\n\n${variationString}`;

      messageOptions = variationOptions;

      context = ContextType.QUESTION;

      status = ContextStatus.PENDING;
    }

    if (nextStep === TextToPayStep.SELECT_QUANTITY) {
      sendMessage = `How many would you like to have? Reply:\n\n1 for One\n2 for Two\n3 for Three`;

      messageOptions = [
        {
          label: "1",
          value: 1,
          numberString: "one"
        },
        {
          label: "2",
          value: 2,
          numberString: "two"
        },
        {
          label: "3",
          value: 3,
          numberString: "three"
        }
      ];

      context = ContextType.QUESTION;

      status = ContextStatus.PENDING;
    }

    if (nextStep === TextToPayStep.PAYMENT) {
      const paymentMethodId =
        user && user.customer && user.customer.stripePaymentMethods[0]
          ? user.customer.stripePaymentMethods[0]
          : null;

      console.log("paymentMethodId : ", paymentMethodId);

      if (!paymentMethodId) {
        return await sendSMS({
          to: phone,
          body: `It looks like you are a new customer, please click on the link below to get your details setup. https://app.${APP_HOST_URL}/text-to-pay/payment?flow=${TextToPayFlow.BUY}&phone=${phone}`
        });
      }

      const platformPaymentMethodResponse = await retrievePaymentMethod({
        paymentMethodId
      });

      sendMessage = `Perfect! Do we have your confirmation to charge ${platformPaymentMethodResponse.card.brand} ${platformPaymentMethodResponse.card.last4}?\n\nYes = Confirm\nNo = Another time`;

      messageOptions = [
        {
          label: "Yes",
          value: "yes"
        },
        {
          label: "No",
          value: "no"
        }
      ];

      context = ContextType.QUESTION;

      status = ContextStatus.PENDING;

      textToPay.status = TextToPayStatus.IN_PROGRESS;
    }

    if (nextStep === TextToPayStep.ORDER) {
      const paymentMethodId = user.customer.stripePaymentMethods[0];

      const totalAmount =
        Number(textToPay.quantity) * Number(textToPay.selectedVariation.price);

      const items = [
        {
          product: textToPay.selectedProduct._id,
          discount: textToPay.discount,
          stripeProductId: textToPay.selectedProduct.stripeProductId,
          menuType: MenuType.PRODUCTS,
          type: textToPay.selectedProduct.type,
          title: textToPay.selectedProduct.title,
          description: textToPay.selectedProduct.description,
          images: textToPay.selectedProduct.images,
          price: {
            purchaseType: PurchaseType.ONE_TIME,
            variation: textToPay.selectedVariation,
            modifiers: [],
            quantity: textToPay.quantity,
            amount: totalAmount,
            totalAmount
          }
        }
      ];

      const cartId = nanoid();

      await new CustomerCartModel({
        cartId,
        items,
        merchant: textToPay.merchant
      }).save();

      await createCustomerOrder({
        merchantId: textToPay.merchant,
        userId: user._id,
        cartId,
        items,
        paymentMethodId
      });

      sendMessage = `Confirmed! We’ll see you soon. Thank you for your business, ${user.customer.name}.`;

      context = ContextType.STATEMENT;

      textToPay.status = TextToPayStatus.COMPLETE;

      if (!textToPay.customer) {
        textToPay.customer = user.customer._id;
      }
    }

    textToPay.currentStep = nextStep;
    await textToPay.save();

    await new ConversationsModel({
      phone,
      type: MessageType.SENT,
      message: sendMessage,
      context,
      status,
      options: messageOptions,
      textToPay: textToPay._id
    }).save();

    return await sendSMS({
      to: phone,
      body: sendMessage
    });
  } catch (error) {
    logger.error("buyFlow() -> error : ", error);
  }
};

module.exports = { buyFlow };
