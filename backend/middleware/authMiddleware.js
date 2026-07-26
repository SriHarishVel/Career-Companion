import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
    try {
        // Get Authorization header
        const authHeader = req.headers.authorization;

        // Check if token exists
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Not authorized. No token provided.",
            });
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Store decoded data
        req.user = await User.findById(decoded.id).select("-password");

        // Continue to next middleware/controller
        next();
    } catch (error) {
        res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};

export default protect;