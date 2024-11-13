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
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg4LAqlO0MWJt_12uP6ZCMTv5zqEpWtY9aSw&s",
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

describe("/api/user_profiles", () => {
  describe("GET", () => {
    test("GET 200: Responds with an array of user profile objects with the correct keys", () => {
      return request(app)
        .get("/api/user_profiles")
        .expect(200)
        .then(({ body: { user_profiles } }) => {
          expect(user_profiles.length).toBe(3);
          user_profiles.forEach((user_profile) => {
            expect(typeof user_profile.user_profile_id).toBe("number");
            expect(typeof user_profile.user_id).toBe("number");
            expect(typeof user_profile.username).toBe("string");
            expect(typeof user_profile.profile_picture_url).toBe("string");
            expect(typeof user_profile.bio).toBe("string");
            expect(typeof user_profile.joined_at).toBe("string");
          });
        });
    });
  });
  describe("GET /:user_profile_id", () => {
    test("GET 200: Responds with a user_profile object with the correct keys", () => {
      return request(app)
        .get("/api/user_profiles/1")
        .expect(200)
        .then(({ body: { user_profile } }) => {
            expect(typeof user_profile.user_profile_id).toBe("number");
            expect(typeof user_profile.user_id).toBe("number");
            expect(typeof user_profile.username).toBe("string");
            expect(typeof user_profile.profile_picture_url).toBe("string");
            expect(typeof user_profile.bio).toBe("string");
            expect(typeof user_profile.joined_at).toBe("string");
        });
    });
    test("GET 200: Responds with the corresponding user_profile object", () => {
        return request(app)
          .get("/api/user_profiles/1")
          .expect(200)
          .then(({ body: { user_profile } }) => {
              expect(user_profile.user_profile_id).toBe(1);
              expect(user_profile.user_id).toBe(1);
              expect(user_profile.username).toBe("johndoe");
              expect(user_profile.profile_picture_url).toBe( "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg4LAqlO0MWJt_12uP6ZCMTv5zqEpWtY9aSw&s");
              expect(user_profile.bio).toBe("Software developer and tech enthusiast.");
              expect(user_profile.joined_at).toBe("2024-01-01T11:00:00.000Z");
          });
      });
    test("GET 404: Responds with user profile not found when passed an user_profile_id with no corresponding user_profile", () => {
        return request(app)
          .get("/api/user_profiles/10")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("User profile not found");
          });
      });
      test("GET 400: Responds with bad request if passed an user_profile_id value which is not an integer", () => {
        return request(app)
          .get("/api/user_profiles/not-a-number")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
  });
  describe("GET /:user_profile_id/posts", () => {
    test("GET 200: Responds with an array of users post objects with the correct keys", () => {
      return request(app)
        .get("/api/user_profiles/1/posts")
        .expect(200)
        .then(({ body: { posts } }) => {
          expect(posts.length).toBe(1);
          posts.forEach((post) => {
            expect(typeof post.post_id).toBe("number");
            expect(typeof post.user_profile_id).toBe("number");
            expect(typeof post.caption).toBe("string");
            expect(typeof post.private_post).toBe("boolean");
            expect(typeof post.created_at).toBe("string");
          });
        });
    });
    test("GET 400: Responds with bad request if passed an user_profile_id value which is not an integer", () => {
        return request(app)
          .get("/api/user_profiles/not-a-number/posts")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
  });
  describe("POST", () => {
    test("POST 201: Responds with newly posted user profile", () => {
        const newUserProfile = {
            user_id: 1,
            username: "johndo",
            profile_picture_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg4LAqlO0MWJt_12uP6ZCMTv5zqEpWtY9aSw&s",
            bio: "Software developer and tech enthusiast.",
            joined_at: "2024-01-01T10:00:00.000Z"
        };
      return request(app)
        .post("/api/user_profiles")
        .send(newUserProfile)
        .expect(201)
        .then(({ body: { user_profile } }) => {
          expect(user_profile).toMatchObject(newUserProfile);
        });
    });
  });
  describe("PATCH", () => {
    test("PATCH 200: Responds with modified user profile when given one column to update", () => {
        const updatedProfile = {
            username: "johnnydoe",
        };
      return request(app)
        .patch("/api/user_profiles/1")
        .send(updatedProfile)
        .expect(200)
        .then(({ body: { user_profile } }) => {
          expect(user_profile).toMatchObject(updatedProfile);
        });
    });
    test("PATCH 200: Responds with modified user profile when given multiple columns to update", () => {
        const updatedProfile = {
            username: "johnnydoe",
            bio: 'Bad at bios'
        };
      return request(app)
        .patch("/api/user_profiles/1")
        .send(updatedProfile)
        .expect(200)
        .then(({ body: { user_profile } }) => {
          expect(user_profile).toMatchObject(updatedProfile);
        });
    });
      test("PATCH 404: Responds with user profile not found when passed an user_profile_id with no corresponding user_profile", () => {
        return request(app)
          .patch("/api/user_profiles/10")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("User profile not found");
          });
      });
  });
  describe("ALL", () => {
    test("ALL 405: Returns Method not allowed if called with any other method", () => {
      return request(app)
        .patch("/api/user_profiles")
        .expect(405)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Method not allowed");
        });
    });
  });
  describe("ALL /:user_profile_id", () => {
    test("ALL 405: Returns Method not allowed if called with any other method", () => {
      return request(app)
        .post("/api/user_profiles/1")
        .expect(405)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Method not allowed");
        });
    });
  });
  describe("ALL /:user_profile_id/posts", () => {
    test("ALL 405: Returns Method not allowed if called with any other method", () => {
      return request(app)
        .post("/api/user_profiles/1/posts")
        .expect(405)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Method not allowed");
        });
    });
  });
});

