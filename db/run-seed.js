const db = require("./connection");
const seed = require("./seed");
const devData = require("./data.json");

const runSeed = async () => {
  await seed(devData);
  db.end();
};

runSeed();
