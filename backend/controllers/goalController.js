import Goal from "../models/Goal.js";

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
        if (
            goalType === "Secondary" &&
            !parentGoal
        ) {
            return res.status(400).json({
                message: "Secondary goal requires a parent goal.",
            });
        }

        const goal = await Goal.create({
            title,
            category,
            priority,
            goalType,
            parentGoal:
                goalType === "Secondary"
                    ? parentGoal
                    : null,
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

        // Search
        if (req.query.search) {
            query.title = {
                $regex: req.query.search,
                $options: "i",
            };
        }

        // Category filter
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Priority filter
        if (req.query.priority) {
            query.priority = req.query.priority;
        }

        // Goal Type filter
        if (req.query.goalType) {
            query.goalType = req.query.goalType;
        }

        // Status filter
        if (req.query.status === "Completed") {
            query.completed = true;
        } else if (req.query.status === "Active") {
            query.completed = false;
        }

        let sortOption = {
            createdAt: -1,
        };

        const sort = req.query.sort;

        if (sort === "az") {
            sortOption = {
                title: 1,
            };
        } else if (sort === "za") {
            sortOption = {
                title: -1,
            };
        } else if (sort === "high") {
            sortOption = {
                progress: -1,
            };
        } else if (sort === "low") {
            sortOption = {
                progress: 1,
            };
        } else if (sort === "recent") {
            sortOption = {
                lastUpdated: -1,
            };
        } else if (sort === "priorityHigh") {
            sortOption = {
                priority: 1,
            };
        } else if (sort === "priorityLow") {
            sortOption = {
                priority: -1,
            };
        }

        const goals = await Goal.find(query)
            .populate("parentGoal", "title")
            .sort(sortOption);

        res.status(200).json(goals);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const getGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id)
            .populate("parentGoal", "title");

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