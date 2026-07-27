import Job from "../models/Job.js";

export const createJob = async (req, res) => {
    try {
        const {
            title,
            company,
            location,
            status,
            jobType,
            salary,
            notes,
        } = req.body;

        const job = await Job.create({
            title,
            company,
            location,
            status,
            jobType,
            salary,
            notes,
            user: req.user._id,
        });

        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            user: req.user._id,
        }).sort({ createdAt: -1 });

        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};