import mongoose from "mongoose";

import TargetRole from "../models/TargetRole.js";
import Skill from "../models/Skill.js";

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
      !requirement ||
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

/* Create Target Role */

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
      return res.status(400).json({
        message: validationError,
      });
    }

    const targetRole = await TargetRole.create({
      title: title.trim(),
      description: description.trim(),
      requirements,
      user: req.user._id,
    });

    return res.status(201).json(targetRole);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/* Get All Target Roles */

export const getTargetRoles = async (req, res) => {
  try {
    const targetRoles = await TargetRole.find({
      user: req.user._id,
    }).sort({ updatedAt: -1 });

    return res.status(200).json(targetRoles);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/* Get Single Target Role */

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

    return res.status(200).json(targetRole);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/* Update Target Role */

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
        return res.status(400).json({
          message: validationError,
        });
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

    return res.status(200).json(targetRole);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/* Delete Target Role */

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

    return res.status(200).json({
      message: "Target role deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/* Get Target Role Readiness */

export const getTargetRoleReadiness = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid target role ID.",
      });
    }

    const targetRole = await TargetRole.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!targetRole) {
      return res.status(404).json({
        message: "Target role not found.",
      });
    }

    const skills = await Skill.find({
      user: req.user._id,
    }).select("name level progress category");

    const proficiencyLevels = {
      Beginner: 1,
      Intermediate: 2,
      Advanced: 3,
    };

    const importanceWeights = {
      High: 3,
      Medium: 2,
      Low: 1,
    };

    const skillLookup = new Map(
      skills.map((skill) => [skill.name.trim().toLowerCase(), skill]),
    );

    let totalWeight = 0;
    let achievedWeight = 0;

    const requirements = targetRole.requirements.map((requirement) => {
      const weight = importanceWeights[requirement.importance] ?? 2;

      const skill = skillLookup.get(requirement.skillName.trim().toLowerCase());

      const requiredLevel = proficiencyLevels[requirement.requiredLevel] ?? 2;

      const currentLevel = skill ? (proficiencyLevels[skill.level] ?? 0) : 0;

      const met = Boolean(skill) && currentLevel >= requiredLevel;

      totalWeight += weight;

      if (met) {
        achievedWeight += weight;
      }

      return {
        skillName: requirement.skillName,
        category: requirement.category,
        importance: requirement.importance,
        requiredLevel: requirement.requiredLevel,
        currentLevel: skill?.level ?? null,
        progress: skill?.progress ?? 0,
        skillId: skill?._id ?? null,
        status: !skill ? "Missing" : met ? "Met" : "Below Required Level",
        met,
        weight,
      };
    });

    const gaps = requirements
      .filter((requirement) => !requirement.met)
      .sort((a, b) => {
        if (b.weight !== a.weight) {
          return b.weight - a.weight;
        }

        return a.skillName.localeCompare(b.skillName);
      });

    const matchedSkills = requirements.filter((requirement) => requirement.met);

    const readinessScore =
      totalWeight === 0
        ? null
        : Math.round((achievedWeight / totalWeight) * 100);

    return res.status(200).json({
      targetRole: {
        _id: targetRole._id,
        title: targetRole.title,
        description: targetRole.description,
      },
      readinessScore,
      summary: {
        totalRequirements: requirements.length,
        metRequirements: matchedSkills.length,
        gapCount: gaps.length,
        totalWeight,
        achievedWeight,
      },
      requirements,
      matchedSkills,
      gaps,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};