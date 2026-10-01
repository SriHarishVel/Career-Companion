import express from "express";

import {
  createApplication,
  getApplications,
  getApplication,
  getApplicationActivities,
  getFollowUpReminders,
  addApplicationActivity,
  updateApplicationActivity,
  updateFollowUpStatus,
  deleteApplicationActivity,
  updateApplication,
  deleteApplication,
  addInterviewRound,
  updateInterviewRound,
  deleteInterviewRound,
} from "../controllers/applicationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createApplication);

router.get("/", protect, getApplications);

router.get("/:id/activities", protect, getApplicationActivities);

router.get("/reminders", protect, getFollowUpReminders);

router.post("/:id/activities", protect, addApplicationActivity);

router.put("/:id/activities/:activityId", protect, updateApplicationActivity);

router.patch(
  "/:id/activities/:activityId/status",
  protect,
  updateFollowUpStatus,
);

router.delete(
  "/:id/activities/:activityId",
  protect,
  deleteApplicationActivity,
);

router.get("/:id", protect, getApplication);

router.put("/:id", protect, updateApplication);

router.post("/:id/rounds", protect, addInterviewRound);

router.put("/:id/rounds/:roundId", protect, updateInterviewRound);

router.delete("/:id/rounds/:roundId", protect, deleteInterviewRound);

router.delete("/:id", protect, deleteApplication);

export default router;
