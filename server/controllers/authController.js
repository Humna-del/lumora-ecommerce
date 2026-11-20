import jwt from "jsonwebtoken";
import User from "../models/User.js";

const sendTokenCookie = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("lumora_token", token, {
    httpOnly: true, // Blocks JavaScript XSS access
    secure: isProd, // HTTPS only in production
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(statusCode).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409);
      return next(new Error("An account with this email already exists."));
    }

    const user = await User.create({ name, email, password });
    sendTokenCookie(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Explicitly include password since select: false is set on User model
    const user = await User.findOne({ email }).select("+password");

    // Generic error message prevents attackers from guessing valid emails
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      return next(new Error("Invalid email or password."));
    }

    sendTokenCookie(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Logout user (clear cookie)
// @route   POST /api/auth/logout
export const logoutUser = (_req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("lumora_token", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    expires: new Date(0),
  });
  res.status(200).json({ success: true, message: "Signed out successfully." });
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
export const getMe = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};