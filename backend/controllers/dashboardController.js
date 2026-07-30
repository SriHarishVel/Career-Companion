import Job from "../models/Job.js";

export const getStats = async (req, res) => {
    try {
        const totalJobs = await Job.countDocuments({
            user: req.user._id,
        });

        const statusStats = await Job.aggregate([
            {
                $match: {
                    user: req.user._id,
                },
            },
            {
                $group: {
                    _id: "$status",
                    count: {
                        $sum: 1,
                    },
                },
            },
        ]);

        const stats = {
            applied: 0,
            interview: 0,
            offer: 0,
            rejected: 0,
        };

        statusStats.forEach((item) => {
            stats[item._id.toLowerCase()] = item.count;
        });

        res.status(200).json({
            totalJobs,
           ...stats,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};