import express from "express";

import {
  createApplication,
  getApplications,
  getApplication,
  getApplicationActivities,
  addApplicationActivity,
  updateApplicationActivity,
  deleteApplicationActivity,
  updateApplication,
  deleteApplication,
  addInterviewRound,
  updateInterviewRound,
  deleteInterviewRound,
} from "../controllers/applicationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create application
router.post("/", protect, createApplication);

// Get all applications
router.get("/", protect, getApplications);

// Get application activity history
router.get("/:id/activities", protect, getApplicationActivities);

// Add activity to an application
router.post("/:id/activities", protect, addApplicationActivity);

// Update activity in an application
router.put("/:id/activities/:activityId", protect, updateApplicationActivity);

// Delete activity from an application
router.delete("/:id/activities/:activityId", protect, deleteApplicationActivity);

// Get one application
router.get("/:id", protect, getApplication);

// Update application
router.put("/:id", protect, updateApplication);

// Add interview round
router.post("/:id/rounds", protect, addInterviewRound);

// Update interview round
router.put("/:id/rounds/:roundId", protect, updateInterviewRound);

// Delete interview round
router.delete("/:id/rounds/:roundId", protect, deleteInterviewRound);

// Delete application
router.delete("/:id", protect, deleteApplication);

export default router;
