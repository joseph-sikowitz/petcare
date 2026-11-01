import express from "express";
import dotenv from "dotenv";
import path from "node:path";

import usersRouter from "./routes/users.js";
import petsRouter from "./routes/pets.js";
import businessServicesRouter from "./routes/businessServicesRoutes.js";
import businessAppointmentsRouter from "./routes/businessAppointmentsRoutes.js";

// Read environment variables
dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the React production build
app.use(express.static("./frontend/dist"));

// Backend API routes
app.use("/api", usersRouter);
app.use("/api", petsRouter);
app.use("/api", businessServicesRouter);
app.use("/api", businessAppointmentsRouter);

// Return React's index.html for frontend routes
app.get("/{*path}", (req, res) => {
  res.sendFile(path.resolve("frontend/dist/index.html"));
});

app.listen(PORT, () => {
  console.log("Server is live");
});
