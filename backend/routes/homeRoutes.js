import express from "express";

import { getHome } from "../controllers/homeController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getHome);

export default router;