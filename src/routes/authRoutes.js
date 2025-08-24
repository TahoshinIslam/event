import { Router } from "express";
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";
import { registerRules, loginRules } from "../validators/authValidators.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", registerRules, register);
router.post("/login", loginRules, login);
router.post("/logout", protect, logout);
router.get("/me", protect, getProfile);
router.patch("/me", protect, updateProfile);

export default router;
