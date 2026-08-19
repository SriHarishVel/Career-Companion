import Goal from "../models/Goal.js";

import { syncPrimaryGoalProgress } from "../utils/syncPrimaryGoalProgress.js";

export const createGoal = async (req, res) => {
  try {
    const {
      title,
      category,
      priority,
      goalType,
      parentGoal,
      progress,
      completed,
      deadline,
    } = req.body;

    // Secondary goals must have a parent
    if (goalType === "Secondary" && !parentGoal) {
      return res.status(400).json({
        message: "Secondary goal requires a parent goal.",
      });
    }

    const goal = await Goal.create({
      title,
      category,
      priority,
      goalType,
      parentGoal: goalType === "Secondary" ? parentGoal : null,
      progress,
      completed,
      deadline,
      lastUpdated: Date.now(),
      user: req.user._id,
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getGoals = async (req, res) => {
  try {
    const query = {
      user: req.user._id,
    };

    // Fetch all goals first.
    // Primary progress depends on its Secondary goals.
    const goals = await Goal.find(query).populate("parentGoal", "title");

    // Calculate derived Primary goal progress.
    const syncedGoals = syncPrimaryGoalProgress(
      goals.map((goal) => goal.toObject()),
    );

    let filteredGoals = syncedGoals;

    // Search
    if (req.query.search) {
      const search = req.query.search.toLowerCase();

      filteredGoals = filteredGoals.filter((goal) =>
        goal.title.toLowerCase().includes(search),
      );
    }

    // Category filter
    if (req.query.category) {
      filteredGoals = filteredGoals.filter(
        (goal) => goal.category === req.query.category,
      );
    }

    // Priority filter
    if (req.query.priority) {
      filteredGoals = filteredGoals.filter(
        (goal) => goal.priority === req.query.priority,
      );
    }

    // Status filter
    if (req.query.status === "Completed") {
      filteredGoals = filteredGoals.filter((goal) => goal.completed === true);
    } else if (req.query.status === "Active") {
      filteredGoals = filteredGoals.filter((goal) => goal.completed === false);
    }

    // Goal Type filter
    if (req.query.goalType) {
      filteredGoals = filteredGoals.filter(
        (goal) => goal.goalType === req.query.goalType,
      );
    }

    // Sorting
    const sort = req.query.sort;

    if (sort === "az") {
      filteredGoals.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "za") {
      filteredGoals.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sort === "high") {
      filteredGoals.sort((a, b) => b.progress - a.progress);
    } else if (sort === "low") {
      filteredGoals.sort((a, b) => a.progress - b.progress);
    } else if (sort === "recent") {
      filteredGoals.sort(
        (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated),
      );
    } else if (sort === "priorityHigh") {
      const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3,
      };

      filteredGoals.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
      );
    } else if (sort === "priorityLow") {
      const priorityOrder = {
        Low: 1,
        Medium: 2,
        High: 3,
      };

      filteredGoals.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
      );
    } else {
      // Default: newest first
      filteredGoals.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    }

    res.status(200).json(filteredGoals);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id).populate(
      "parentGoal",
      "title",
    );

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    goal.title = req.body.title ?? goal.title;
    goal.category = req.body.category ?? goal.category;
    goal.priority = req.body.priority ?? goal.priority;
    goal.goalType = req.body.goalType ?? goal.goalType;
    goal.parentGoal = req.body.parentGoal ?? goal.parentGoal;
    goal.progress = req.body.progress ?? goal.progress;
    goal.completed = req.body.completed ?? goal.completed;
    goal.deadline = req.body.deadline ?? goal.deadline;

    goal.lastUpdated = Date.now();

    const updatedGoal = await goal.save();

    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    // If deleting a primary goal, delete all its secondary goals
    if (goal.goalType === "Primary") {
      await Goal.deleteMany({
        parentGoal: goal._id,
        user: req.user._id,
      });
    }

    await goal.deleteOne();

    res.status(200).json({
      message: "Goal deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
