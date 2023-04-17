const getNumberWord = number => {
  switch (number) {
    case 1:
      return "one";

    case 2:
      return "two";

    case 3:
      return "three";

    case 4:
      return "four";

    case 5:
      return "five";

    case 6:
      return "six";

    case 7:
      return "seven";

    case 8:
      return "eight";

    case 9:
      return "nine";

    case 10:
      return "ten";

    default:
      return "zero";
  }
};

const positiveResponses = [
  "yes",
  "yeah",
  "yep",
  "yup",
  "sure",
  "okay",
  "alright",
  "absolutely",
  "definitely",
  "indeed",
  "affirmative",
  "certainly",
  "of course",
  "by all means",
  "you bet",
  "no problem",
  "roger",
  "affirm",
  "aye",
  "most certainly",
  "totally",
  "positively",
  "OK",
  "fine",
  "good",
  "great",
  "excellent",
  "fantastic",
  "awesome",
  "superb",
  "wonderful",
  "terrific",
  "marvelous",
  "brilliant",
  "outstanding",
  "splendid",
  "dandy",
  "neat",
  "tidy",
  "satisfactory",
  "agreeable",
  "pleasant",
  "concur",
  "accept",
  "approve",
  "assent",
  "go along",
  "yield",
  "nod",
  "chime in",
  "jump at the chance",
  "jump at it",
  "why not",
  "I'm in",
  "count me in",
  "I'll do it",
  "I'll take it",
  "I'll have one",
  "I'd love to",
  "absolutely brilliant",
  "gladly",
  "definitely yes",
  "100%",
  "sure thing",
  "right away",
  "very well",
  "exactly",
  "no doubt",
  "no question",
  "indeedy",
  "aye aye",
  "for sure",
  "most assuredly",
  "undeniably",
  "indubitably",
  "without a doubt",
  "beyond a doubt",
  "without question",
  "by all manner of means",
  "absotively posolutely",
  "aye sir",
  "totally agree",
  "I'm on board",
  "I'm game",
  "I'm down",
  "I'm all for it",
  "I'm with you",
  "I'm in favor",
  "I'm enthusiastic",
  "I'm ready",
  "let's roll",
  "let's get started",
  "let's do it",
  "let's go",
  "let's make it happen",
  "no brainer",
  "can do",
  "absolutely right",
  "perfect",
  "done and done"
];

const negativeResponses = [
  "no",
  "nah",
  "nope",
  "not really",
  "not interested",
  "sorry, no",
  "negative",
  "I don't think so",
  "I don't want to",
  "I'm not interested",
  "I'm good",
  "thanks, but no thanks",
  "thanks, but I'll pass",
  "I'll have to pass",
  "I'll take a raincheck",
  "I've changed my mind",
  "maybe next time",
  "no thanks",
  "not right now",
  "not at the moment",
  "not this time",
  "not today",
  "pass",
  "cancel",
  "nevermind",
  "I'd rather not",
  "I'd prefer not to",
  "I'd like to say no",
  "definitely not",
  "absolutely not",
  "certainly not",
  "never",
  "not a chance",
  "out of the question",
  "no way",
  "no way in hell",
  "no way jose",
  "not on your life",
  "not by a long shot",
  "no siree",
  "no can do",
  "not gonna happen",
  "not gonna work",
  "not happening",
  "not in a million years",
  "not in this lifetime",
  "not likely",
  "not my thing",
  "not on my agenda",
  "not on my radar",
  "not really feeling it",
  "not the right fit",
  "not what I'm looking for",
  "not what I had in mind",
  "not what I want",
  "not what I need",
  "not what I had hoped for",
  "not worth it",
  "I'm not up for it",
  "I'm not feeling up for it",
  "I'm not up to it",
  "I'm not in the mood",
  "I'm not ready",
  "I'm not interested at the moment",
  "I'm not interested right now",
  "I'm not in the market",
  "I'm not in the market for that",
  "I'm not in the market for it",
  "I'm not looking for that",
  "I'm not looking for it",
  "I'm not seeking that",
  "I'm not seeking it",
  "I'm not open to it",
  "I'm not available",
  "I'm not down",
  "I'm not down for that",
  "no, thank you"
];

const editResponses = [
  "edit",
  "modify",
  "change",
  "adjust",
  "revise",
  "amend",
  "update",
  "correct",
  "rectify",
  "alter",
  "revamp",
  "rework",
  "refine",
  "tweak",
  "fine-tune",
  "make changes",
  "revise details",
  "modify order",
  "edit information",
  "update details",
  "correct mistake",
  "change order",
  "revise order",
  "modify details",
  "amend order",
  "update order",
  "rework details",
  "alter order",
  "refine order",
  "modify information"
];

const getNextStep = (steps, currentStep) => {
  const currentStepIndex = steps.findIndex(elem => elem === currentStep);
  return steps[currentStepIndex + 1];
};

const matchResponse = (message, options) => {
  let responseMessage = message;

  if (options.some(elem => elem.value === "yes")) {
    const positiveResponse = positiveResponses.find(elem =>
      String(message)
        .toLowerCase()
        .trim()
        .includes(
          String(elem)
            .toLowerCase()
            .trim()
        )
    );

    console.log("positiveResponse : ", positiveResponse);

    if (positiveResponse) {
      responseMessage = "yes";
    }
  }

  if (options.some(elem => elem.value === "no")) {
    const negativeResponse = negativeResponses.find(elem =>
      String(message)
        .toLowerCase()
        .trim()
        .includes(
          String(elem)
            .toLowerCase()
            .trim()
        )
    );

    console.log("negativeResponse : ", negativeResponse);

    if (negativeResponse) {
      responseMessage = "no";
    }
  }

  if (options.some(elem => elem.value === "edit")) {
    const editResponse = editResponses.find(elem =>
      String(message)
        .toLowerCase()
        .trim()
        .includes(
          String(elem)
            .toLowerCase()
            .trim()
        )
    );

    console.log("editResponse : ", editResponse);

    if (editResponse) {
      responseMessage = "edit";
    }
  }

  const selectedOption = options.find(
    elem =>
      String(responseMessage)
        .toLowerCase()
        .trim()
        .includes(
          String(elem.label)
            .toLowerCase()
            .trim()
        ) ||
      String(message)
        .toLowerCase()
        .trim()
        .includes(
          String(elem.numberString)
            .toLowerCase()
            .trim()
        )
  );

  console.log("selectedOption : ", selectedOption);

  return { selectedOption, responseMessage };
};

module.exports = { getNumberWord, getNextStep, matchResponse };
