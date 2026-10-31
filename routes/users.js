import express from "express";
import dotenv from "dotenv";
import { getById } from "../database/users.js";

dotenv.config({ quiet: true });

const usersRouter = express.Router();

usersRouter.get("/users/:id", async (req, res) => {
  try {
    const record = await getById(req.params.id);
    return res.status(200).json(record);
  } catch (error) {
    console.error("GET for /api/users/:id: ", error);
    return res.status(500).json({ error: error });
  }
});

export default usersRouter;
