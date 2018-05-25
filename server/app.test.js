const request = require("supertest");
const HttpStatus = require("http-status-codes");
const mongoose = require("./db")
const app = require("./app");

afterAll(() => {
  console.log('All tests done. Disconnect from MongoDB')
  mongoose.disconnect()
});

// TODO: mock /api/me with missing/invalid id to test 404 and 400?
describe("GET /api/me - Get​ ​the​ ​currently​ ​logged​ ​in​ ​user​ ​information", () => {
  it("should return HTTP OK (200)", done => {
    request(app)
      .get("/api/me")
      .expect("Content-Type", /json/)
      .expect(HttpStatus.OK, done);
  });
  it("should contain", done => {
    request(app)
      .get("/api/me")
      .expect("Content-Type", /json/)
      .then(res => {
        expect(res.body).toMatchObject({
          username: expect.any(String),
          numLikes: expect.any(Number),
         })
        done();
      });
  });
});

describe("GET /api/most-liked - List​ ​users​ ​in​ ​a​ ​most​ ​liked​ ​to​ ​least​ ​liked", () => {
  it("should return HTTP OK (200)", done => {
    request(app)
      .get("/api/most-liked")
      .expect("Content-Type", /json/)
      .expect(HttpStatus.OK, done);
  });
  it("should return a list of objects, sorted by numLikes", done => {
    request(app)
      .get("/api/most-liked")
      .expect("Content-Type", /json/)
      .then(res => {
        const results = res.body
        const first = results[0]
        const last = results[results.length - 1]
        expect(first.numLikes).toBeGreaterThan(last.numLikes)
        done();
      });
  });
});
