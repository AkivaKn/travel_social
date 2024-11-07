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
describe("/api/users", () => {
  describe("GET", () => {
    test("GET 200: Responds with an array of user objects with the correct keys", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users.length).toBe(3);
          users.forEach((user) => {
            expect(typeof user.user_id).toBe("number");
            expect(typeof user.name).toBe("string");
            expect(typeof user.email).toBe("string");
            expect(typeof user.email_verified).toBe("string");
            expect(typeof user.phone_number).toBe("string");
            expect(typeof user.image).toBe("string");
          });
        });
    });
  });
  describe("POST", () => {
    test("POST 201: Responds with newly posted user", () => {
        const newUser = {
            name: "John Doe",
            email: "johndoe@example.com",
            email_verified: "2024-01-01T10:00:00.000Z",
            phone_number: "123-456-7890",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg4LAqlO0MWJt_12uP6ZCMTv5zqEpWtY9aSw&s"
        };
      return request(app)
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .then(({ body: { user } }) => {
          expect(user).toMatchObject(newUser);
        });
    });
  });
  describe("ALL", () => {
    test("ALL 405: Returns Method not allowed if called with any other method", () => {
      return request(app)
        .patch("/api/users")
        .expect(405)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Method not allowed");
        });
    });
  });
});
