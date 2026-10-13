import mongoose from "mongoose";
import TargetRole from "../models/TargetRole.js";

const validCategories = [
  "Programming",
  "Database",
  "Framework",
  "Tools",
  "Soft Skills",
  "Other",
];

const validLevels = ["Beginner", "Intermediate", "Advanced"];
const validImportance = ["High", "Medium", "Low"];

function validateRequirements(requirements) {
  if (!Array.isArray(requirements)) {
    return "Requirements must be an array.";
  }

  for (const requirement of requirements) {
    if (
      !requirement.skillName ||
      typeof requirement.skillName !== "string" ||
      !requirement.skillName.trim()
    ) {
      return "Every requirement must have a skill name.";
    }

    if (
      requirement.category &&
      !validCategories.includes(requirement.category)
    ) {
      return `Invalid skill category: ${requirement.category}`;
    }

    if (
      requirement.requiredLevel &&
      !validLevels.includes(requirement.requiredLevel)
    ) {
      return `Invalid required level: ${requirement.requiredLevel}`;
    }

    if (
      requirement.importance &&
      !validImportance.includes(requirement.importance)
    ) {
      return `Invalid importance: ${requirement.importance}`;
    }
  }

  const names = requirements.map((item) => item.skillName.trim().toLowerCase());

  if (new Set(names).size !== names.length) {
    return "A skill can only be added once per target role.";
  }

  return null;
}

export const createTargetRole = async (req, res) => {
  try {
    const { title, description = "", requirements = [] } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Target role title is required.",
      });
    }

    if (typeof description !== "string" || !Array.isArray(requirements)) {
      return res.status(400).json({
        message: "Invalid target role data.",
      });
    }

    const validationError = validateRequirements(requirements);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const targetRole = await TargetRole.create({
      title: title.trim(),
      description: description.trim(),
      requirements,
      user: req.user._id,
    });

    res.status(201).json(targetRole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTargetRoles = async (req, res) => {
  try {
    const targetRoles = await TargetRole.find({
      user: req.user._id,
    }).sort({ updatedAt: -1 });

    res.status(200).json(targetRoles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTargetRole = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid target role ID.",
      });
    }

    const targetRole = await TargetRole.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!targetRole) {
      return res.status(404).json({
        message: "Target role not found.",
      });
    }

    res.status(200).json(targetRole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTargetRole = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid target role ID.",
      });
    }

    const targetRole = await TargetRole.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!targetRole) {
      return res.status(404).json({
        message: "Target role not found.",
      });
    }

    const { title, description, requirements } = req.body;

    if (title !== undefined && (typeof title !== "string" || !title.trim())) {
      return res.status(400).json({
        message: "Target role title cannot be empty.",
      });
    }

    if (description !== undefined && typeof description !== "string") {
      return res.status(400).json({
        message: "Description must be a string.",
      });
    }

    if (requirements !== undefined) {
      const validationError = validateRequirements(requirements);

      if (validationError) {
        return res.status(400).json({ message: validationError });
      }

      targetRole.requirements = requirements;
    }

    if (title !== undefined) {
      targetRole.title = title.trim();
    }

    if (description !== undefined) {
      targetRole.description = description.trim();
    }

    await targetRole.save();

    res.status(200).json(targetRole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTargetRole = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid target role ID.",
      });
    }

    const targetRole = await TargetRole.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!targetRole) {
      return res.status(404).json({
        message: "Target role not found.",
      });
    }

    await targetRole.deleteOne();

    res.status(200).json({
      message: "Target role deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};