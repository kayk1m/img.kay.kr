module.exports = async function () {
  if (global.__MONGOD__) {
    console.log('Stopping mongod');
    await global.__MONGOD__.stop();
  }
};
