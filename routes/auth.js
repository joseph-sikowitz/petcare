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
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await postUser({
      username,
      password: hashedPassword,
    });

    // Don't send password back
    delete result.password;

    res.status(201).json({
      message: "User created successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
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
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Logout failed", error: err.message });
    }
    res.json({ message: "Logout successful" });
  });
});

export default router;
