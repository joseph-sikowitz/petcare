/*
  Author: Joseph Sikowitz
  November 2026
*/

import db from "../database/db.js";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";

dotenv.config({ quiet: true });

const connection = db();
const collection = await connection.getCollection(
  process.env.MONGODB_COLLECTION_PETS
);

// Get a count of total pet documents in database
export async function getCount() {
  return await collection.countDocuments({});
}

// Get a single pet by ObjectId
export async function getById(id) {
  return await collection.findOne({ _id: new ObjectId(id) });
}

// Helper function for parsing URL query parameters
function buildQuery(query) {
  const { name, species, breed } = query;

  const mongoQuery = {};

  if (name && typeof name === "string" && name.trim()) {
    mongoQuery.name = { $regex: name, $options: "i" };
  }
  if (species && typeof species === "string" && species.trim()) {
    mongoQuery.species = { $regex: species, $options: "i" };
  }
  if (breed && typeof breed === "string" && breed.trim()) {
    mongoQuery.breed = { $regex: breed, $options: "i" };
  }

  return mongoQuery;
}

// Search for pets by URL parameters
export async function getByQuery(query) {
  const mongoQuery = buildQuery(query);
  return await collection.find(mongoQuery).sort({ name: 1 }).toArray();
}

// Add a new pet to the collection
export async function postPet(newPet) {
  const {
    name = null,
    species = null,
    breed = null,
    medicines = [],
    birthdate = null,
    user_id = null,
  } = newPet;

  let isoDate = birthdate;
  if (isoDate != null) {
    isoDate = new Date(isoDate);
  }

  return await collection.insertOne({
    name: name,
    species: species,
    breed: breed,
    medicines: medicines,
    birthdate: isoDate,
    user_id: new ObjectId(user_id),
  });
}

// Update existing pet by ID
export async function putPet(id, body) {
  if (!id) {
    throw new Error("Must provide pet ID for PUT");
  }

  const {
    name = null,
    species = null,
    breed = null,
    medicines = [],
    birthdate = null,
    user_id = null,
  } = body;

  let isoDate = birthdate;
  if (isoDate != null) {
    isoDate = new Date(isoDate);
  }

  let userId = user_id;
  if (user_id != null) {
    userId = new ObjectId(userId);
  }

  return await collection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        name,
        species,
        breed,
        medicines,
        isoDate,
        userId,
      },
    }
  );
}

// Delete pet by ID
export async function deletePet(id) {
  return await collection.deleteOne({ _id: new ObjectId(id) });
}
