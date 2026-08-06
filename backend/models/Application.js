import mongoose from "mongoose";

// Stores each interview stage for an application.
const interviewRoundSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Completed",
                "Failed",
            ],
            default: "Pending",
        },

        date: {
            type: Date,
            default: null,
        },
    },
    {
        _id: true,
    }
);

// Stores a job application along with all its interview rounds.
const applicationSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: true,
            trim: true,
        },

        role: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: [
                "Applied",
                "In Progress",
                "Offer",
                "Rejected",
                "Withdrawn",
            ],
            default: "Applied",
        },

        appliedDate: {
            type: Date,
            default: null,
        },

        applicationUrl: {
            type: String,
            trim: true,
            default: "",
        },

        // Optional career goal linked to this application.
        primaryGoal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Goal",
            default: null,
        },

        // Interview stages for this application.
        interviewRounds: [
            interviewRoundSchema,
        ],

        // Owner of this application.
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Application = mongoose.model(
    "Application",
    applicationSchema
);

export default Application;