const TextToPayModel = require("../../models/TextToPay");
const ConversationsModel = require("../../models/Conversations");

const { sendSMS } = require("../twilio");
const { TextToPayFlow, TextToPayStatus } = require("../../constants/TextToPay");
const {
  MessageType,
  ContextType,
  ContextStatus
} = require("../../constants/Conversations");
const { getNumberWord, getNextStep, matchResponse } = require("./helper");
const { APP_HOST_URL } = require("../../utils/config");
const logger = require("../../utils/logger");

const DemoType = {
  CROISSANT: "CROISSANT",
  LULULEMON: "LULULEMON",
  EXPRESS: "EXPRESS"
};

const DemoStep = {
  INTRO: "INTRO",
  USE_CASE: "USE_CASE",
  OFFER: "OFFER",
  SELECT_VARIATION: "SELECT_VARIATION",
  PAYMENT: "PAYMENT",
  ORDER: "ORDER"
};

const CroissantVariations = [
  {
    id: 1,
    name: "Regular",
    price: 2
  },
  {
    id: 2,
    name: "Chocolate",
    price: 3
  },
  {
    id: 3,
    name: "Almond",
    price: 4
  }
];

const ExpressVariations = [
  {
    id: 1,
    name: "5 Gallon Pail",
    price: 375
  },
  {
    id: 2,
    name: "30 Gallon Drum",
    price: 1350
  },
  {
    id: 3,
    name: "55 Gallon Drum",
    price: 2035
  }
];

