import Skill from "../models/Skill.js";
import Resource from "../models/Resource.js";
import Goal from "../models/Goal.js";

import { syncSkillProgress } from "../utils/syncSkillProgress.js";
import { syncSecondaryGoalProgress } from "../utils/syncSecondaryGoalProgress.js";
import { syncPrimaryGoalProgress } from "../utils/syncPrimaryGoalProgress.js";

export const createSkill = async (req, res) => {
  try {
    const {
      name,
      category,
      level,
      learningAreas,
      practicalRequirements,
      secondaryGoal,
    } = req.body;

    const skill = await Skill.create({
      name,
      category,
      level,
      learningAreas: Array.isArray(learningAreas) ? learningAreas : [],
      practicalRequirements: Array.isArray(practicalRequirements)
        ? practicalRequirements
        : [],
      secondaryGoal: secondaryGoal || null,
      user: req.user._id,
    });

    if (skill.secondaryGoal) {
      await syncRelatedGoalProgress(req.user._id, skill.secondaryGoal);
    }

    const populatedSkill = await Skill.findById(skill._id).populate(
      "secondaryGoal",
    );

    res.status(201).json(populatedSkill);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSkills = async (req, res) => {
  try {
    const query = {
      user: req.user._id,
    };

    if (req.query.search) {
      query.name = {
        $regex: req.query.search,
        $options: "i",
      };
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.level) {
      query.level = req.query.level;
    }

    if (req.query.secondaryGoal) {
      query.secondaryGoal = req.query.secondaryGoal;
    }

    let sortOption = {
      createdAt: -1,
    };

    if (req.query.sort === "az") {
      sortOption = {
        name: 1,
      };
    } else if (req.query.sort === "za") {
      sortOption = {
        name: -1,
      };
    } else if (req.query.sort === "progressHigh") {
      sortOption = {
        progress: -1,
      };
    } else if (req.query.sort === "progressLow") {
      sortOption = {
        progress: 1,
      };
    }

    const skills = await Skill.find(query)
      .populate("secondaryGoal")
      .sort(sortOption);

    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id).populate("secondaryGoal");

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    if (skill.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    res.status(200).json(skill);
  } catch (error) {
    console.error("Get skill error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    if (skill.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const previousSecondaryGoal = skill.secondaryGoal
      ? skill.secondaryGoal.toString()
      : null;

    skill.name = req.body.name ?? skill.name;
    skill.category = req.body.category ?? skill.category;
    skill.level = req.body.level ?? skill.level;

    if (Array.isArray(req.body.learningAreas)) {
      skill.learningAreas = req.body.learningAreas;
    }

    if (Array.isArray(req.body.practicalRequirements)) {
      skill.practicalRequirements = req.body.practicalRequirements;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "secondaryGoal")) {
      skill.secondaryGoal = req.body.secondaryGoal || null;
    }

    const resources = await Resource.find({
      skill: skill._id,
      user: req.user._id,
    });

    const syncedSkill = syncSkillProgress(skill.toObject(), resources);

    skill.progress = syncedSkill.progress;
    skill.developmentStatus = syncedSkill.developmentStatus;

    const updatedSkill = await skill.save();

    const currentSecondaryGoal = updatedSkill.secondaryGoal
      ? updatedSkill.secondaryGoal.toString()
      : null;

    const affectedGoals = [previousSecondaryGoal, currentSecondaryGoal].filter(
      (goalId, index, goalIds) => goalId && goalIds.indexOf(goalId) === index,
    );

    for (const goalId of affectedGoals) {
      await syncRelatedGoalProgress(req.user._id, goalId);
    }

    const populatedSkill = await Skill.findById(updatedSkill._id).populate(
      "secondaryGoal",
    );

    res.status(200).json(populatedSkill);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    if (skill.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const secondaryGoal = skill.secondaryGoal
      ? skill.secondaryGoal.toString()
      : null;

    await skill.deleteOne();

    if (secondaryGoal) {
      await syncRelatedGoalProgress(req.user._id, secondaryGoal);
    }

    res.status(200).json({
      message: "Skill deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

async function syncRelatedGoalProgress(userId, secondaryGoalId) {
  const [goals, skills] = await Promise.all([
    Goal.find({
      user: userId,
    }).populate("parentGoal", "title"),

    Skill.find({
      user: userId,
    }),
  ]);

  const goalObjects = goals.map((goal) => goal.toObject());

  const secondarySyncedGoals = syncSecondaryGoalProgress(goalObjects, skills);

  const syncedGoals = syncPrimaryGoalProgress(secondarySyncedGoals);

  const affectedGoalIds = new Set();

  const secondaryGoal = syncedGoals.find(
    (goal) => goal._id.toString() === secondaryGoalId.toString(),
  );

  if (secondaryGoal) {
    affectedGoalIds.add(secondaryGoal._id.toString());

    const parentGoalId = secondaryGoal.parentGoal?._id;

    if (parentGoalId) {
      affectedGoalIds.add(parentGoalId.toString());
    }
  }

  for (const goal of syncedGoals) {
    if (affectedGoalIds.has(goal._id.toString())) {
      await Goal.findByIdAndUpdate(goal._id, {
        progress: goal.progress,
        completed: goal.completed,
        lastUpdated: Date.now(),
      });
    }
  }
}
