require("dotenv").load();
const mongoose = require("mongoose");
const logger = require("../config/winston");

/*
  The connection to the database is an asynchronous operation, but there is no
  need to use await or .then(), since mongoose takes care of it automatically.
*/
mongoose.connect(
  process.env.MONGODB_URI,
  function() {
    logger.warn("MongoDB connected (mLab)");
  }
);

/* In alternative, connect to an in-memory mongodb server

const { MongoMemoryServer } = require("mongodb-memory-server");

const mongooseOptions = {
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000
};

const mongoServer = new MongoMemoryServer();

mongoose.Promise = Promise;

mongoServer.getConnectionString()
  .then((mongoUri) => {
    mongoose.connect(
      mongoUri,
      mongooseOptions,
      (err, conn) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Connection: ${conn.name}`);
        }
      }
    );
    mongoose.connection.on('error', (err) => {
      if (err.message.code === 'ETIMEDOUT') {
        console.error(err);
        mongoose.connect(mongoUri, mongooseOpts);
      }
      console.error(err);
    });
  
    mongoose.connection.once('open', () => {
      console.log(`MongoDB connected to ${mongoUri} (In-Memory)`);
    });
  })

*/

module.exports = mongoose;
