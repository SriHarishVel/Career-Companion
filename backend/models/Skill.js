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
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    progressHistory: [
      {
        previousProgress: {
          type: Number,
          min: 0,
          max: 100,
          required: true,
        },

        newProgress: {
          type: Number,
          min: 0,
          max: 100,
          required: true,
        },

        action: {
          type: String,
          trim: true,
          default: "Progress updated",
        },

        itemName: {
          type: String,
          trim: true,
          default: "",
        },

        details: {
          type: String,
          trim: true,
          default: "",
        },

        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    developmentStatus: {
      type: String,
      enum: ["In Progress", "Established"],
      default: "In Progress",
    },

    learningAreas: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },

        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],

    practicalRequirements: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },

        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],

    secondaryGoal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      default: null,
    },

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

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
