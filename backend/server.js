import dns from "node:dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/home", homeRoutes);

app.get("/", (req, res) => {
    res.send("Career Companion API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});