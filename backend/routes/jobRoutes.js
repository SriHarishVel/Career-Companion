import express from "express";
import {
    createJob,
    getJobs,
    getJob,
    updateJob,
    deleteJob,
} from "../controllers/jobController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createJob);

router.get("/", protect, getJobs);

router.get("/:id", protect, getJob);

router.put("/:id", protect, updateJob);

router.delete("/:id", protect, deleteJob);

export default router;