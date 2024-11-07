const express = require("express");
const apiRouter = require("./routes/api_router");
const { customErrors } = require("./error_handling");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res, next) => next({ status: 404, msg: "Path not found" }));

app.use(customErrors);

module.exports = app;
