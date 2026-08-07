import bcrypt from "bcrypt";
import User from "../models/User.js";

export const getProfile = async (req, res) => {
    try {

        const user = await User.findById(
            req.user._id
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json(user);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

export const updateProfile = async (req, res) => {
    try {

        const { fullName, email } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;

        await user.save();

        res.status(200).json(user);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

export const changePassword = async (req, res) => {
    try {

        const {
            currentPassword,
            newPassword,
        } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Current password is incorrect",
            });
        }

        if (
            !currentPassword ||
            !newPassword
        ) {
            return res.status(400).json({
                message: "Please fill all fields",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message:
                    "Password must be at least 6 characters",
            });
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({
                message:
                    "New password must be different from the current password",
            });
        }

        user.password = await bcrypt.hash(
            newPassword,
            10
        );

        await user.save();

        res.status(200).json({
            message: "Password updated successfully",
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};