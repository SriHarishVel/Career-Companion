import bcrypt from "bcrypt";
import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-resetPasswordToken -resetPasswordExpires",
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      hasPassword: Boolean(user.password),
      hasGoogleLogin: Boolean(user.googleId),
    });
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
      const normalizedEmail = email.trim().toLowerCase();

      if (normalizedEmail !== user.email) {
        const existingUser = await User.findOne({
          email: normalizedEmail,
          _id: { $ne: user._id },
        });

        if (existingUser) {
          return res.status(400).json({
            message: "Email is already in use.",
          });
        }

        user.email = normalizedEmail;
      }
    }

    await user.save();

    res.status(200).json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      hasPassword: Boolean(user.password),
      hasGoogleLogin: Boolean(user.googleId),
    });
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

    if (!newPassword) {
      return res.status(400).json({
        message: "New password is required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters.",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const hasPassword = Boolean(user.password);

    if (hasPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          message: "Current password is required.",
        });
      }

      if (currentPassword === newPassword) {
        return res.status(400).json({
          message: "New password must be different from the current password.",
        });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({
          message: "Current password is incorrect.",
        });
      }
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.status(200).json({
      message: hasPassword
        ? "Password updated successfully."
        : "Password set successfully.",
    });
  } catch (error) {
    console.error("Failed to change password:", error);

    res.status(500).json({
      message: "Unable to change password.",
    });
  }
};