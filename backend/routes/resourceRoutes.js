import express from "express";
import {
    createResource,
    getResources,
    getResource,
    updateResource,
    deleteResource,
} from "../controllers/resourceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createResource);

router.get("/", protect, getResources);

router.get("/:id", protect, getResource);

router.put("/:id", protect, updateResource);

router.delete("/:id", protect, deleteResource);

export default router;