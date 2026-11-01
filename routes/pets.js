/*
  Author: Joseph Sikowitz
  October 2026
*/

import express from "express";
import { ObjectId } from "mongodb";
import {
  getCount,
  getById,
  getByQuery,
  postPet,
  putPet,
  deletePet,
} from "../database/pets.js";

const petsRouter = express.Router();

// GET for total pets documents
petsRouter.get("/pets/count", async (req, res) => {
  try {
    const count = await getCount();
    return res.status(200).json({ petsTotal: count });
  } catch (error) {
    console.error("Error getting pets count: ", error.message);
    return res.status(500).json({ error: error.message });
  }
});

// GET pets by query
petsRouter.get("/pets", async (req, res) => {
  try {
    const queryResult = await getByQuery(req.query);
    return res.status(200).json(queryResult);
  } catch (error) {
    console.error("Error getting pets by query: ", error.message);
    return res.status(500).json({ error: error.message });
  }
});

// GET pets by ID
petsRouter.get("/pets/:id", async (req, res) => {
  try {
    // Check if passed ID is valid and throw 422 if not
    if (!ObjectId.isValid(req.params.id)) {
      const error = new Error("ObjectId invalid");
      error.code = 422;
      throw error;
    }
    const record = await getById(req.params.id);
    return res.status(200).json(record);
  } catch (error) {
    console.error("GET for /api/pets/:id: ", error.message);
    if (!error.code) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(error.code).json({ error: error.message });
  }
});

// POST new pet
petsRouter.post("/pets", async (req, res) => {
  try {
    const postResult = await postPet(req.body);
    return res.status(200).json(postResult);
  } catch (error) {
    console.error("POST for /api/pets: ", error.message);
    return res.status(500).json({ error: error.message });
  }
});

// PUT existing pet
petsRouter.put("/pets/:id", async (req, res) => {
  try {
    // Check if passed ID is valid and throw 422 if not
    if (!ObjectId.isValid(req.params.id)) {
      const error = new Error("ObjectId invalid");
      error.code = 422;
      throw error;
    }
    const putResult = await putPet(req.params.id, req.body);
    return res.status(200).json(putResult);
  } catch (error) {
    console.error("PUT for /api/pets: ", error.message);
    if (!error.code) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(error.code).json({ error: error.message });
  }
});

// DELETE existing pet
petsRouter.delete("/pets/:id", async (req, res) => {
  try {
    // Check if passed ID is valid and throw 422 if not
    if (!ObjectId.isValid(req.params.id)) {
      const error = new Error("ObjectId invalid");
      error.code = 422;
      throw error;
    }
    const deleteResult = await deletePet(req.params.id);
    return res.status(200).json(deleteResult);
  } catch (error) {
    console.error("DELETE for /api/pets: ", error.message);
    if (!error.code) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(error.code).json({ error: error.message });
  }
});

export default petsRouter;
