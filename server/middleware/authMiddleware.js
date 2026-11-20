import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Require logged-in user
export const protect = async (req, res, next) => {
  try {
    const token =
      req.cookies?.lumora_token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      res.status(401);
      return next(new Error("Not authorized. Please sign in."));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401);
      return next(new Error("Account no longer exists."));
    }

    req.user = user;
    next();
  } catch (_err) {
    res.status(401);
    next(new Error("Session expired or invalid token."));
  }
};

// Attach user if logged in, otherwise allow guest access (great for guest checkout!)
export const optionalAuth = async (req, _res, next) => {
  try {
    const token = req.cookies?.lumora_token;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    }
  } catch (_err) {
    req.user = null;
  }
  next();
};

// Role-Based Access Control (Admin guard)
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403);
  next(new Error("Access denied: Admin privileges required."));
};