const apiRouter = require("express").Router();
const { getApis } = require("../controllers/api_controller");

apiRouter.route("/").get(getApis);

module.exports = apiRouter;
