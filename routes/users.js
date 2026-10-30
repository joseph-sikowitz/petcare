import express from "express";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const usersRouter = express.Router();

//For testing only, remove after connecting to db
const sampleUser = {
  firstName: "Joe",
  lastName: "Sikowitz",
  username: "jsikowitz",
  password: "1234",
  businessName: "FLO",
  addressLine1: "10 Downing Street",
  addressLine2: "Unit B",
  city: "Boston",
  state: "MA",
  zipCode: "02115",
  phoneNumber: "617-666-9999",
  email: "hi@gmail.com",
  role: "owner",
};

//For testing only, remove when connected to db
usersRouter.get("/users", (req, res) => {
  res.json(sampleUser);
});

export default usersRouter;
