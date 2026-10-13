import express from "express";

import {
  createTargetRole,
  getTargetRoles,
  getTargetRole,
  updateTargetRole,
  deleteTargetRole,
  getTargetRoleReadiness,
} from "../controllers/targetRoleController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createTargetRole).get(getTargetRoles);

router.route("/:id/readiness").get(getTargetRoleReadiness);

router
  .route("/:id")
  .get(getTargetRole)
  .put(updateTargetRole)
  .delete(deleteTargetRole);

export default router;