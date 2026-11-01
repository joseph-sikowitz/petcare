/*
  Author: Thai Ken Yong
  October 2026

  Business Services CRUD - MongoDB Operations
*/

import database from "./db.js";
import { ObjectId } from "mongodb";

const db = database();

// READ: Retrieve all services
export async function getAllServices() {
  const collection = await db.getCollection("services");
  return collection.find({}).toArray();
}

// CREATE: Create a new service
export async function createService(service) {
  const collection = await db.getCollection("services");
  const result = await collection.insertOne(service);
  return { _id: result.insertedId, ...service };
}

// UPDATE: Update an existing service
export async function updateService(id, service) {
  const collection = await db.getCollection("services");
  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: service },
  );
  return result.matchedCount > 0;
}

// DELETE: Delete a service
export async function deleteService(id) {
  const collection = await db.getCollection("services");
  const result = await collection.deleteOne({
    _id: new ObjectId(id),
  });
  return result.deletedCount > 0;
}

