import express from "express";
import {
    createSkill,
    getSkills,
    getSkill,
    updateSkill,
    deleteSkill,
} from "../controllers/skillController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createSkill);

router.get("/", protect, getSkills);

router.get("/:id", protect, getSkill);

router.put("/:id", protect, updateSkill);

router.delete("/:id", protect, deleteSkill);

export default router;