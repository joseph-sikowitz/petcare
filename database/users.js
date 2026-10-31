/*
  Author: Joseph Sikowitz
  October 2026
*/

import db from "../database/db.js";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";

dotenv.config({ quiet: true });

const connection = db();
const collection = await connection.getCollection(
  process.env.MONGODB_COLLECTION_USERS
);

// Get a count of total user documents in database
export async function getCount() {
  return await collection.countDocuments({});
}

// Get a single user by ObjectId
export async function getById(id) {
  return await collection.findOne({ _id: new ObjectId(id) });
}

// Helper function for parsing URL query parameters
function buildQuery(query) {
  const { firstName, lastName, username, businessName, email } = query;

  const mongoQuery = {};

  if (firstName && typeof firstName === "string" && firstName.trim()) {
    mongoQuery.firstName = { $regex: firstName, $options: "i" };
  }
  if (lastName && typeof lastName === "string" && lastName.trim()) {
    mongoQuery.lastName = { $regex: lastName, $options: "i" };
  }
  if (username && typeof username === "string" && username.trim()) {
    mongoQuery.username = { $regex: username, $options: "i" };
  }
  if (businessName && typeof businessName === "string" && businessName.trim()) {
    mongoQuery.businessName = { $regex: businessName, $options: "i" };
  }
  if (email && typeof email === "string" && email.trim()) {
    mongoQuery.email = { $regex: email, $options: "i" };
  }

  return mongoQuery;
}

// Search for users by URL parameters
export async function getByQuery(query) {
  try {
    const mongoQuery = buildQuery(query);
    return await collection.find(mongoQuery).sort({ name: 1 }).toArray();
  } catch (error) {
    console.error("Error executing users query: ", error);
  }
}

// Add a new user to the collection
export async function postUser(newUser) {
  try {
    const {
      firstName,
      lastName,
      username,
      password,
      businessName,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      phoneNumber,
      email,
      owner,
    } = newUser;

    if (zipCode != null && isNaN(zipCode)) {
      throw new Error("Zipcode is not a number");
    }

    if (owner != null && typeof owner != "boolean") {
      throw new Error("Owner must be boolean type");
    }

    return await collection.insertOne({
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password,
      businessName: businessName,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: city,
      state: state,
      zipCode: zipCode,
      phoneNumber: phoneNumber,
      email: email,
      owner: owner,
    });
  } catch (error) {
    console.error("Error posting new user: ", error);
  }
}
