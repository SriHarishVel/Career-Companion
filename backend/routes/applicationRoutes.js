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

router.use(protect);

/* Applications */

router.route("/").post(createApplication).get(getApplications);

router.route("/reminders").get(getFollowUpReminders);

/* Application Activities */

router
  .route("/:id/activities")
  .get(getApplicationActivities)
  .post(addApplicationActivity);

router
  .route("/:id/activities/:activityId")
  .put(updateApplicationActivity)
  .delete(deleteApplicationActivity);

router.route("/:id/activities/:activityId/status").patch(updateFollowUpStatus);

/* Interview Rounds */

router.route("/:id/rounds").post(addInterviewRound);

router
  .route("/:id/rounds/:roundId")
  .put(updateInterviewRound)
  .delete(deleteInterviewRound);

/* Individual Application */

router
  .route("/:id")
  .get(getApplication)
  .put(updateApplication)
  .delete(deleteApplication);

export default router;