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
describe("Error handling", () => {
  test("404 Not found: Responds appropriately when endpoint does not exist", () => {
    return request(app)
      .get("/api/does-not-exist")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Path not found");
      });
  });
  test("404 Not found: Responds appropriately when endpoint is not /api", () => {
    return request(app)
      .get("/home")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Path not found");
      });
  });
});
describe("/api", () => {
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
  describe("ALL", () => {
    test("ALL 405: Returns Method not allowed if called with any other method", () => {
      return request(app)
        .post("/api")
        .expect(405)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Method not allowed");
        });
    });
  });
});
