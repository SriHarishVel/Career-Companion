import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Check if all fields are provided
        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "Please fill all fields",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};