const userProfileRouter = require("express").Router();
const { getUserProfiles, postUserProfile ,getUserProfileById,getPostsByUserProfile,patchUserProfile} = require("../controllers/user_profile_controller");
const { methodNotAllowed } = require('../error_handling');

userProfileRouter.route("/").get(getUserProfiles).post(postUserProfile).all(methodNotAllowed);

userProfileRouter.route("/:user_profile_id").get(getUserProfileById).patch(patchUserProfile).all(methodNotAllowed);

userProfileRouter.route("/:user_profile_id/posts").get(getPostsByUserProfile).all(methodNotAllowed);


module.exports = userProfileRouter;
