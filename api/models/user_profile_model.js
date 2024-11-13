const db = require("../../db/connection");

exports.selectUserProfiles = async () => {
  const userProfilesData = await db.query(`SELECT * FROM user_profiles;`);
  return userProfilesData.rows;
};

exports.selectUserProfileById = async (userProfileId) => {
  const userProfileData = await db.query(
    `SELECT * FROM user_profiles WHERE user_profile_id = $1;`,
    [userProfileId]
  );
  return userProfileData.rows[0];
};

exports.selectPostsByUserProfile = async (userProfileId) => {
  const postsData = await db.query(
    `SELECT * FROM posts WHERE user_profile_id = $1;`,
    [userProfileId]
  );
  return postsData.rows;
};

exports.insertUserProfile = async (newUserProfile) => {
  const { user_id, username, profile_picture_url, bio, joined_at } =
    newUserProfile;
  const postedUserProfile = await db.query(
    `INSERT INTO user_profiles (user_id, username, profile_picture_url, bio, joined_at) VALUES ($1,$2,$3,$4,$5) RETURNING *;`,
    [user_id, username, profile_picture_url, bio, joined_at]
  );
  return postedUserProfile.rows[0];
};

exports.updateUserProfile = async (userProfileId, profileUpdate) => {
  const originalUserProfileData = await db.query(
    `SELECT * FROM user_profiles WHERE user_profile_id = $1;`,
    [userProfileId]
  );
  if (originalUserProfileData.rows.length === 0) {
    throw { status: 404, msg: "User profile not found" };
  }
  const updatedUserProfile = {
    ...originalUserProfileData.rows[0],
    ...profileUpdate,
  };
  const { username, profile_picture_url, bio } = updatedUserProfile;

  const updatedUserProfileData = await db.query(
    `UPDATE user_profiles SET username = $1, profile_picture_url = $2, bio = $3 WHERE user_profile_id = $4 RETURNING *;`,
    [username, profile_picture_url, bio, userProfileId]
  );
  return updatedUserProfileData.rows[0];
};
