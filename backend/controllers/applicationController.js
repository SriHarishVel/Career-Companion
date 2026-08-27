import Application from "../models/Application.js";

// Create a new job application.
export const createApplication = async (req, res) => {
    try {

        const {
            company,
            role,
            status,
            appliedDate,
            applicationUrl,
            primaryGoal
        } = req.body;

        const application =
            await Application.create({

                company,
                role,
                status,
                appliedDate,
                applicationUrl,
                primaryGoal,
                user: req.user._id

            });

        res.status(201).json(application);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// Get all applications for the logged-in user.
export const getApplications = async (req, res) => {
    try {

        const query = {
            user: req.user._id,
        };

        // Search company or role
        if (req.query.search) {
            query.$or = [
                {
                    company: {
                        $regex: req.query.search,
                        $options: "i",
                    },
                },
                {
                    role: {
                        $regex: req.query.search,
                        $options: "i",
                    },
                },
            ];
        }

        // Status filter
        if (req.query.status) {
            query.status = req.query.status;
        }

        // Career goal filter
        if (req.query.primaryGoal) {
            query.primaryGoal = req.query.primaryGoal;
        }

        // Sorting
        let sortOption = {
            updatedAt: -1,
        };

        if (req.query.sort === "appliedDate") {
            sortOption = {
                appliedDate: -1,
            };
        } else if (req.query.sort === "company") {
            sortOption = {
                company: 1,
            };
        } else if (req.query.sort === "role") {
            sortOption = {
                role: 1,
            };
        }

        const applications =
            await Application.find(query)
                .populate("primaryGoal")
                .sort(sortOption);

        res.status(200).json(applications);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

// Get one application.
export const getApplication = async (req, res) => {
    try {

        const application =
            await Application.findById(req.params.id)
                .populate("primaryGoal");

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        if (
            application.user.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        res.status(200).json(application);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// Update an application.
export const updateApplication = async (req, res) => {
    try {

        const application =
            await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        if (
            application.user.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        application.company =
            req.body.company ?? application.company;

        application.role =
            req.body.role ?? application.role;

        application.status =
            req.body.status ?? application.status;

        application.appliedDate =
            req.body.appliedDate ?? application.appliedDate;

        application.applicationUrl =
            req.body.applicationUrl ?? application.applicationUrl;

        application.primaryGoal =
            req.body.primaryGoal ?? application.primaryGoal;

        const updatedApplication =
            await application.save();

        res.status(200).json(updatedApplication);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const addInterviewRound = async (req, res) => {
    try {

        const application =
            await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                message: "Application not found",
            });
        }

        if (
            application.user.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "Not authorized",
            });
        }

        application.interviewRounds.push({
            title: req.body.title,
            status: req.body.status,
            date: req.body.date,
        });

        await application.save();

        const updatedApplication =
            await Application.findById(req.params.id)
                .populate("primaryGoal");

        res.status(200).json(
            updatedApplication
        );

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

export const updateInterviewRound = async (req, res) => {
    try {

        const application =
            await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                message: "Application not found",
            });
        }

        if (
            application.user.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "Not authorized",
            });
        }

        const round =
            application.interviewRounds.id(
                req.params.roundId
            );

        if (!round) {
            return res.status(404).json({
                message: "Interview round not found",
            });
        }

        round.title =
            req.body.title ?? round.title;

        round.status =
            req.body.status ?? round.status;

        round.date =
            req.body.date ?? round.date;

        await application.save();

        const updatedApplication =
            await Application.findById(
                req.params.id
            ).populate("primaryGoal");

        res.status(200).json(
            updatedApplication
        );

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

export const deleteInterviewRound = async (req, res) => {
    try {

        const application =
            await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                message: "Application not found",
            });
        }

        if (
            application.user.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "Not authorized",
            });
        }

        application.interviewRounds.pull(
            req.params.roundId
        );

        await application.save();

        const updatedApplication =
            await Application.findById(req.params.id)
                .populate("primaryGoal");

        res.status(200).json(
            updatedApplication
        );

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

// Delete an application.
export const deleteApplication = async (req, res) => {
    try {

        const application =
            await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        if (
            application.user.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        await application.deleteOne();

        res.status(200).json({
            message: "Application deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};