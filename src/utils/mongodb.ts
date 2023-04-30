import { MongoClient, MongoClientOptions, ServerApiVersion } from 'mongodb';

const { DATABASE_URL, DATABASE_NAME } = process.env;

if (!DATABASE_URL) {
  throw new Error('Please define the DATABASE_URL environment variable inside .env.local');
}

if (!DATABASE_NAME) {
  throw new Error('Please define the DATABASE_NAME environment variable inside .env.local');
}

// @ts-ignore
let cached = global.mongo;

if (!cached) {
  // @ts-ignore
  cached = global.mongo = {};
}

export async function connectToDatabase(): Promise<any> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const conn = {};

    const options: MongoClientOptions = {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    };

    cached.promise = MongoClient.connect(DATABASE_URL, options)
      .then(client => {
        // @ts-ignore
        conn.client = client;
        return client.db(DATABASE_NAME);
      })
      .then(db => {
        // @ts-ignore
        conn.db = db;
        cached.conn = conn;
      });
  }

  await cached.promise;

  return cached.conn;
}
