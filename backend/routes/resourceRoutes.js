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

router.use(protect);

/* Resource */

router.route("/").post(createResource).get(getResources);

router
  .route("/:id")
  .get(getResource)
  .put(updateResource)
  .delete(deleteResource);

/* Resource Items */

router
  .route("/:id/items")
  .post(uploadResourceFile.single("file"), addResourceItem);

router
  .route("/:id/items/:itemId")
  .put(uploadResourceFile.single("file"), updateResourceItem)
  .delete(deleteResourceItem);

export default router;