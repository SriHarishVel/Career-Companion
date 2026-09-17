import Resource from "../models/Resource.js";
import Skill from "../models/Skill.js";
import fs from "fs";
import path from "path";

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

/* CREATE RESOURCE */

export const createResource = async (req, res) => {
  try {
    const resource = new Resource({
      title: req.body.title,
      description: req.body.description,
      favorite: req.body.favorite ?? false,
      completed: req.body.completed ?? false,
      skill: req.body.skill || null,
      user: req.user._id,
      items: [],
    });

    const createdResource = await resource.save();

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

/* GET RESOURCES */

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

/* GET SINGLE RESOURCE */

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

/* UPDATE RESOURCE */

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

    resource.description = req.body.description ?? resource.description;

    resource.favorite = req.body.favorite ?? resource.favorite;

    resource.completed = req.body.completed ?? resource.completed;

    resource.skill =
      req.body.skill !== undefined ? req.body.skill || null : resource.skill;

    const updatedResource = await resource.save();

    /* Recalculate previous skill */

    if (previousSkillId) {
      await syncSkill(req.user._id, previousSkillId);
    }

    /* Recalculate current skill */

    if (updatedResource.skill) {
      const currentSkillId = updatedResource.skill.toString();

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

/* DELETE RESOURCE */

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

    /* Store uploaded filenames */

    const filenames = resource.items
      .filter((item) => item.source === "upload" && item.file?.filename)
      .map((item) => item.file.filename);

    await resource.deleteOne();

    /* Delete physical uploaded files */

    for (const filename of filenames) {
      const filePath = path.join(
        process.cwd(),
        "uploads",
        "resources",
        filename,
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

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

/* ADD RESOURCE ITEM */

export const addResourceItem = async (req, res) => {
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

    if (!req.body.title?.trim()) {
      return res.status(400).json({
        message: "Resource item title is required.",
      });
    }

    const source = req.file ? "upload" : "external";

    if (source === "external" && !req.body.url?.trim()) {
      return res.status(400).json({
        message: "Resource URL is required.",
      });
    }

    const item = {
      title: req.body.title.trim(),

      type: req.body.type || "Other",

      source,

      completed: false,
    };

    if (source === "external") {
      item.url = req.body.url.trim();
    }

    if (source === "upload") {
      item.file = {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        filename: req.file.filename,
      };
    }

    resource.items.push(item);

    const updatedResource = await resource.save();

    const populatedResource = await Resource.findById(
      updatedResource._id,
    ).populate("skill", "name level category");

    res.status(201).json(populatedResource);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* UPDATE RESOURCE ITEM */

export const updateResourceItem = async (req, res) => {
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

    const item = resource.items.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({
        message: "Resource item not found",
      });
    }

    const previousFilename = item.file?.filename;

    item.title = req.body.title ?? item.title;

    item.type = req.body.type ?? item.type;

    item.completed = req.body.completed ?? item.completed;

    /* Replace uploaded file */

    if (req.file) {
      item.source = "upload";
      item.url = undefined;

      item.file = {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        filename: req.file.filename,
      };
    } else if (req.body.url !== undefined) {
      item.source = "external";
      item.url = req.body.url || undefined;
      item.file = undefined;
    }

    const updatedResource = await resource.save();

    /* Delete previous physical file */

    if (req.file && previousFilename) {
      const previousFilePath = path.join(
        process.cwd(),
        "uploads",
        "resources",
        previousFilename,
      );

      if (fs.existsSync(previousFilePath)) {
        fs.unlinkSync(previousFilePath);
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

/* DELETE RESOURCE ITEM */

export const deleteResourceItem = async (req, res) => {
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

    const item = resource.items.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({
        message: "Resource item not found",
      });
    }

    const filename = item.file?.filename;

    item.deleteOne();

    await resource.save();

    /* Delete physical uploaded file */

    if (filename) {
      const filePath = path.join(
        process.cwd(),
        "uploads",
        "resources",
        filename,
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const populatedResource = await Resource.findById(resource._id).populate(
      "skill",
      "name level category",
    );

    res.status(200).json(populatedResource);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};