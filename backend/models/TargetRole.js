import mongoose from "mongoose";

const targetRoleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    requirements: [
      {
        skillName: {
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
          default: "Other",
        },

        requiredLevel: {
          type: String,
          enum: ["Beginner", "Intermediate", "Advanced"],
          default: "Intermediate",
        },

        importance: {
          type: String,
          enum: ["High", "Medium", "Low"],
          default: "Medium",
        },
      },
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

targetRoleSchema.index({ user: 1, title: 1 });

export default mongoose.model("TargetRole", targetRoleSchema);