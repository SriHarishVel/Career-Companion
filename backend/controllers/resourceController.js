import Resource from "../models/Resource.js";
import Skill from "../models/Skill.js";
import { syncSkillProgress } from "../utils/syncSkillProgress.js";

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

    if (createdResource.skill) {
      const skill = await Skill.findOne({
        _id: createdResource.skill,
        user: req.user._id,
      });

      if (skill) {
        const resources = await Resource.find({
          skill: skill._id,
          user: req.user._id,
        });

        const syncedSkill = syncSkillProgress(skill.toObject(), resources);

        skill.progress = syncedSkill.progress;

        skill.developmentStatus = syncedSkill.developmentStatus;

        await skill.save();
      }
    }

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

    if (req.query.search) {
      query.title = {
        $regex: req.query.search,
        $options: "i",
      };
    }

    if (req.query.type) {
      query.type = req.query.type;
    }

    if (req.query.favorite === "true") {
      query.favorite = true;
    }

    if (req.query.completed === "true") {
      query.completed = true;
    } else if (req.query.completed === "false") {
      query.completed = false;
    }

    if (req.query.skill) {
      query.skill = req.query.skill;
    }

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

    /* Store the previous skill before updating */

    const previousSkillId = resource.skill ? resource.skill.toString() : null;
    resource.title = req.body.title ?? resource.title;
    resource.type = req.body.type ?? resource.type;
    resource.url = req.body.url ?? resource.url;
    resource.description = req.body.description ?? resource.description;
    resource.favorite = req.body.favorite ?? resource.favorite;
    resource.completed = req.body.completed ?? resource.completed;
    resource.skill = req.body.skill ?? resource.skill;

    const updatedResource = await resource.save();

    /* Recalculate the previous skill */

    if (previousSkillId) {
      const previousSkill = await Skill.findOne({
        _id: previousSkillId,
        user: req.user._id,
      });

      if (previousSkill) {
        const previousResources = await Resource.find({
          skill: previousSkill._id,
          user: req.user._id,
        });

        const syncedPreviousSkill = syncSkillProgress(
          previousSkill.toObject(),
          previousResources,
        );

        previousSkill.progress = syncedPreviousSkill.progress;

        previousSkill.developmentStatus = syncedPreviousSkill.developmentStatus;

        await previousSkill.save();
      }
    }

    /* Recalculate the current skill */

    if (updatedResource.skill) {
      const currentSkill = await Skill.findOne({
        _id: updatedResource.skill,
        user: req.user._id,
      });

      if (currentSkill) {
        const currentResources = await Resource.find({
          skill: currentSkill._id,
          user: req.user._id,
        });

        const syncedCurrentSkill = syncSkillProgress(
          currentSkill.toObject(),
          currentResources,
        );

        currentSkill.progress = syncedCurrentSkill.progress;

        currentSkill.developmentStatus = syncedCurrentSkill.developmentStatus;

        await currentSkill.save();
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

    const skillId = resource.skill;

    await resource.deleteOne();

    /* Synchronize the related skill */

    if (skillId) {
      const skill = await Skill.findOne({
        _id: skillId,
        user: req.user._id,
      });

      if (skill) {
        const resources = await Resource.find({
          skill: skill._id,
          user: req.user._id,
        });

        const syncedSkill = syncSkillProgress(skill.toObject(), resources);

        skill.progress = syncedSkill.progress;

        skill.developmentStatus = syncedSkill.developmentStatus;

        await skill.save();
      }
    }

    res.status(200).json({
      message: "Resource deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
