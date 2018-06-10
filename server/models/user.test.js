require("dotenv").load();
const logger = require("../config/winston");
const mongoose = require("mongoose");
const { User, deleteUserIfAny } = require("./user");
const { Relationship } = require("./relationship");

// turn off logging with winston during the tests
logger.transports["consoleLogger"].silent = true;

beforeAll(() => {
  console.log("Start test suite. Connect to MongoDB");
  mongoose.connect(process.env.MONGODB_URI);
});

afterAll(() => {
  console.log("All tests done. Disconnect from MongoDB");
  mongoose.disconnect();
});

async function init() {
  const objA = {
    username: "some_username",
    email: "some_email@some_provider.com",
    password: "some_password"
  };
  const objB = {
    username: "other_username",
    email: "other_email@other_provider.com",
    password: "other_password"
  };
  await deleteUserIfAny(objA.username);
  await deleteUserIfAny(objB.username);
  const obj = {
    objA,
    objB
  };
  return obj;
}

describe("Create User", () => {
  it("should be possible to create a new user with username, email and password", async function(done) {
    const obj = await init();
    const user = await User.create(obj.objA);
    expect(user).toHaveProperty("username");
    expect(user).toHaveProperty("email");
    expect(user).toHaveProperty("password");
    expect(user).toHaveProperty("created_at");
    expect(user.numLikes).toBe(0);
    expect(user.relationships).toHaveLength(0);
    done();
  });
});
