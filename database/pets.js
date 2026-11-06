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
  process.env.MONGODB_COLLECTION_PETS,
);

// Get a count of total pet documents in database
export async function getPetCount() {
  return await collection.countDocuments({});
}

// Get a single pet by ObjectId
export async function getPetById(id) {
  return await collection.findOne({ _id: new ObjectId(id) });
}

// Helper function for parsing URL query parameters
function buildQuery(query) {
  const { name, species, breed, user_id } = query;

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
  if (user_id && typeof user_id === "string") {
    mongoQuery.user_id = new ObjectId(user_id);
  }

  return mongoQuery;
}

// Search for pets by URL parameters
export async function getPetByQuery(query) {
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

  const isoDate = birthdate ? new Date(birthdate) : new Date();

  const petToAdd = {
    name: name,
    species: species,
    breed: breed,
    medicines: medicines,
    birthdate: isoDate,
    user_id: new ObjectId(user_id),
  };

  const res = await collection.insertOne(petToAdd);

  return { ...petToAdd, _id: res.insertedId };
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
  } = body;

  let isoDate = birthdate;
  if (isoDate != null) {
    isoDate = new Date(isoDate);
  }

  const dataToAdd = {
    name: name,
    species: species,
    breed: breed,
    medicines: medicines,
    birthdate: isoDate,
  };

  await collection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: { ...dataToAdd },
    }
  );

  return { ...dataToAdd, _id: new ObjectId(id) };
}

// Delete pet by ID
export async function deletePet(id) {
  return await collection.deleteOne({ _id: new ObjectId(id) });
}
