import express from "express";

import {
  registerUser,
  loginUser,
  googleLogin,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Public Routes */

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/google").post(googleLogin);

router.route("/forgot-password").post(forgotPassword);

router.route("/reset-password/:token").post(resetPassword);

/* Protected Routes */

router.use(protect);

router.route("/profile").get(getProfile).put(updateProfile);

router.route("/change-password").put(changePassword);

export default router;