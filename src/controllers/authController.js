import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import AppError from "../utils/AppError.js";
import { signToken, cookieOptions } from "../utils/jwt.js";

// REGISTER
export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new AppError(errors.array()[0].msg, 422);

  const { name, email, password, phoneNumber } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError("User already exists", 400);

  const user = await User.create({ name, email, password, phoneNumber });

  const token = signToken(user._id);
  res
    .cookie("token", token, cookieOptions)
    .status(201)
    .json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
});

// LOGIN
export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new AppError(errors.array()[0].msg, 422);

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new AppError("Invalid credentials", 401);

  const ok = await user.matchPassword(password);
  if (!ok) throw new AppError("Invalid credentials", 401);

  const token = signToken(user._id);
  res.cookie("token", token, cookieOptions).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    },
  });
});

// LOGOUT
export const logout = asyncHandler(async (req, res) => {
  res
    .cookie("token", "", { httpOnly: true, expires: new Date(0) })
    .json({ success: true, message: "Logged out" });
});

// GET PROFILE
export const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

// UPDATE PROFILE
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phoneNumber, password } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) throw new AppError("User not found", 404);

  if (name !== undefined) user.name = name;
  if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
  if (password) user.password = password; // hashed in pre-save

  await user.save();
  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    },
  });
});
