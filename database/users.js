import db from "../database/db.js";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";

dotenv.config({ quiet: true });

const connection = db();
const collection = await connection.getCollection(
  process.env.MONGODB_COLLECTION_USERS
);

export async function getById(id) {
  return await collection.findOne({ _id: new ObjectId(id) });
}
