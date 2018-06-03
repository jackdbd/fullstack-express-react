require("dotenv").load();
const request = require("supertest");
const HttpStatus = require("http-status-codes");
const mongoose = require("mongoose");
const { User, createUser, deleteUser } = require("./models/user");
const app = require("./app");

beforeAll(() => {
  console.log("Start test suite. Connect to MongoDB");
  mongoose.connect(process.env.MONGODB_URI);
});

afterAll(() => {
  console.log("All tests done. Disconnect from MongoDB");
  mongoose.disconnect();
});

async function deleteUserIfAny(username) {
  const user = await User.getUserByUsername(username);
  if (user) {
    const deletedUser = await deleteUser(user._id);
    // console.log('deleted user', deletedUser)
  }
}

function createTestJson() {
  jsonDoc = {
    username: "some_username",
    email: "some_email@some_provider.com",
    password: "some_password"
  };
  return jsonDoc;
}

describe("POST /api/signup - Register a new user", () => {
  const endpoint = "/api//signup";

  it("should be possible to register with username, email and password", async function(done) {
    const jsonDoc = createTestJson();
    await deleteUserIfAny(jsonDoc.username);
    const res = await request(app)
      .post(endpoint)
      .send(jsonDoc)
      .expect(HttpStatus.OK);
    done();
  });

  it("should return BAD_REQUEST (400) when trying to register without a password", async function(done) {
    const jsonDoc = {
      username: "user987654321"
    };
    await deleteUserIfAny(jsonDoc.username);
    const res = await request(app)
      .post(endpoint)
      .set("Content-Type", "application/json")
      .send(jsonDoc)
      .expect(HttpStatus.BAD_REQUEST);
    done();
  });

  it("should return BAD_REQUEST (400) when trying to register with a password too short", async function(done) {
    const { username, email } = createTestJson();
    const jsonDoc = { username, email, password: "foo" };
    await deleteUserIfAny(jsonDoc.username);
    const res = await request(app)
      .post(endpoint)
      .set("Content-Type", "application/json")
      .send(jsonDoc)
      .expect(HttpStatus.BAD_REQUEST);

    expect(res.body.error.errors).toHaveProperty("password");
    expect(res.body.error.errors.password.properties).toHaveProperty(
      "minlength",
      8
    );
    done();
  });
});

describe("POST /api/login - Login existing user", () => {
  const endpoint = "/api/login";

  it("should redirect (302) to / when trying to login without a password", async function(done) {
    const user = await User.findOne();
    const jsonDoc = {
      username: user.username,
      email: user.email
    };
    const res = await request(app)
      .post(endpoint)
      .send(jsonDoc)
      .expect(HttpStatus.MOVED_TEMPORARILY)
      .expect("Location", "/");
    done();
  });

  it("should login an existing user", async function(done) {
    const jsonDoc = createTestJson();
    await deleteUserIfAny(jsonDoc.username);
    await request(app)
      .post("/api/signup")
      .send(jsonDoc);
    const res = await request(app)
      .post(endpoint)
      .send(jsonDoc)
      .expect(HttpStatus.OK);
    done();
  });
});

describe("GET /api/me - Get​ ​the​ ​currently​ ​logged​ ​in​ ​user​ ​information", () => {
  const endpoint = "/api/me";

  it("should redirect (302) to /login when token is not included", async function(done) {
    const res = await request(app)
      .get(endpoint)
      .expect(HttpStatus.MOVED_TEMPORARILY)
      .expect("Location", "/login");
    done();
  });

  it("should return a JSON containing username and numLikes when token is included", async function(done) {
    const jsonDoc = createTestJson();
    await deleteUserIfAny(jsonDoc.username);
    const res1 = await request(app)
      .post("/api/signup")
      .send(jsonDoc);
    const { token } = res1.body;
    const res2 = await request(app)
      .get(endpoint)
      .set("x-access-token", token)
      .expect("Content-Type", /json/);
    // console.log(res2.body)
    expect(res2.body).toMatchObject({
      username: expect.any(String),
      numLikes: expect.any(Number)
    });
    done();
  });
});

describe("PUT /api/me/update-password - Update the password of the authenticated user", () => {
  const endpoint = "/api/me";

  it("should redirect (302) to /login when token is not included", async function(done) {
    const jsonDoc = createTestJson();
    const res = await request(app)
      .put(`${endpoint}/update-password`)
      .send(jsonDoc)
      .expect(HttpStatus.MOVED_TEMPORARILY)
      .expect("Location", "/login");
    done();
  });

  it("should update only the password", async function(done) {
    const jsonDoc = createTestJson();
    await deleteUserIfAny(jsonDoc.username);
    const res1 = await request(app)
      .post("/api/signup")
      .send(jsonDoc);
    const { token } = res1.body;

    const userOld = await User.getUserByUsername(jsonDoc.username);
    const oldHash = userOld.password;

    const newPassword = "some-new-password";
    const res = await request(app)
      .put(`${endpoint}/update-password`)
      .set("x-access-token", token)
      .send({ newPassword: newPassword })
      .expect("Content-Type", /json/)
      .expect(HttpStatus.OK);

    const userNew = await User.getUserByUsername(jsonDoc.username);
    const newHash = userNew.password;

    expect(newHash).not.toBe(oldHash);
    expect(userNew.email).toBe(userOld.email);
    done();
  });
});

