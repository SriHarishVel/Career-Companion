import Skill from "../models/Skill.js";

export const createSkill = async (req, res) => {
  try {
    const { name, category, level, progress, secondaryGoal } = req.body;

    const skill = await Skill.create({
      name,
      category,
      level,
      progress,
      secondaryGoal,
      user: req.user._id,
    });

    res.status(201).json(skill);
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

    skill.name = req.body.name ?? skill.name;

    skill.category = req.body.category ?? skill.category;

    skill.level = req.body.level ?? skill.level;

    skill.progress = req.body.progress ?? skill.progress;

    if (Object.prototype.hasOwnProperty.call(req.body, "secondaryGoal")) {
      skill.secondaryGoal = req.body.secondaryGoal;
    }

    const updatedSkill = await skill.save();

    res.status(200).json(updatedSkill);
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
