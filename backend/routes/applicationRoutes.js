import express from "express";
import {
    createApplication,
    getApplications,
    getApplication,
    updateApplication,
    deleteApplication,
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

// Delete application
router.delete("/:id", protect, deleteApplication);

export default router;