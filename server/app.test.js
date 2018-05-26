require("dotenv").load();
const request = require("supertest");
const HttpStatus = require("http-status-codes");
const mongoose = require("mongoose");
const app = require("./app");

beforeAll(() => {
  console.log("Start test suite. Connect to MongoDB");
  mongoose.connect(process.env.MONGODB_URI);
});

afterAll(() => {
  console.log("All tests done. Disconnect from MongoDB");
  mongoose.disconnect();
});

describe("GET /me - Get​ ​the​ ​currently​ ​logged​ ​in​ ​user​ ​information", () => {
  const endpoint = "/me";
  it("should return HTTP OK (200)", done => {
    request(app)
      .get(endpoint)
      .expect("Content-Type", /json/)
      .expect(HttpStatus.OK, done);
  });
  it("should contain", done => {
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
