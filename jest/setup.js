const fs = require('fs');
const path = require('path');

const loadEnvConfig = require('@next/env').loadEnvConfig;
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoMemoryServerStates } = require('mongodb-memory-server-core/lib/MongoMemoryServer');

const globalConfigPath = path.join(__dirname, 'globalConfig.json');

module.exports = async () => {
  // Test Environment
  loadEnvConfig(process.cwd());
  process.env.HASHIDS_KEY = 'foo';

  console.log('Starting mongod');
  const mongoServer = await MongoMemoryServer.create();

  if (mongoServer.state !== MongoMemoryServerStates.running) {
    await mongoServer.start();
  }

  const mongoConfig = {
    mongoDBName: process.env.TEST_DB_NAME || 'test',
    mongoUri: mongoServer.getUri(),
  };
  process.env.MONGODB_URI = mongoConfig.mongoUri;
  process.env.MONGODB_NAME = mongoConfig.mongoDBName;

  fs.writeFileSync(globalConfigPath, JSON.stringify(mongoConfig));

  global.__MONGOD__ = mongoServer;
};
