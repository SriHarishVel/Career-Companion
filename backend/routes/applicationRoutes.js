import express from "express";
import {
    createApplication,
    getApplications,
    getApplication,
    updateApplication,
    deleteApplication,
    addInterviewRound,
    updateInterviewRound,
    deleteInterviewRound
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

// Add interview round
router.post("/:id/rounds", protect, addInterviewRound);

// Update interview round
router.put("/:id/rounds/:roundId", protect, updateInterviewRound);

// Delete interview round
router.delete("/:id/rounds/:roundId", protect, deleteInterviewRound);

// Delete application
router.delete("/:id", protect, deleteApplication);

export default router;