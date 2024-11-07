const userRouter = require("express").Router();
const { getUsers,postUser } = require("../controllers/user_controller");
const { methodNotAllowed } = require('../error_handling');

userRouter.route("/").get(getUsers).post(postUser).all(methodNotAllowed);

module.exports = userRouter;
