const mongoose = require("mongoose");
const { MONGO_URL } = require("./config");
const logger = require("./logger");

let cachedMongoConn = null;

const connectDatabase = () => {
  return new Promise((resolve, reject) => {
    mongoose.Promise = global.Promise;
    mongoose.connection
      // Reject if an error occurred when trying to connect to MongoDB
      .on("error", error => {
        logger.error("Error: connection to DB failed");
        reject(error);
      })
      // Exit Process if there is no longer a Database Connection
      .on("close", () => {
        logger.error("Error: Connection to DB lost");
        process.exit(1); // eslint-disable-line
      })
      // Connected to DB
      .once("open", () => {
        // Display connection information
        const infos = mongoose.connections;

        infos.map(info =>
          logger.info(`Connected to ${info.host}:${info.port}/${info.name}`)
        );
        // Return successful promise
        resolve(cachedMongoConn);
      });

    // See https://www.mongodb.com/blog/post/serverless-development-with-nodejs-aws-lambda-mongodb-atlas
    // See https://docs.atlas.mongodb.com/best-practices-connecting-to-aws-lambda/
    // https://mongoosejs.com/docs/lambda.html
    if (!cachedMongoConn) {
      // Because `cachedMongoConn` is in the global scope, Lambda may retain it between
      // function calls thanks to `callbackWaitsForEmptyEventLoop`.
      // This means our Lambda function doesn't have to go through the
      // potentially expensive process of connecting to MongoDB every time.

      cachedMongoConn = mongoose.connect(MONGO_URL);
    } else {
      logger.info("MongoDB: using cached database instance");
      resolve(cachedMongoConn);
    }
  });
};

module.exports = { connectDatabase };
