const db = require('./index');
const seed = require('./seed')

const runSeed = () => {
  return seed().then(() => db.end());
};

runSeed();
