import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        company: {
            type: String,
            required: true,
            trim: true,
        },

        location: {
            type: String,
            trim: true,
        },

        status: {
            type: String,
            enum: ["Applied", "Interview", "Rejected", "Accepted"],
            default: "Applied",
        },

        jobType: {
            type: String,
            enum: ["Full-time", "Part-time", "Internship", "Remote"],
            default: "Full-time",
        },

        salary: {
            type: Number,
        },

        applicationDate: {
            type: Date,
            default: Date.now,
        },

        notes: {
            type: String,
            trim: true,
        },

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

const Job = mongoose.model("Job", jobSchema);

export default Job;