const format = require("pg-format");
const db = require("./connection");

async function seed({
  users,
  user_profiles,
  posts,
  post_likes,
  post_comments,
  post_comment_likes,
  post_comment_replies,
  post_comment_reply_likes,
}) {
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
        "joined_at" TIMESTAMP DEFAULT NOW()
      );`);

  await db.query(`CREATE TABLE "posts" (
        "post_id" SERIAL PRIMARY KEY,
        "caption" VARCHAR,
        "user_profile_id" INT REFERENCES user_profiles(user_profile_id) NOT NULL,
        "private_post" boolean NOT NULL,
        "created_at" TIMESTAMP DEFAULT NOW()
      );`);

  await db.query(` CREATE TABLE "post_likes" (
            "post_like_id" SERIAL PRIMARY KEY,
            "post_id" INT REFERENCES posts(post_id) NOT NULL,
            "user_profile_id" INT REFERENCES user_profiles(user_profile_id) NOT NULL,
            "created_at" TIMESTAMP DEFAULT NOW()
          );`);
  await db.query(` CREATE TABLE "post_comments" (
        "post_comment_id" SERIAL PRIMARY KEY,
        "post_id" INT REFERENCES posts(post_id) NOT NULL,
        "comment_body" VARCHAR(2000) NOT NULL,
        "user_profile_id" INT REFERENCES user_profiles(user_profile_id) NOT NULL,
        "created_at" TIMESTAMP DEFAULT NOW()
      );`);

  await db.query(`CREATE TABLE "post_comment_likes" (
            "post_comment_like_id" SERIAL PRIMARY KEY,
            "post_comment_id" INT REFERENCES post_comments(post_comment_id) NOT NULL,
            "user_profile_id" INT REFERENCES user_profiles(user_profile_id) NOT NULL,
            "created_at" TIMESTAMP DEFAULT NOW()
          );`);
  await db.query(` CREATE TABLE "post_comment_replies" (
        "post_comment_reply_id" SERIAL PRIMARY KEY,
        "post_comment_id" INT REFERENCES post_comments(post_comment_id) NOT NULL,
        "reply_body" VARCHAR NOT NULL,
        "user_profile_id" INT REFERENCES user_profiles(user_profile_id) NOT NULL,
        "created_at" TIMESTAMP DEFAULT NOW()
      );`);

  await db.query(`CREATE TABLE "post_comment_reply_likes" (
        "post_comment_reply_like_id" SERIAL PRIMARY KEY,
        "comment_reply_id" INT REFERENCES post_comment_replies(post_comment_reply_id) NOT NULL,
        "user_profile_id" INT REFERENCES user_profiles(user_profile_id) NOT NULL,
        "created_at" TIMESTAMP DEFAULT NOW()
      );`);
  const insertUsersQueryStr = format(
    "INSERT INTO users (name, email, email_verified, phone_number, image) VALUES %L;",
    users.map(({ name, email, email_verified, phone_number, image }) => [
      name,
      email,
      email_verified,
      phone_number,
      image,
    ])
  );
  await db.query(insertUsersQueryStr);

  const insertUserProfilesQueryStr = format(
    "INSERT INTO user_profiles (user_id, username, profile_picture_url, bio, joined_at) VALUES %L;",
    user_profiles.map(({ user_id, username, profile_picture_url, bio, joined_at }) => [
      user_id, username, profile_picture_url, bio, joined_at
    ])
  );
  await db.query(insertUserProfilesQueryStr);

  const insertPostsQueryStr = format(
    "INSERT INTO posts (caption, user_profile_id, private_post, created_at) VALUES %L;",
    posts.map(({caption, user_profile_id, private_post, created_at }) => [
      caption, user_profile_id, private_post, created_at
    ])
  );
  await db.query(insertPostsQueryStr);

  const insertPostLikesQueryStr = format(
    "INSERT INTO post_likes (post_id, user_profile_id, created_at) VALUES %L;",
    post_likes.map(({ post_id, user_profile_id, created_at }) => [
      post_id, user_profile_id, created_at
    ])
  );
  await db.query(insertPostLikesQueryStr);

  const insertPostCommentsQueryStr = format(
    "INSERT INTO post_comments (post_id, comment_body, user_profile_id, created_at) VALUES %L;",
    post_comments.map(({post_id, comment_body, user_profile_id, created_at }) => [
      post_id, comment_body, user_profile_id, created_at
    ])
  );
  await db.query(insertPostCommentsQueryStr);
  
  const insertPostCommentLikesQueryStr = format(
    "INSERT INTO post_comment_likes (post_comment_id, user_profile_id, created_at) VALUES %L;",
    post_comment_likes.map(({ post_comment_id, user_profile_id, created_at }) => [
      post_comment_id, user_profile_id, created_at
    ])
  );
  await db.query(insertPostCommentLikesQueryStr);
  
  const insertPostCommentRepliesQueryStr = format(
    "INSERT INTO post_comment_replies (post_comment_id, reply_body, user_profile_id, created_at) VALUES %L;",
    post_comment_replies.map(({ post_comment_id, reply_body, user_profile_id, created_at }) => [
      post_comment_id, reply_body, user_profile_id, created_at
    ])
  );
  await db.query(insertPostCommentRepliesQueryStr);
  
  const insertPostCommentReplyLikesQueryStr = format(
    "INSERT INTO post_comment_reply_likes (comment_reply_id, user_profile_id, created_at) VALUES %L;",
    post_comment_reply_likes.map(({ comment_reply_id, user_profile_id, created_at }) => [
      comment_reply_id, user_profile_id, created_at
    ])
  );
  await db.query(insertPostCommentReplyLikesQueryStr);
}
module.exports = seed;
