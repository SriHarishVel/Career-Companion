import express from "express";

import {
  createSkillEvidence,
  getSkillEvidence,
  updateSkillEvidence,
  deleteSkillEvidence,
} from "../controllers/skillEvidenceController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createSkillEvidence);

router.get("/skill/:skillId", getSkillEvidence);

router.put("/:id", updateSkillEvidence);

router.delete("/:id", deleteSkillEvidence);

export default router;
