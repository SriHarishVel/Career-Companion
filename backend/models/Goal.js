import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            enum: [
                "Learning",
                "Career",
                "Health",
                "Personal",
            ],
            default: "Learning",
        },

        priority: {
            type: String,
            enum: [
                "High",
                "Medium",
                "Low",
            ],
            default: "Medium",
        },

        goalType: {
            type: String,
            enum: [
                "Primary",
                "Secondary",
            ],
            default: "Primary",
        },

        parentGoal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Goal",
            default: null,
        },

        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        completed: {
            type: Boolean,
            default: false,
        },

        deadline: {
            type: Date,
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

export default mongoose.model("Goal", goalSchema);