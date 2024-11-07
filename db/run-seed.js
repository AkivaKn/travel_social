const db = require('./connection');
const seed = require('./seed');
const devData = require('./data.json')

const runSeed = () => {
  return seed(devData).then(() => db.end());
};

runSeed();
