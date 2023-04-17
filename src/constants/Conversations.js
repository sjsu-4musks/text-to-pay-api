const MessageType = {
  SENT: "SENT",
  RECEIVED: "RECEIVED"
};

const ContextType = {
  QUESTION: "QUESTION",
  RESPONSE: "RESPONSE",
  STATEMENT: "STATEMENT"
};

const ContextStatus = {
  PENDING: "PENDING",
  COMPLETE: "COMPLETE"
};

module.exports = { MessageType, ContextType, ContextStatus };
