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

export const getJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        if (job.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorized",
            });
        }

        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        if (job.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorized",
            });
        }

        job.title = req.body.title ?? job.title;
        job.company = req.body.company ?? job.company;
        job.location = req.body.location ?? job.location;
        job.status = req.body.status ?? job.status;
        job.jobType = req.body.jobType ?? job.jobType;
        job.salary = req.body.salary ?? job.salary;
        job.notes = req.body.notes ?? job.notes;

        const updatedJob = await job.save();

        res.status(200).json(updatedJob);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        if (job.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorized",
            });
        }

        await job.deleteOne();

        res.status(200).json({
            message: "Job deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};