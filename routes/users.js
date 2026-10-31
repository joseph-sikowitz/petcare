/*
  Author: Joseph Sikowitz
  October 2026
*/

import express from "express";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";
import {
  getCount,
  getById,
  getByQuery,
  postUser,
  putUser,
} from "../database/users.js";

dotenv.config({ quiet: true });

const usersRouter = express.Router();

// GET for total users documents
usersRouter.get("/users/count", async (req, res) => {
  try {
    const count = await getCount();
    return res.status(200).json({ usersTotal: count });
  } catch (error) {
    console.error("Error getting users count: ", error.message);
    return res.status(500).json({ error: error.message });
  }
});

// GET users by query
usersRouter.get("/users", async (req, res) => {
  try {
    const queryResult = await getByQuery(req.query);
    return res.status(200).json(queryResult);
  } catch (error) {
    console.error("Error getting users by query: ", error.message);
    return res.status(500).json({ error: error.message });
  }
});

// GET users by ID
usersRouter.get("/users/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw new Error("ObjectId invalid");
    }
    const record = await getById(req.params.id);
    return res.status(200).json(record);
  } catch (error) {
    console.error("GET for /api/users/:id: ", error.message);
    return res.status(500).json({ error: error.message });
  }
});

// POST new user
usersRouter.post("/users", async (req, res) => {
  try {
    const postResult = await postUser(req.body);
    return res.status(200).json(postResult);
  } catch (error) {
    console.error("POST for /api/users: ", error.message);
    return res.status(500).json({ error: error.message });
  }
});

// PUT existing user
usersRouter.put("/users/:id", async (req, res) => {
  try {
    const putResult = await putUser(req.params.id, req.body);
    return res.status(200).json(putResult);
  } catch (error) {
    console.error("PUT for /api/users: ", error.message);
    return res.status(500).json({ error: error.message });
  }
});

export default usersRouter;
