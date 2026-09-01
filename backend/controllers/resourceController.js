import Resource from "../models/Resource.js";
import Skill from "../models/Skill.js";

import { syncSkillProgress } from "../utils/syncSkillProgress.js";

/* Synchronize a Skill with its Resources */

async function syncSkill(userId, skillId) {
  if (!skillId) {
    return;
  }

  const skill = await Skill.findOne({
    _id: skillId,
    user: userId,
  });

  if (!skill) {
    return;
  }

  const resources = await Resource.find({
    skill: skill._id,
    user: userId,
  });

  const syncedSkill = syncSkillProgress(skill.toObject(), resources);

  skill.progress = syncedSkill.progress;
  skill.developmentStatus = syncedSkill.developmentStatus;

  await skill.save();
}

export const createResource = async (req, res) => {
  try {
    const resource = new Resource({
      title: req.body.title,
      type: req.body.type,
      url: req.body.url,
      description: req.body.description,
      favorite: req.body.favorite ?? false,
      completed: req.body.completed ?? false,
      skill: req.body.skill || null,
      user: req.user._id,
    });

    const createdResource = await resource.save();

    /* Synchronize related skill */

    await syncSkill(req.user._id, createdResource.skill);

    const populatedResource = await Resource.findById(
      createdResource._id,
    ).populate("skill", "name level category");

    res.status(201).json(populatedResource);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getResources = async (req, res) => {
  try {
    const query = {
      user: req.user._id,
    };

    /* Search */

    if (req.query.search) {
      query.title = {
        $regex: req.query.search,
        $options: "i",
      };
    }

    /* Type filter */

    if (req.query.type) {
      query.type = req.query.type;
    }

    /* Favorite filter */

    if (req.query.favorite === "true") {
      query.favorite = true;
    }

    /* Completion filter */

    if (req.query.completed === "true") {
      query.completed = true;
    } else if (req.query.completed === "false") {
      query.completed = false;
    }

    /* Skill filter */

    if (req.query.skill) {
      query.skill = req.query.skill;
    }

    /* Sorting */

    let sortOption = {
      createdAt: -1,
    };

    if (req.query.sort === "az") {
      sortOption = {
        title: 1,
      };
    } else if (req.query.sort === "za") {
      sortOption = {
        title: -1,
      };
    } else if (req.query.sort === "oldest") {
      sortOption = {
        createdAt: 1,
      };
    }

    const resources = await Resource.find(query)
      .populate("skill", "name level category")
      .sort(sortOption);

    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate(
      "skill",
      "name level category",
    );

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    if (resource.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    if (resource.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    /* Store previous skill */

    const previousSkillId = resource.skill ? resource.skill.toString() : null;

    /* Update resource */

    resource.title = req.body.title ?? resource.title;

    resource.type = req.body.type ?? resource.type;

    resource.url = req.body.url ?? resource.url;

    resource.description = req.body.description ?? resource.description;

    resource.favorite = req.body.favorite ?? resource.favorite;

    resource.completed = req.body.completed ?? resource.completed;

    resource.skill = req.body.skill ?? resource.skill;

    const updatedResource = await resource.save();

    /* Recalculate previous skill */

    if (previousSkillId) {
      await syncSkill(req.user._id, previousSkillId);
    }

    /* Recalculate current skill */

    if (updatedResource.skill) {
      const currentSkillId = updatedResource.skill.toString();

      /*
       * If the resource moved to another skill,
       * recalculate the new skill as well.
       */

      if (currentSkillId !== previousSkillId) {
        await syncSkill(req.user._id, currentSkillId);
      }
    }

    const populatedResource = await Resource.findById(
      updatedResource._id,
    ).populate("skill", "name level category");

    res.status(200).json(populatedResource);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    if (resource.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const skillId = resource.skill ? resource.skill.toString() : null;

    await resource.deleteOne();

    /* Synchronize related skill */

    await syncSkill(req.user._id, skillId);

    res.status(200).json({
      message: "Resource deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
