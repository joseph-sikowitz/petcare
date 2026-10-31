/*
  Author: Joseph Sikowitz
  October 2026
*/

import { MongoClient } from "mongodb";
import dotenv from "dotenv";

export default function database() {
  const me = {};

  // Read environment variables
  dotenv.config({ quiet: true });

  // The MongoDB connection is cached and reused across the application.
  const client = new MongoClient(process.env.MONGODB_URI);
  let db;

  // Connect to database
  me.connect = async () => {
    if (!db) {
      await client.connect();
      db = client.db(process.env.MONGODB_NAME);
    }
    return db;
  };

  // Check if database connection active
  me.isActiveDb = () => {
    if (!db) {
      return false;
    }

    return true;
  };

  // Get a collection in the database
  me.getCollection = async (collectionName) => {
    const database = await me.connect();
    return database.collection(collectionName);
  };

  // Disconnect database
  me.disconnect = async () => {
    await client.close();
  };

  // Return database object
  return me;
}
