const logger = require("../config/winston");
const { User } = require("./user");
const {
  Relationship,
  deleteRelationshipAndUpdateUsers
} = require("./relationship");

// turn off logging with winston during the tests
logger.transports["consoleLogger"].silent = true;

beforeEach(async function() {
  console.log("Clear relationships and users collections in DB");
  await Relationship.remove({});
  await User.remove({});
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

describe("Delete Relationship", () => {
  it("should be possible to delete a relationship by id", async function(done) {
    const obj = await init();
    const rel = await Relationship.create(obj);
    const docsBefore = await Relationship.find({});
    expect(docsBefore).toHaveLength(1);
    await Relationship.findByIdAndRemove(rel.id);
    const docsAfter = await Relationship.find({});
    expect(docsAfter).toHaveLength(0);
    done();
  });

  it("should be possible to delete a relationship by id and update users", async function(done) {
    const obj = await init();
    const rel = await Relationship.create(obj);
    const docsBefore = await Relationship.find({});
    expect(docsBefore).toHaveLength(1);
    const doc = await deleteRelationshipAndUpdateUsers(rel.id);
    const docsAfter = await Relationship.find({});
    expect(docsAfter).toHaveLength(0);
    const user = await User.findById(doc.source);
    expect(user.relationships).toHaveLength(0);
    done();
  });
});
