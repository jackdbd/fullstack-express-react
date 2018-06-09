require("dotenv").load();
const request = require("supertest");
// const HttpStatus = require("http-status-codes");
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
  const userA = await User.create(objA);
  const userB = await User.create(objB);
  const obj = {
    source: userA.id,
    destination: userB.id,
    category: "like"
  };
  return obj;
}

describe("Create Relationship", () => {
  it("should be possible to create a 'like' relationship between user 'source' and user 'destination'", async function(done) {
    const obj = await init();
    const rel = await Relationship.create(obj);
    expect(rel).toHaveProperty("source");
    expect(rel).toHaveProperty("destination");
    expect(rel).toHaveProperty("category");
    done();
  });

  it("should not be possible to create a relationship between a user and himself", async function(done) {
    const obj0 = await init();
    const obj = {
      source: obj0.source,
      destination: obj0.source,
      category: "like"
    };
    // it's not the most elegant way to assert that an async task throws an exception, but it works
    try {
      await Relationship.create(obj);
    } catch (err) {
      expect(err.stack).toContain("ValidationError");
      done();
    }
  });

  it("should not be possible to create a relationship without a category", async function(done) {
    const obj0 = await init();
    const obj = {
      source: obj0.source,
      destination: obj0.destination
    };
    try {
      await Relationship.create(obj);
    } catch (err) {
      expect(err.stack).toContain("ValidationError");
      done();
    }
  });

  it("should be possible to create only one relationship", async function(done) {
    const obj = await init();
    // the first time we can create a relationship
    await Relationship.create(obj);
    // the second time we get a validation error
    try {
      await Relationship.create(obj);
    } catch (err) {
      expect(err.stack).toContain("ValidationError");
      done();
    }
  });
});
