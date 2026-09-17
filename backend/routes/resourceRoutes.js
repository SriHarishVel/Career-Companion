import express from "express";

import {
  createResource,
  getResources,
  getResource,
  updateResource,
  deleteResource,
  addResourceItem,
  updateResourceItem,
  deleteResourceItem,
} from "../controllers/resourceController.js";

import { protect } from "../middleware/authMiddleware.js";

import uploadResourceFile from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* Resource */

router.post("/", protect, createResource);

router.get("/", protect, getResources);

router.get("/:id", protect, getResource);

router.put("/:id", protect, updateResource);

router.delete("/:id", protect, deleteResource);

/* Resource Items */

router.post(
  "/:id/items",
  protect,
  uploadResourceFile.single("file"),
  addResourceItem,
);

router.put(
  "/:id/items/:itemId",
  protect,
  uploadResourceFile.single("file"),
  updateResourceItem,
);

router.delete("/:id/items/:itemId", protect, deleteResourceItem);

export default router;
