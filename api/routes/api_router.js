const apiRouter = require("express").Router();
const { getApis } = require("../controllers/api_controller");
const { methodNotAllowed } = require('../error_handling');

apiRouter.route("/").get(getApis).all(methodNotAllowed);

module.exports = apiRouter;
