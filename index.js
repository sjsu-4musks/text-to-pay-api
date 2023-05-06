const { createServer, proxy } = require("aws-serverless-express");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const express = require("express");
const morgan = require("morgan");
const expressRequestId = require("express-request-id")();
const cors = require("cors");
const { connectDatabase } = require("./src/utils/db");
const logger = require("./src/utils/logger");

const app = express();

app.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});

app.use(expressRequestId);
app.use(awsServerlessExpressMiddleware.eventContext());

morgan.token("requestId", request => request.id);

app.use(
  morgan(":requestId :method :url :status :response-time ms", {
    stream: {
      write: message => logger.http(message)
    }
  })
);

const rawBodySaver = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || "utf8");
  }
};

app.use(express.json({ verify: rawBodySaver, limit: "50mb" }));
app.use(
  express.urlencoded({ verify: rawBodySaver, extended: true, limit: "50mb" })
);
app.use(express.raw({ verify: rawBodySaver, type: "*/*", limit: "50mb" }));

const whitelist = [
  "https://localhost:3000",
  "http://localhost:3000",
  "https://app.localhost:3000",
  "http://app.localhost:3000"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (whitelist.indexOf(origin) === -1) {
        return callback(
          new Error(
            "The CORS policy for this site does not allow access from the specified Origin."
          ),
          false
        );
      }

      return callback(null, true);
    },
    exposedHeaders: "x-access-token"
  })
);

const users = require("./src/api/v1/users");
const merchant = require("./src/api/v1/merchant");
const payments = require("./src/api/v1/payments");
const stripeWebhooks = require("./src/api/v1/webhooks/stripe");

// ROUTES
app.use("/v1/users", users);
app.use("/v1/merchant", merchant);
app.use("/v1/payments", payments);
app.use("/v1/webhooks/stripe", stripeWebhooks);

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Howdy!!!" });
});

module.exports.handler = (event, ctx) => {
  // This will re-use `cachedMongoConn` between function calls.
  // See https://www.mongodb.com/blog/post/serverless-development-with-nodejs-aws-lambda-mongodb-atlas
  // See https://docs.atlas.mongodb.com/best-practices-connecting-to-aws-lambda/
  // https://mongoosejs.com/docs/lambda.html

  ctx.callbackWaitsForEmptyEventLoop = false;

  logger.info("Connecting to database...");
  connectDatabase()
    .then(() => proxy(createServer(app), event, ctx))
    .catch(error => {
      logger.error("Could not connect to database", { error });
      throw error;
    });
};
