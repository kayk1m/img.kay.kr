import cryptoRandomString from 'crypto-random-string';

import { MONGODB_NAME } from '../env';

import { connectMongo } from './connect';

import type { MongoDB } from './connect';

describe('mongodb connection', () => {
  let mongo: MongoDB;

  beforeAll(async () => {
    mongo = await connectMongo();
  });

  afterAll(async () => {
    await mongo.client.close();
  });

  it('Check db_name', async () => {
    expect(mongo.client.options.dbName).toBe(MONGODB_NAME);
    expect(mongo.db.databaseName).toBe(MONGODB_NAME);
  });

  it('Create and drop collection', async () => {
    const collectionName = cryptoRandomString({ length: 10, type: 'alphanumeric' });

    const result = await mongo.db.createCollection(collectionName);
    expect(result.collectionName).toBe(collectionName);

    const success = await mongo.db.dropCollection(collectionName);
    expect(success).toBe(true);

    const collections = await mongo.db.listCollections().toArray();
    expect(collections.findIndex((collection) => collection.name === collectionName)).toBe(-1);
  });
});
