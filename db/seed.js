const db = require("./index");

async function seed() {
  await db.query(`DROP TABLE IF EXISTS post_comment_reply_likes;`);
  await db.query(`DROP TABLE IF EXISTS post_comment_replies;`);
  await db.query(`DROP TABLE IF EXISTS post_comment_likes;`);
  await db.query(`DROP TABLE IF EXISTS post_comments;`);
  await db.query(`DROP TABLE IF EXISTS post_likes;`);
  await db.query(`DROP TABLE IF EXISTS posts;`);
  await db.query(`DROP TABLE IF EXISTS user_profiles;`);
  await db.query(`DROP TABLE IF EXISTS verification_tokens;`);
  await db.query(`DROP TABLE IF EXISTS sessions;`);
  await db.query(`DROP TABLE IF EXISTS accounts;`);
  await db.query(`DROP TABLE IF EXISTS user_credentials;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`CREATE TABLE "users" (
        "user_id" SERIAL PRIMARY KEY,
        "name" VARCHAR,
        "email" VARCHAR UNIQUE,
        "email_verified" TIMESTAMP,
        "phone_number" VARCHAR,
        "image" VARCHAR
      );`);

  await db.query(`CREATE TABLE "user_credentials" (
        "user_credentials_id" SERIAL PRIMARY KEY,
        "password" VARCHAR,
        "user_id" INT REFERENCES users(user_id)
      );`);

  await db.query(`CREATE TABLE "accounts" (
        "account_id" SERIAL PRIMARY KEY,
        "user_id" INT REFERENCES users(user_id),
        "type" VARCHAR,
        "provider" VARCHAR,
        "provider_account_id" VARCHAR,
        "refresh_token" VARCHAR,
        "access_token" VARCHAR,
        "expires_at" INT,
        "token_type" VARCHAR,
        "scope" VARCHAR,
        "id_token" VARCHAR,
        "session_state" VARCHAR
      );`);

  await db.query(`CREATE TABLE "sessions" (
        "session_id" SERIAL PRIMARY KEY,
        "expires" TIMESTAMP,
        "session_token" VARCHAR,
        "user_id" INT REFERENCES users(user_id)
      );`);

  await db.query(`CREATE TABLE "verification_tokens" (
        "identifier" VARCHAR,
        "token" VARCHAR,
        "expires" TIMESTAMP,
        "user_id" INT REFERENCES users(user_id)
      );`);

  await db.query(`CREATE TABLE "user_profiles" (
        "user_profile_id" SERIAL PRIMARY KEY,
        "user_id" INT REFERENCES users(user_id),
        "username" VARCHAR UNIQUE,
        "profile_picture_url" VARCHAR,
        "bio" VARCHAR,
        "joined_at" TIMESTAMP
      );`);

  await db.query(`CREATE TABLE "posts" (
        "post_id" SERIAL PRIMARY KEY,
        "caption" VARCHAR,
        "user_id" INT REFERENCES users(user_id),
        "private" boolean,
        "created_at" TIMESTAMP DEFAULT NOW()
      );`);

  await db.query(` CREATE TABLE "post_likes" (
            "post_like_id" SERIAL PRIMARY KEY,
            "post_id" INT REFERENCES posts(post_id),
            "user_id" INT REFERENCES users(user_id),
            "created_at" TIMESTAMP DEFAULT NOW()
          );`);
  await db.query(` CREATE TABLE "post_comments" (
        "post_comment_id" SERIAL PRIMARY KEY,
        "post_id" INT REFERENCES posts(post_id),
        "comment_body" VARCHAR,
        "user_id" INT REFERENCES users(user_id),
        "created_at" TIMESTAMP DEFAULT NOW()
      );`);

  await db.query(`CREATE TABLE "post_comment_likes" (
            "post_comment_like_id" SERIAL PRIMARY KEY,
            "post_comment_id" INT REFERENCES post_comments(post_comment_id),
            "user_id" INT REFERENCES users(user_id),
            "created_at" TIMESTAMP DEFAULT NOW()
          );`);
  await db.query(` CREATE TABLE "post_comment_replies" (
        "post_comment_reply_id" SERIAL PRIMARY KEY,
        "post_comment_id" INT REFERENCES post_comments(post_comment_id),
        "reply_body" VARCHAR,
        "user_id" INT REFERENCES users(user_id),
        "created_at" TIMESTAMP DEFAULT NOW()
      );`);

  await db.query(`CREATE TABLE "post_comment_reply_likes" (
        "post_comment_reply_like_id" SERIAL PRIMARY KEY,
        "comment_reply_id" INT REFERENCES post_comment_replies(post_comment_reply_id),
        "user_id" INT REFERENCES users(user_id),
        "created_at" TIMESTAMP DEFAULT NOW()
      );`);
}
module.exports = seed;
