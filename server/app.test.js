require("dotenv").load();
const request = require("supertest");
const HttpStatus = require("http-status-codes");
const mongoose = require("mongoose");
const { User } = require("./models/user");
const app = require("./app");

beforeAll(() => {
  console.log("Start test suite. Connect to MongoDB");
  mongoose.connect(process.env.MONGODB_URI);
});

afterAll(() => {
  console.log("All tests done. Disconnect from MongoDB");
  mongoose.disconnect();
});

describe("POST /signup - Register a new user", () => {
  const endpoint = "/signup";
  it("should not be possible to register without a password", async function(done) {
    const jsonDoc = {
      username: "username123457",
      email: "some-email@provider7.com"
    };
    await request(app)
      .post(endpoint)
      .send(jsonDoc)
      .expect(HttpStatus.BAD_REQUEST);
    done();
  });
  it("should be possible to register", async function(done) {
    const jsonDoc = {
      username: "user3298nsva8",
      email: "someemail@someprovider.com",
      password: "pdibvilub67674iyvu"
    };
    const res1 = await request(app)
      .post(endpoint)
      .send(jsonDoc)
      .expect(HttpStatus.OK);
    const res2 = await request(app).delete(`/user/${res1.body._id}`);
    done();
  });
});

describe("POST /login - Login existing user", () => {
  const endpoint = "/login";
  it("should not be possible to login without a password", async function(done) {
    const jsonDoc = {
      username: "username123457",
      email: "some-email@provider7.com"
    };
    const res = await request(app)
      .post(endpoint)
      .send(jsonDoc)
      .expect(HttpStatus.BAD_REQUEST);

    done();
  });
  it("should redirect to / after a successful login", async function(done) {
    const jsonDoc = {
      username: "username123457",
      email: "some-email@provider7.com",
      password: "password123457"
    };
    const res = await request(app)
      .post(endpoint)
      .send(jsonDoc)
      .expect("Location", "/");

    done();
  });
});

describe("GET /me - Get​ ​the​ ​currently​ ​logged​ ​in​ ​user​ ​information", () => {
  const endpoint = "/me";
  it("should return HTTP OK (200)", done => {
    request(app)
      .get(endpoint)
      .expect("Content-Type", /json/)
      .expect(HttpStatus.OK, done);
  });
  it("should contain username and numLikes", done => {
    request(app)
      .get(endpoint)
      .expect("Content-Type", /json/)
      .then(res => {
        expect(res.body).toMatchObject({
          username: expect.any(String),
          numLikes: expect.any(Number)
        });
        done();
      });
  });
});

describe("GET /most-liked - List​ ​users​ ​in​ ​a​ ​most​ ​liked​ ​to​ ​least​ ​liked", () => {
  const endpoint = "/most-liked";
  it("should return HTTP OK (200)", done => {
    request(app)
      .get(endpoint)
      .expect("Content-Type", /json/)
      .expect(HttpStatus.OK, done);
  });
  it("should return a list of objects, sorted by numLikes", done => {
    request(app)
      .get(endpoint)
      .expect("Content-Type", /json/)
      .then(res => {
        const results = res.body;
        const first = results[0];
        const last = results[results.length - 1];
        expect(first.numLikes).toBeGreaterThan(last.numLikes);
        done();
      });
  });
});

describe("GET /user/:id - Get​ ​the​ ​user​ with the specified ID", () => {
  const endpoint = "/user";
  it("should return HTTP OK (200) for an existing user", done => {
    const id = "5b0af85cbae3f31ab8896475";
    request(app)
      .get(`${endpoint}/${id}`)
      .expect("Content-Type", /json/)
      .expect(HttpStatus.OK, done);
  });
  it("should return HTTP NOT FOUND (404) for a non-existing user", done => {
    const id = "4b0977ba76d8c83817f451ed";
    request(app)
      .get(`${endpoint}/${id}`)
      .expect("Content-Type", /json/)
      .expect(HttpStatus.NOT_FOUND, done);
  });
});

describe("PUT /user/:id/like - Like a user", () => {
  const endpoint = "/user";
  it("should increment numLikes by 1", done => {
    const id = "5b0af85cbae3f31ab8896475";
    request(app)
      .put(`${endpoint}/${id}/like`)
      .expect("Content-Type", /json/)
      .expect(HttpStatus.OK)
      .then(res => {
        // console.log(res.body)
        const oldNum = res.body.old.numLikes;
        const newNum = res.body.new.numLikes;
        expect(newNum).toBe(oldNum + 1);
        done();
      });
  });
});

describe("PUT /user/:id/unlike - Unlike a user", () => {
  const endpoint = "/user";
  it("should decrement numLikes by 1", done => {
    const id = "5b0af85cbae3f31ab8896475";
    request(app)
      .put(`${endpoint}/${id}/unlike`)
      .expect("Content-Type", /json/)
      .expect(HttpStatus.OK)
      .then(res => {
        // console.log(res.body)
        const oldNum = res.body.old.numLikes;
        const newNum = res.body.new.numLikes;
        expect(newNum).toBe(oldNum - 1);
        done();
      });
  });
});

describe("PUT /me/update-password - Update the password of the authenticated user", () => {
  const endpoint = "/me";
  it("should change only the password", async function(done) {
    const res1 = await request(app).get(endpoint);
    const pass1 = res1.body.password;
    const user1 = res1.body.username;
    await request(app)
      .put(`${endpoint}/update-password`)
      .expect("Content-Type", /json/)
      .expect(HttpStatus.OK);
    const res2 = await request(app).get(endpoint);
    const pass2 = res2.body.password;
    const user2 = res2.body.username;
    expect(pass1).not.toBe(pass2);
    expect(user1).toBe(user2);
    done();
  });
});
