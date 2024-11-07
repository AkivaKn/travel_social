const apiRouter = require("express").Router();
const { getApis } = require("../controllers/api_controller");
const { methodNotAllowed } = require('../error_handling');
const userRouter = require("./user_router");

apiRouter.route("/").get(getApis).all(methodNotAllowed);

apiRouter.use('/users',userRouter)

module.exports = apiRouter;
