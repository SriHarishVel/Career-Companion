import express from "express";
import {
    createApplication,
    getApplications,
    getApplication,
    updateApplication,
    deleteApplication,
    addInterviewRound,
    updateInterviewRound
} from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create application
router.post("/", protect, createApplication);

// Get all applications
router.get("/", protect, getApplications);

// Get one application
router.get("/:id", protect, getApplication);

// Update application
router.put("/:id", protect, updateApplication);

router.post("/:id/rounds", protect, addInterviewRound);

router.put("/:id/rounds/:roundId", protect, updateInterviewRound);
// Delete application
router.delete("/:id", protect, deleteApplication);

export default router;