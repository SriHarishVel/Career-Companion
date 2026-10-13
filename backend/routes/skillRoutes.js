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

router.use(protect);

router.route("/").post(createSkill).get(getSkills);

router.route("/:id").get(getSkill).put(updateSkill).delete(deleteSkill);

export default router;