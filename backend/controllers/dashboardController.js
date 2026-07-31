import Job from "../models/Job.js";

export const getStats = async (req, res) => {
    try {
        // Total jobs
        const totalJobs = await Job.countDocuments({
            user: req.user._id,
        });

        // Status statistics
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

        // Convert status array into object
        const stats = {
            applied: 0,
            interview: 0,
            offer: 0,
            rejected: 0,
        };

        statusStats.forEach((item) => {
            stats[item._id.toLowerCase()] = item.count;
        });

        // Monthly application statistics
        const monthlyApplications = await Job.aggregate([
            {
                $match: {
                    user: req.user._id,
                },
            },
            {
                $group: {
                    _id: {
                        year: {
                            $year: "$createdAt",
                        },
                        month: {
                            $month: "$createdAt",
                        },
                    },
                    count: {
                        $sum: 1,
                    },
                },
            },
            {
                $sort: {
                    "_id.year": -1,
                    "_id.month": -1,
                },
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    count: 1,
                },
            },
        ]);

        // Month names
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        // Format monthly stats
        const monthlyStats = monthlyApplications.map((item) => ({
            month: `${months[item.month - 1]} ${item.year}`,
            count: item.count,
        }));

        res.status(200).json({
            totalJobs,
            ...stats,
            monthlyStats,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};