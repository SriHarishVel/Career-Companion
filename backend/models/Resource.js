import mongoose from "mongoose";

const resourceItemSchema = new mongoose.Schema(
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
        "Audio",
        "Article",
        "Book",
        "Documentation",
        "Practice",
        "PDF",
        "Image",
        "Other",
      ],
      default: "Other",
    },

    source: {
      type: String,
      enum: ["external", "upload"],
      default: "external",
    },

    url: {
      type: String,
      trim: true,
    },

    file: {
      originalName: {
        type: String,
        trim: true,
      },

      mimeType: {
        type: String,
        trim: true,
      },

      size: {
        type: Number,
      },

      filename: {
        type: String,
        trim: true,
      },
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  },
);

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [resourceItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;