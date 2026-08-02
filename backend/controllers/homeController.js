import Goal from "../models/Goal.js";
import Skill from "../models/Skill.js";
import Resource from "../models/Resource.js";
import Job from "../models/Job.js";

export const getHome = async (req, res) => {
    try {

        const primaryGoal = await Goal.findOne({
            user: req.user._id,
            goalType: "Primary",
        });

        const secondaryGoals = await Goal.find({
            user: req.user._id,
            goalType: "Secondary",
        });

        const completedSecondaryGoals = secondaryGoals.filter(
            (goal) => goal.completed
        ).length;

        const overallProgress = secondaryGoals.length
            ? Math.round(
                  secondaryGoals.reduce(
                      (sum, goal) => sum + goal.progress,
                      0
                  ) / secondaryGoals.length
              )
            : 0;

        const todaysFocus = await Goal.findOne({
            user: req.user._id,
            goalType: "Secondary",
            completed: false,
        }).sort({
            progress: -1,
        });

        const skills = await Skill.find(
            {
                user: req.user._id,
            },
            "name category level progress"
        )
        .sort({
            createdAt: -1,
        })
        .limit(5);

        const resources = await Resource.find(
            {
                user: req.user._id,
            },
            "title type favorite completed skill"
        )
        .populate("skill", "name level")
        .sort({
            createdAt: -1,
        })
        .limit(5);

        const applications = await Job.find(
            {
                user: req.user._id,
            },
            "title company status"
        )
        .sort({
            createdAt: -1,
        })
        .limit(5);

        res.status(200).json({
            primaryGoal,
            secondaryGoals,
            completedSecondaryGoals,
            overallProgress,
            todaysFocus,
            skills,
            resources,
            applications,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};