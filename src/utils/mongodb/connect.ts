import { MONGODB_NAME } from '@src/utils/env';

import clientPromise from '.';

import type { Db, MongoClient } from 'mongodb';

export async function connectMongo(): Promise<MongoDB> {
  const client = await clientPromise;
  const db = client.db(MONGODB_NAME);

  return new MongoDB(client, db);
}

export class MongoDB {
  client: MongoClient;
  db: Db;

  constructor(client: MongoClient, db: Db) {
    this.client = client;
    this.db = db;
  }

  getClient(): MongoClient {
    return this.client;
  }

  getDB(): Db {
    return this.db;
  }
}
