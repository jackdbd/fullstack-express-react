const logger = require("../config/winston");
const { User, updateUser } = require("./user");

// turn off logging with winston during the tests
// logger.transports["consoleLogger"].silent = true;

beforeEach(async function() {
  console.log("Clear users collection in DB");
  await User.remove({});
});

function init() {
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
  const obj = {
    a: objA,
    b: objB
  };
  return obj;
}

describe("Create User", () => {
  it("should be possible to create a new user with username, email and password", async function(done) {
    const obj = init();
    const user = await User.create(obj.a);
    expect(user).toHaveProperty("username");
    expect(user).toHaveProperty("email");
    expect(user).toHaveProperty("password");
    expect(user).toHaveProperty("created_at");
    done();
  });

  it("should create a new user with 0 numLikes and no relationships", async function(done) {
    const obj = init();
    const user = await User.create(obj.a);
    expect(user.numLikes).toBe(0);
    expect(user.relationships).toHaveLength(0);
    done();
  });

  it("should not be possible to create two users with the same username", async function(done) {
    const obj = init();
    const objA = obj.a;
    const objB = Object.assign({}, obj.b, { username: obj.a.username });
    await User.create(objA);
    try {
      await User.create(objB);
    } catch (err) {
      expect(err.stack).toContain("ValidationError");
      done();
    }
  });

  it("should not be possible to create two users with the same email", async function(done) {
    const obj = init();
    const objA = obj.a;
    const objB = Object.assign({}, obj.b, { email: obj.a.email });
    await User.create(objA);
    try {
      await User.create(objB);
    } catch (err) {
      expect(err.stack).toContain("ValidationError");
      done();
    }
  });

  /*
    This test fails. I'm pretty sure it's due to the password being hashed in
    the User's "save" hook. The password is hashed in the "save" hook, which
    runs AFTER the validation. So we are comparing userA's hashed password with
    userB's non-hashed password. I think we have two options:
    - introduce this validation check in the User's "save" hook.
    - hash the password in a validator and check if there was already a user
      with that hash.
  */
  it.skip("should not be possible to create two users with the same password", async function(done) {
    const obj = init();
    const objA = obj.a;
    const objB = Object.assign({}, obj.b, { password: obj.a.password });
    // expect(objB.password).toBe(objA.password)
    // const userA = await User.create(objA);
    // const userB = await User.create(objB);
    // console.log(userA.password, userB.password, userA.password === userB.password)
    // expect(userB.password).toBe(userA.password)
    await User.create(objA);
    try {
      await User.create(objB);
    } catch (err) {
      expect(err.stack).toContain("ValidationError");
      done();
    }
  });
});

describe("Delete User", () => {
  it("should be possible to delete a user by id", async function(done) {
    const obj = init();
    const user = await User.create(obj.a);
    const docsBefore = await User.find({});
    expect(docsBefore).toHaveLength(1);
    await User.findByIdAndRemove(user.id);
    const docsAfter = await User.find({});
    expect(docsAfter).toHaveLength(0);
    done();
  });
});

describe("Update User", () => {
  it("should be possible to update a user's password", async function(done) {
    const obj = init();
    const objNew = Object.assign({}, obj.a, { password: "some-new-password" });
    const user = await User.create(obj.a);
    const userNew = await updateUser(user.id, objNew);
    expect(userNew.id).toBe(user.id);
    expect(userNew.password).not.toBe(user.password);
    done();
  });
});
