import bcrypt from "bcrypt";
import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Failed to get profile:", error);

    res.status(500).json({
      message: "Unable to load profile.",
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

    if (fullName?.trim()) {
      user.fullName = fullName.trim();
    }

    if (email?.trim()) {
      user.email = email.trim().toLowerCase();
    }

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Failed to update profile:", error);

    res.status(500).json({
      message: "Unable to update profile.",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input before touching bcrypt.
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Please fill all password fields.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters.",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different from the current password.",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.status(200).json({
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Failed to change password:", error);

    res.status(500).json({
      message: "Unable to change password.",
    });
  }
};
