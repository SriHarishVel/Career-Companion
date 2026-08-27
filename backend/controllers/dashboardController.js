import Application from "../models/Application.js";

export const getStats = async (req, res) => {
  try {
    // Total applications
    const totalApplications = await Application.countDocuments({
      user: req.user._id,
    });

    // Application status statistics
    const statusStats = await Application.aggregate([
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
      inProgress: 0,
      offer: 0,
      rejected: 0,
      withdrawn: 0,
    };

    statusStats.forEach((item) => {
      if (item._id === "Applied") {
        stats.applied = item.count;
      }

      if (item._id === "In Progress") {
        stats.inProgress = item.count;
      }

      if (item._id === "Offer") {
        stats.offer = item.count;
      }

      if (item._id === "Rejected") {
        stats.rejected = item.count;
      }

      if (item._id === "Withdrawn") {
        stats.withdrawn = item.count;
      }
    });

    // Monthly application statistics
    const monthlyApplications = await Application.aggregate([
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

    // Format monthly statistics
    const monthlyStats = monthlyApplications.map((item) => ({
      month: `${months[item.month - 1]} ${item.year}`,
      count: item.count,
    }));

    res.status(200).json({
      totalApplications,
      ...stats,
      monthlyStats,
    });
  } catch (error) {
    console.error("Failed to load dashboard statistics:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
