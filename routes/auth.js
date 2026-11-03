/*
  Author: Joseph Sikowitz
  November 2026

  Auth routes
*/

import express from "express";
import bcrypt from "bcrypt";
import passport from "passport";

import { isAuthenticated } from "../middleware/auth.js";

import { getUserByUsername, postUser } from "../database/users.js";

const router = express.Router();

// Register endpoint
router.post("/register", async (req, res) => {
  try {
    const {
      firstName = null,
      lastName = null,
      username = null,
      password = null,
      businessName = null,
      addressLine1 = null,
      addressLine2 = null,
      city = null,
      state = null,
      zipCode = null,
      phoneNumber = null,
      email = null,
      owner = false,
    } = req.body;

    // Validation
    if (!username || !password || !firstName || !lastName || !email) {
      res.redirect(
        "/login?msg='Must include username, password, first name, last name, and email'"
      );
      return;
    }

    // Check if user already exists
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      res.redirect("/login?msg='Username already exists'");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Convert owner to boolean
    let boolOwner = false;
    if (owner === "on") {
      boolOwner = true;
    }

    // Create user
    const result = await postUser({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      businessName,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      phoneNumber,
      email,
      owner: boolOwner,
    });

    // Don't send password back
    delete result.password;

    res.redirect("/login");
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login?msg='Invalid credentials'",
  })
);

// Get current user (protected route)
router.get("/user", isAuthenticated, (req, res) => {
  console.log(
    "session:",
    req.session,
    "user:",
    req.user,
    "auth:",
    req.isAuthenticated()
  );
  delete req.user.password;
  res.json({ user: req.user });
});

// Logout endpoint
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Logout failed", error: err.message });
    }
    res.redirect("/");
  });
});

export default router;
