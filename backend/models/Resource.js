import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            enum: [
                "Course",
                "Video",
                "Article",
                "Book",
                "Documentation",
                "Practice",
                "Other",
            ],
            default: "Course",
        },

        url: {
            type: String,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        favorite: {
            type: Boolean,
            default: false,
        },

        completed: {
            type: Boolean,
            default: false,
        },

        skill: {
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

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;