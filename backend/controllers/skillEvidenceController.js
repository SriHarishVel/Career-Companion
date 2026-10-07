import SkillEvidence from "../models/SkillEvidence.js";
import Skill from "../models/Skill.js";
import Resource from "../models/Resource.js";

export const createSkillEvidence = async (req, res) => {
  try {
    const {
      skill,
      title,
      description,
      type,
      date,
      relatedResource,
      relatedRequirement,
      link,
    } = req.body;

    /* Validate Skill */

    const skillExists = await Skill.findOne({
      _id: skill,
      user: req.user._id,
    });

    if (!skillExists) {
      return res.status(400).json({
        message: "Invalid skill.",
      });
    }

    /* Validate Related Resource */

    if (relatedResource) {
      const resourceExists = await Resource.findOne({
        _id: relatedResource,
        user: req.user._id,
      });

      if (!resourceExists) {
        return res.status(400).json({
          message: "Invalid related resource.",
        });
      }

      if (
        resourceExists.skill &&
        resourceExists.skill.toString() !== skill.toString()
      ) {
        return res.status(400).json({
          message: "Resource is not linked to this skill.",
        });
      }
    }

    const evidence = await SkillEvidence.create({
      user: req.user._id,
      skill,
      title,
      description,
      type,
      date,
      relatedResource: relatedResource || null,
      relatedRequirement: relatedRequirement || "",
      link: link || "",
    });

    const populatedEvidence = await SkillEvidence.findById(evidence._id)
      .populate("skill", "name")
      .populate("relatedResource", "title");

    res.status(201).json(populatedEvidence);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSkillEvidence = async (req, res) => {
  try {
    const skill = await Skill.findOne({
      _id: req.params.skillId,
      user: req.user._id,
    });

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    const evidence = await SkillEvidence.find({
      skill: skill._id,
      user: req.user._id,
    })
      .populate("skill", "name")
      .populate("relatedResource", "title")
      .sort({
        date: -1,
        createdAt: -1,
      });

    res.status(200).json(evidence);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateSkillEvidence = async (req, res) => {
  try {
    const evidence = await SkillEvidence.findById(req.params.id);

    if (!evidence) {
      return res.status(404).json({
        message: "Evidence not found",
      });
    }

    if (evidence.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    if (req.body.skill) {
      const skill = await Skill.findOne({
        _id: req.body.skill,
        user: req.user._id,
      });

      if (!skill) {
        return res.status(400).json({
          message: "Invalid skill.",
        });
      }

      evidence.skill = req.body.skill;
    }

    if (req.body.relatedResource) {
      const resource = await Resource.findOne({
        _id: req.body.relatedResource,
        user: req.user._id,
      });

      if (!resource) {
        return res.status(400).json({
          message: "Invalid related resource.",
        });
      }

      const evidenceSkillId = evidence.skill.toString();

      if (resource.skill && resource.skill.toString() !== evidenceSkillId) {
        return res.status(400).json({
          message: "Resource is not linked to this skill.",
        });
      }

      evidence.relatedResource = req.body.relatedResource;
    } else if (
      Object.prototype.hasOwnProperty.call(req.body, "relatedResource")
    ) {
      evidence.relatedResource = null;
    }

    evidence.title = req.body.title ?? evidence.title;
    evidence.description = req.body.description ?? evidence.description;
    evidence.type = req.body.type ?? evidence.type;
    evidence.date = req.body.date ?? evidence.date;
    evidence.relatedRequirement =
      req.body.relatedRequirement ?? evidence.relatedRequirement;
    evidence.link = req.body.link ?? evidence.link;

    const updatedEvidence = await evidence.save();

    const populatedEvidence = await SkillEvidence.findById(updatedEvidence._id)
      .populate("skill", "name")
      .populate("relatedResource", "title");

    res.status(200).json(populatedEvidence);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteSkillEvidence = async (req, res) => {
  try {
    const evidence = await SkillEvidence.findById(req.params.id);

    if (!evidence) {
      return res.status(404).json({
        message: "Evidence not found",
      });
    }

    if (evidence.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await evidence.deleteOne();

    res.status(200).json({
      message: "Evidence deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};