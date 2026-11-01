import express from "express";
import dotenv from "dotenv";

import usersRouter from "./routes/users.js";
import businessServicesRouter from "./routes/businessServicesRoutes.js";

// Read environment variables
dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//TODO: swap this structure out for React Router
app.use("/", express.static("./frontend/dist"));
app.use("/api", usersRouter);
app.use("/api", businessServicesRouter);

app.listen(PORT, () => {
  console.log("Server is live");
});
