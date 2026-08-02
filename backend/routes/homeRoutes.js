import express from "express";
import { getHome } from "../controllers/homeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getHome);

export default router;