const demoFlow = async ({ phone, message, retryPayment = false }) => {
  try {
    if (
      String(message).includes("#demo-croissants") ||
      String(message).includes("#demo-lululemon") ||
      String(message).includes("#demo-express")
    ) {
      let demoType = "";

      if (String(message).includes("#demo-croissants")) {
        demoType = DemoType.CROISSANT;
      }

      if (String(message).includes("#demo-lululemon")) {
        demoType = DemoType.LULULEMON;
      }

      if (String(message).includes("#demo-express")) {
        demoType = DemoType.EXPRESS;
      }

      if (!demoType) {
        return;
      }

      const steps = [DemoType.CROISSANT, DemoType.EXPRESS].includes(demoType)
        ? Object.values(DemoStep)
        : Object.values(DemoStep).filter(
            elem => elem !== DemoStep.SELECT_VARIATION
          );

      const textToPay = await new TextToPayModel({
        phone,
        steps,
        demoType,
        flow: TextToPayFlow.DEMO,
        currentStep: DemoStep.INTRO,
        status: TextToPayStatus.INIT
      }).save();

      await new ConversationsModel({
        phone,
        message,
        type: MessageType.SENT,
        context: ContextType.QUESTION,
        status: ContextStatus.PENDING,
        options: [
          {
            label: "Yes",
            value: "yes"
          },
          {
            label: "No",
            value: "no"
          }
        ],
        textToPay: textToPay._id
      }).save();

      return await sendSMS({
        to: phone,
        body: `Hi, thanks for your interest in Text-to-Pay. Before we hop on this mustang - would you like a demo?`
      });
    }

    const textToPay = await TextToPayModel.findOne({
      phone,
      flow: TextToPayFlow.DEMO
    }).sort({ createdAt: "desc" });

    if (
      textToPay.currentStep === DemoStep.ORDER &&
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

    // -------------------------------------------------
    // for current context
    // -------------------------------------------------

    if (currentQuestion) {
      let isOptionMatched = false;

      if (textToPay.currentStep === DemoStep.INTRO) {
        isOptionMatched = true;
      } else if (textToPay.currentStep === DemoStep.OFFER) {
        const { selectedOption } = matchResponse(
          message,
          currentQuestion.options
        );

        if (selectedOption) {
          isOptionMatched = true;

          if (textToPay.demoType === DemoType.CROISSANT) {
            textToPay.quantity = selectedOption.value;
          } else {
            textToPay.quantity = 1;
          }
        }
      } else if (textToPay.currentStep === DemoStep.SELECT_VARIATION) {
        const { selectedOption } = matchResponse(
          message,
          currentQuestion.options
        );

        if (selectedOption) {
          isOptionMatched = true;

          let variations = [];

          if (textToPay.demoType === DemoType.CROISSANT) {
            variations = CroissantVariations;
          } else {
            variations = ExpressVariations;
          }

          textToPay.selectedVariation = variations.find(
            variation => variation.id === selectedOption.value
          );
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
        textToPay.currentStep === DemoStep.PAYMENT &&
        isOptionMatched &&
        matchResponse(message, currentQuestion.options).responseMessage ===
          "edit" &&
        !retryPayment
      ) {
        await new ConversationsModel({
          phone,
          message,
          type: MessageType.RECEIVED,
          context: ContextType.RESPONSE,
          textToPay: textToPay._id
        }).save();

        await new ConversationsModel({
          phone,
          message,
          type: MessageType.SENT,
          context: ContextType.STATEMENT,
          status: ContextStatus.COMPLETE,
          textToPay: textToPay._id
        }).save();

        textToPay.currentStep = DemoStep.PAYMENT;

        return await sendSMS({
          to: phone,
          body: `Click here to edit or put in your card details and address https://app.${APP_HOST_URL}/text-to-pay/payment?flow=${TextToPayFlow.DEMO}`
        });
      }

      if (
        textToPay.currentStep === DemoStep.PAYMENT &&
        isOptionMatched &&
        matchResponse(message, currentQuestion.options).responseMessage === "no"
      ) {
        textToPay.status = TextToPayStatus.COMPLETE;
        textToPay.save();

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

      await new ConversationsModel({
        phone,
        message,
        type: MessageType.RECEIVED,
        context: ContextType.RESPONSE,
        textToPay: textToPay._id
      }).save();
    }

    // -------------------------------------------------
    // FOR NEXT STEP
    // -------------------------------------------------

    const nextStep = getNextStep(textToPay.steps, textToPay.currentStep);

    let sendMessage = "";
    let messageOptions = [];
    let context = "";
    let status = null;
    let mediaUrl = [];

    if (nextStep === DemoStep.USE_CASE) {
      if (textToPay.demoType === DemoType.CROISSANT) {
        sendMessage =
          "That’s what we’re talking about. Let’s get into it! Imagine you receive a text from your favorite cafe about some croissants they have!";
      }

      if (textToPay.demoType === DemoType.LULULEMON) {
        sendMessage =
          "That’s what we’re talking about. Let’s get into it! Imagine you receive a text from your favorite athleisure company about some pants you’ve bought!";
      }

      if (textToPay.demoType === DemoType.EXPRESS) {
        sendMessage =
          "Cool, imagine you are Frank, who has bought a specific product, Enviro-strip, in the past but is due for a reorder.";
      }

      context = ContextType.STATEMENT;

      status = ContextStatus.COMPLETE;

      textToPay.status = TextToPayStatus.IN_PROGRESS;
    }

    if (nextStep === DemoStep.OFFER) {
      if (textToPay.demoType === DemoType.CROISSANT) {
        sendMessage =
          "Hi Croissant Cafe Lovers! We have 15% off croissants through the end of the day. Would you like us to hold you some?\n\nWhat option do you prefer? Reply:\n\n1 for 1 Croissant\n2 for 2 Croissants\n3 for 3 Croissants";

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

        mediaUrl = [
          "https://res.cloudinary.com/dsagji1hk/image/upload/v1678834790/Croissants_nldxhi.jpg"
        ];
      }

      if (textToPay.demoType === DemoType.LULULEMON) {
        sendMessage =
          "Your ABC Pant is currently 30% off. There are three in stock. To order, text: 'Yes'";

        messageOptions = [
          {
            label: "Yes",
            value: "yes"
          }
        ];

        mediaUrl = [
          "https://res.cloudinary.com/dsagji1hk/image/upload/v1678833781/Lululemon_1_1_njxq6c.png"
        ];
      }

      if (textToPay.demoType === DemoType.EXPRESS) {
        sendMessage =
          "Hey, Sam at PowderStrip. We just had an order open up on Enviro-strip, so you can get it with no lead time. Are you interested in ordering some?";

        messageOptions = [
          {
            label: "Yes",
            value: "yes"
          }
        ];
      }

      context = ContextType.QUESTION;

      status = ContextStatus.PENDING;
    }

    if (nextStep === DemoStep.SELECT_VARIATION) {
      let variationString = "";

      const variationOptions = [];

      let variations = [];

      if (textToPay.demoType === DemoType.CROISSANT) {
        variations = CroissantVariations;
      }

      if (textToPay.demoType === DemoType.EXPRESS) {
        variations = ExpressVariations;
      }

      variations.forEach((variation, index) => {
        variationString += `${index + 1} for ${variation.name} ($${
          variation.price
        })\n`;

        variationOptions.push({
          label: `${index + 1}`,
          value: variation.id,
          numberString: getNumberWord(index + 1),
          price: variation.price
        });
      });

      sendMessage = `${
        textToPay.demoType === DemoType.EXPRESS
          ? "Yes, that sounds great. Please select from the following. Respond:"
          : "What type do you want?"
      }\n\n${variationString}`;

      messageOptions = variationOptions;

      context = ContextType.QUESTION;

      status = ContextStatus.PENDING;
    }

    if (nextStep === DemoStep.PAYMENT || retryPayment) {
      if (textToPay.demoType === DemoType.CROISSANT) {
        sendMessage = `We have that reserved for you. Please confirm your details below:\n\n$${parseFloat(
          textToPay.quantity *
            (textToPay.selectedVariation.price -
              textToPay.selectedVariation.price * 0.15)
        ).toFixed(
          2
        )} - 15% off\nMastercard 4312\n111 Light Ave.\n\nReply:\n\n'order' to place your order\n'edit' to edit your details\n'no' to cancel`;
      }

      if (textToPay.demoType === DemoType.LULULEMON) {
        sendMessage =
          "We have that reserved for you. Please confirm your details below:\n\n$128.00 - 30% off\nMastercard 4312\n111 Light Ave.\n\nReply:\n\n'order' to place your order\n'edit' to edit your details\n'no' to cancel";
      }

      if (textToPay.demoType === DemoType.EXPRESS) {
        sendMessage =
          "We have that reserved for you. Please confirm your details below:\n\nEnviro-Strip 30 Gallon Drum $1350\nCard: Visa 1234\nShipping: 123 Sales St., St. Louis, MO.\n\nReply:\n\n'order' to place your order\n'edit' to edit your details\n'no' to cancel";
      }

      messageOptions = [
        {
          label: "order",
          value: "order"
        },
        {
          label: "edit",
          value: "edit"
        },
        {
          label: "no",
          value: "no"
        }
      ];

      context = ContextType.QUESTION;

      status = ContextStatus.PENDING;
    }

    if (nextStep === DemoStep.ORDER && !retryPayment) {
      if (textToPay.demoType === DemoType.CROISSANT) {
        sendMessage = `Confirmed! We’ll see you soon. Thank you for being a patreon of Croissant Cafe :)`;
      }

      if (textToPay.demoType === DemoType.LULULEMON) {
        sendMessage = `Confirmed! We’ll see you soon. Thank you for being a patreon of Lululemon :)`;
      }

      if (textToPay.demoType === DemoType.EXPRESS) {
        sendMessage = `Confirmed! We’ll see you soon. Thank you so much for being a customer of ExpressChem :)`;
      }

      context = ContextType.STATEMENT;

      status = ContextStatus.COMPLETE;

      textToPay.status = TextToPayStatus.COMPLETE;
    }

    if (!retryPayment) {
      textToPay.currentStep = nextStep;
      textToPay.save();
    }

    await new ConversationsModel({
      phone,
      type: MessageType.SENT,
      message: sendMessage,
      context,
      status,
      options: messageOptions,
      textToPay: textToPay._id
    }).save();

    const smsResponse = await sendSMS({
      to: phone,
      body: sendMessage,
      mediaUrl
    });

    console.log("smsResponse : ", smsResponse);

    if (nextStep === DemoStep.USE_CASE) {
      return demoFlow({ phone, message: "" });
    }
  } catch (error) {
    logger.error("demoFlow() -> error : ", error);
  }
};

module.exports = { demoFlow };