describe("GET /api/most-liked - List​ ​users​ ​in​ ​a​ ​most​ ​liked​ ​to​ ​least​ ​liked", () => {
  const endpoint = "/api/most-liked";

  it("should return HTTP OK (200)", done => {
    request(app)
      .get(endpoint)
      .expect("Content-Type", /json/)
      .expect(HttpStatus.OK, done);
  });

  it("should return a list of objects, sorted by numLikes", async function(done) {
    const res = await request(app)
      .get(endpoint)
      .expect("Content-Type", /json/);
    const results = res.body;
    const first = results[0];
    const last = results[results.length - 1];
    expect(first.numLikes).toBeGreaterThan(last.numLikes);
    done();
  });
});

describe("GET /api/user/:id - Get​ ​the​ ​user​ with the specified ID", () => {
  const endpoint = "/api/user";

  it("should return OK (200) for an existing user", async function(done) {
    const user = await User.findOne();
    const id = user._id;
    request(app)
      .get(`${endpoint}/${id}`)
      .expect("Content-Type", /json/)
      .expect(HttpStatus.OK, done);
  });

  it("should return BAD_REQUEST (400) when specifying an invalid id", done => {
    // const id = "4b0977ba76d8c83817f451ed";
    const id = "INVALID_ID";
    request(app)
      .get(`${endpoint}/${id}`)
      .expect("Content-Type", /json/)
      .expect(HttpStatus.BAD_REQUEST, done);
  });
});

describe("PUT /api/user/:id/like - Like a user", () => {
  const endpoint = "/api/user";

  it("should redirect (302) to /login when token is not included", async function(done) {
    const user = await User.findOne();
    const res = await request(app)
      .put(`${endpoint}/${user.id}/like`)
      .expect(HttpStatus.MOVED_TEMPORARILY)
      .expect("Location", "/login");
    done();
  });

  it("should increment numLikes by 1", async function(done) {
    const jsonDoc = createTestJson();
    await deleteUserIfAny(jsonDoc.username);
    const res1 = await request(app)
      .post("/api/signup")
      .send(jsonDoc);
    const { token } = res1.body;

    const user = await User.getUserByUsername(jsonDoc.username);
    const res2 = await request(app)
      .put(`${endpoint}/${user.id}/like`)
      .set("x-access-token", token)
      .expect("Content-Type", /json/)
      .expect(HttpStatus.OK);
    // console.log(res2.body)

    const oldNum = res2.body.old.numLikes;
    const newNum = res2.body.new.numLikes;
    expect(newNum).toBe(oldNum + 1);
    done();
  });
});

describe("PUT /api/user/:id/unlike - Unlike a user", () => {
  const endpoint = "/api/user";

  it("should redirect (302) to /login when token is not included", async function(done) {
    const user = await User.findOne();
    const res = await request(app)
      .put(`${endpoint}/${user.id}/unlike`)
      .expect(HttpStatus.MOVED_TEMPORARILY)
      .expect("Location", "/login");
    done();
  });

  it("should decrement numLikes by 1", async function(done) {
    // register a new user to get a token
    const jsonDoc = createTestJson();
    await deleteUserIfAny(jsonDoc.username);
    const res1 = await request(app)
      .post("/api/signup")
      .send(jsonDoc);
    const { token } = res1.body;

    // the logged user unlikes a different user
    const user2 = await User.findOne({
      email: { $ne: jsonDoc.email },
      numLikes: { $gt: 0 }
    });
    // console.log(jsonDoc.email, user2.email)
    const res2 = await request(app)
      .put(`${endpoint}/${user2.id}/unlike`)
      .set("x-access-token", token)
      .expect("Content-Type", /json/)
      .expect(HttpStatus.OK);
    // console.log(res2.body)

    const oldNum = res2.body.old.numLikes;
    const newNum = res2.body.new.numLikes;
    expect(newNum).toBe(oldNum - 1);
    done();
  });

  it("should NOT decrement numLikes by 1 if numLikes is 0", async function(done) {
    // register a new user to get a token
    const jsonDoc = createTestJson();
    await deleteUserIfAny(jsonDoc.username);
    const res1 = await request(app)
      .post("/api/signup")
      .send(jsonDoc);
    const { token } = res1.body;

    const user2 = await User.findOne({ numLikes: { $eq: 0 } });
    // console.log(jsonDoc.email, user2.email)
    const res2 = await request(app)
      .put(`${endpoint}/${user2.id}/unlike`)
      .set("x-access-token", token)
      .expect("Content-Type", /json/)
      .expect(HttpStatus.OK);
    // console.log(res2.body)

    const oldNum = res2.body.old.numLikes;
    const newNum = res2.body.new.numLikes;
    expect(oldNum).toBe(0);
    expect(newNum).toBe(0);
    done();
  });
});
