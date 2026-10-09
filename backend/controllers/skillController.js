import Skill from "../models/Skill.js";
import Resource from "../models/Resource.js";
import Goal from "../models/Goal.js";

import { syncSkillProgress } from "../utils/syncSkillProgress.js";
import { syncAndSaveSkillProgress } from "../utils/syncAndSaveSkillProgress.js";

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

    /* Validate Secondary Goal */

    if (secondaryGoal) {
      const goal = await Goal.findOne({
        _id: secondaryGoal,
        user: req.user._id,
        goalType: "Secondary",
      });

      if (!goal) {
        return res.status(400).json({
          message: "Invalid secondary goal.",
        });
      }
    }

    const skillData = {
      name,
      category,
      level,
      learningAreas: Array.isArray(learningAreas) ? learningAreas : [],
      practicalRequirements: Array.isArray(practicalRequirements)
        ? practicalRequirements
        : [],
      secondaryGoal: secondaryGoal || null,
      user: req.user._id,
    };

    const syncedSkill = syncSkillProgress(skillData, []);

    const skill = await Skill.create({
      ...skillData,
      progress: syncedSkill.progress,
      developmentStatus: syncedSkill.developmentStatus,
    });

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

    /* Search */

    if (req.query.search) {
      query.name = {
        $regex: req.query.search,
        $options: "i",
      };
    }

    /* Category filter */

    if (req.query.category) {
      query.category = req.query.category;
    }

    /* Level filter */

    if (req.query.level) {
      query.level = req.query.level;
    }

    /* Related goal filter */

    if (req.query.secondaryGoal) {
      query.secondaryGoal = req.query.secondaryGoal;
    }

    const [skills, resources] = await Promise.all([
      Skill.find(query).populate("secondaryGoal"),
      Resource.find({
        user: req.user._id,
      }),
    ]);

    const skillObjects = skills.map((skill) => skill.toObject());

    /* Calculate current Skill progress */

    const syncedSkills = skillObjects.map((skill) => {
      const skillResources = resources.filter(
        (resource) =>
          resource.skill && resource.skill.toString() === skill._id.toString(),
      );

      return syncSkillProgress(skill, skillResources);
    });

    /* Sorting */

    const sort = req.query.sort;

    if (sort === "az") {
      syncedSkills.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "za") {
      syncedSkills.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === "progressHigh") {
      syncedSkills.sort((a, b) => b.progress - a.progress);
    } else if (sort === "progressLow") {
      syncedSkills.sort((a, b) => a.progress - b.progress);
    } else if (sort === "recent") {
      syncedSkills.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
      );
    } else {
      /* Default: newest first */

      syncedSkills.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    }

    res.status(200).json(syncedSkills);
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

    const resources = await Resource.find({
      skill: skill._id,
      user: req.user._id,
    });

    const syncedSkill = syncSkillProgress(skill.toObject(), resources);

    res.status(200).json(syncedSkill);
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

    /* Capture progress change context */

    let changeContext = {
      action: "Skill updated",
      itemName: "",
      details: "Skill details updated",
    };

    const previousLearningAreas = skill.learningAreas.map((area) => ({
      name: area.name,
      completed: area.completed,
    }));

    const previousPracticalRequirements =
      skill.practicalRequirements.map((requirement) => ({
        title: requirement.title,
        completed: requirement.completed,
      }));

    skill.name = req.body.name ?? skill.name;
    skill.category = req.body.category ?? skill.category;
    skill.level = req.body.level ?? skill.level;

    if (Array.isArray(req.body.learningAreas)) {
      const nextLearningAreas = req.body.learningAreas;

      const changedArea = nextLearningAreas.find((area, index) => {
        const previous = previousLearningAreas[index];

        return (
          previous &&
          previous.completed !== area.completed
        );
      });

      const addedArea =
        nextLearningAreas.length > previousLearningAreas.length
          ? nextLearningAreas[previousLearningAreas.length]
          : null;

      if (changedArea) {
        changeContext = {
          action: changedArea.completed
            ? "Learning area completed"
            : "Learning area reopened",
          itemName: changedArea.name,
          details: changedArea.completed
            ? "Marked as covered"
            : "Marked as not covered",
        };
      } else if (addedArea) {
        changeContext = {
          action: "Learning area added",
          itemName: addedArea.name,
          details: "A new learning area was added",
        };
      }

      skill.learningAreas = nextLearningAreas;
    }

    if (Array.isArray(req.body.practicalRequirements)) {
      const nextRequirements = req.body.practicalRequirements;

      const changedRequirement = nextRequirements.find(
        (requirement, index) => {
          const previous = previousPracticalRequirements[index];

          return (
            previous &&
            previous.completed !== requirement.completed
          );
        },
      );

      const addedRequirement =
        nextRequirements.length >
        previousPracticalRequirements.length
          ? nextRequirements[previousPracticalRequirements.length]
          : null;

      if (changedRequirement) {
        changeContext = {
          action: changedRequirement.completed
            ? "Practical requirement completed"
            : "Practical requirement reopened",
          itemName: changedRequirement.title,
          details: changedRequirement.completed
            ? "Marked as completed"
            : "Marked as not completed",
        };
      } else if (addedRequirement) {
        changeContext = {
          action: "Practical requirement added",
          itemName: addedRequirement.title,
          details: "A new practical requirement was added",
        };
      }

      skill.practicalRequirements = nextRequirements;
    }

    /* Validate Secondary Goal when changed */

    if (
      Object.prototype.hasOwnProperty.call(
        req.body,
        "secondaryGoal",
      )
    ) {
      const secondaryGoal = req.body.secondaryGoal || null;

      if (secondaryGoal) {
        const goal = await Goal.findOne({
          _id: secondaryGoal,
          user: req.user._id,
          goalType: "Secondary",
        });

        if (!goal) {
          return res.status(400).json({
            message: "Invalid secondary goal.",
          });
        }
      }

      skill.secondaryGoal = secondaryGoal;
    }

    await skill.save();

    const syncedSkill = await syncAndSaveSkillProgress(
      req.user._id,
      skill._id,
      changeContext,
    );

    const populatedSkill = await Skill.findById(
      syncedSkill._id,
    ).populate("secondaryGoal");

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

    await skill.deleteOne();

    res.status(200).json({
      message: "Skill deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};