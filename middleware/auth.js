/*
  Author: Joseph Sikowitz
  November 2026

  Auth middleware
*/

export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Not authenticated" });
};
