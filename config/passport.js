/*
  Author: Joseph Sikowitz
  November 2026

  Passport config
*/

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { getUserByUsername, getUserById } from "../database/users.js";

const strategy = new LocalStrategy(
  { usernameField: "username", passwordField: "password" },
  async (username, password, done) => {
    try {
      const user = await getUserByUsername(username);
      if (!user) {
        // Case 2. User not found or password incorrect
        return done(null, false, { message: "User or password incorrect" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return done(null, false, { message: "User or password incorrect" });
      }

      // Case 3. User found and password correct
      delete user.password;
      return done(null, user);
    } catch (error) {
      // Case 1. There is an error
      return done(error);
    }
  }
);

passport.use(strategy);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
