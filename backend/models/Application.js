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
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },

    date: {
      type: Date,
      default: null,
    },
  },
  {
    _id: true,
  },
);

// Stores an event/activity related to an application.
const applicationActivitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "Application Created",
        "Status Changed",
        "Interview Added",
        "Interview Updated",
        "Interview Completed",
        "Note Added",
        "Follow-up",
      ],
      required: true,
    },

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

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
    timestamps: true,
  },
);

// Stores a job application along with interview rounds and activity history.
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
      enum: ["Applied", "In Progress", "Offer", "Rejected", "Withdrawn"],
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
    interviewRounds: [interviewRoundSchema],

    // Timeline/history of important application events.
    activities: [applicationActivitySchema],

    // Owner of this application.
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

const Application = mongoose.model("Application", applicationSchema);

export default Application;
