const {
  selectUserProfiles,
  insertUserProfile,
  selectUserProfileById,
  selectPostsByUserProfile,
  updateUserProfile,
} = require("../models/user_profile_model");

exports.getUserProfiles = async (req, res, next) => {
  const userProfiles = await selectUserProfiles();
  res.status(200).send({ user_profiles: userProfiles });
};

exports.getUserProfileById = async (req, res, next) => {
  try {
    const { user_profile_id } = req.params;
    if (!Number(user_profile_id)) {
      throw { status: 400, msg: "Bad request" };
    }
    const userProfile = await selectUserProfileById(user_profile_id);
    if (!userProfile) {
      throw { status: 404, msg: "User profile not found" };
    }
    res.status(200).send({ user_profile: userProfile });
  } catch (error) {
    next(error);
  }
};

exports.getPostsByUserProfile = async (req, res, next) => {
  try {
    const { user_profile_id } = req.params;
    if (!Number(user_profile_id)) {
      throw { status: 400, msg: "Bad request" };
    }
    const posts = await selectPostsByUserProfile(user_profile_id);
    res.status(200).send({ posts });
  } catch (error) {
    next(error);
  }
};

exports.postUserProfile = async (req, res, next) => {
  try {
    const newUserProfile = req.body;
    const postedUserProfile = await insertUserProfile(newUserProfile);
    res.status(201).send({ user_profile: postedUserProfile });
  } catch (error) {
    next(error);
  }
};

exports.patchUserProfile = async (req, res, next) => {
  try {
    const { user_profile_id } = req.params;
    const profileUpdate = req.body;
    if (!Number(user_profile_id)) {
      throw { status: 400, msg: "Bad request" };
    }
    const userProfile = await updateUserProfile(user_profile_id, profileUpdate);
    res.status(200).send({ user_profile: userProfile });
  } catch (error) {
    next(error);
  }
};
