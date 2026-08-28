import Resource from "../models/Resource.js";
import Skill from "../models/Skill.js";

export const createResource = async (req, res) => {
  try {
    const { title, type, url, description, favorite, completed, skill } =
      req.body;

    if (skill) {
      const relatedSkill = await Skill.findOne({
        _id: skill,
        user: req.user._id,
      });

      if (!relatedSkill) {
        return res.status(400).json({
          message: "Invalid related skill.",
        });
      }
    }

    const resource = await Resource.create({
      title,
      type,
      url,
      description,
      favorite,
      completed,
      skill: skill || null,
      user: req.user._id,
    });

    const populatedResource = await Resource.findById(resource._id).populate(
      "skill",
      "name level category",
    );

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

    resource.title = req.body.title ?? resource.title;

    resource.type = req.body.type ?? resource.type;

    resource.url = req.body.url ?? resource.url;

    resource.description = req.body.description ?? resource.description;

    resource.favorite = req.body.favorite ?? resource.favorite;

    resource.completed = req.body.completed ?? resource.completed;

    if (Object.prototype.hasOwnProperty.call(req.body, "skill")) {
      if (req.body.skill) {
        const relatedSkill = await Skill.findOne({
          _id: req.body.skill,
          user: req.user._id,
        });

        if (!relatedSkill) {
          return res.status(400).json({
            message: "Invalid related skill.",
          });
        }
      }

      resource.skill = req.body.skill || null;
    }
    const updatedResource = await resource.save();

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

    await resource.deleteOne();

    res.status(200).json({
      message: "Resource deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
