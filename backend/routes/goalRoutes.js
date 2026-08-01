import express from "express";
import {
    createGoal,
    getGoals,
    getGoal,
    updateGoal,
    deleteGoal,
} from "../controllers/goalController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createGoal);

router.get("/", protect, getGoals);

router.get("/:id", protect, getGoal);

router.put("/:id", protect, updateGoal);

router.delete("/:id", protect, deleteGoal);

export default router;