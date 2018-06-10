const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const logger = require("../config/winston");

logger.transports["consoleLogger"].silent = true;

const mongooseOptions = {
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000
};

let mongoServer;

beforeAll(async function() {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getConnectionString();
  await mongoose.connect(
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
});

afterAll(() => {
  mongoose.disconnect();
  mongoServer.stop();
});

describe("MyModel in-memory MongoDB server", () => {
  it("should connect", async function() {
    const schema = new mongoose.Schema({ name: String });
    const MyModel = mongoose.model("MyModel", schema);
    const cnt = await MyModel.count();
    expect(cnt).toEqual(0);
  });
});
