const request = require("supertest");
const app = require("../api/app");
const data = require("../db/data");
const seed = require("../db/seed");
const db = require("../db/connection");
const endpoints = require("../api/endpoints.json");

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed(data);
});

// describe("/api", () => {
describe("GET", () => {
  test("GET 200: Responds with enpoints.json file", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpoints);
      });
  });
});
