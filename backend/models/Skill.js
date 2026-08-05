import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            enum: [
                "Programming",
                "Database",
                "Framework",
                "Tools",
                "Soft Skills",
                "Other",
            ],
            default: "Programming",
        },

        level: {
            type: String,
            enum: [
                "Beginner",
                "Intermediate",
                "Advanced",
            ],
            default: "Beginner",
        },

        progress: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },

        secondaryGoal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Goal",
            default: null
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

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;