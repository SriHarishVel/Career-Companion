import Application from "../models/Application.js";

// Create a new job application.
export const createApplication = async (req, res) => {
  try {
    const { company, role, status, appliedDate, applicationUrl, primaryGoal } =
      req.body;

    const application = await Application.create({
      company,
      role,
      status,
      appliedDate,
      applicationUrl,
      primaryGoal,
      user: req.user._id,

      activities: [
        {
          type: "Application Created",
          title: "Application created",
          description: `Application created for ${role} at ${company}.`,
          date: new Date(),
        },
      ],
    });

    const createdApplication = await Application.findById(
      application._id,
    ).populate("primaryGoal");

    res.status(201).json(createdApplication);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all applications for the logged-in user.
export const getApplications = async (req, res) => {
  try {
    const query = {
      user: req.user._id,
    };

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

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.primaryGoal) {
      query.primaryGoal = req.query.primaryGoal;
    }

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

    const applications = await Application.find(query)
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
    const application = await Application.findById(req.params.id).populate(
      "primaryGoal",
    );

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update an application.
export const updateApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const previousStatus = application.status;

    application.company = req.body.company ?? application.company;
    application.role = req.body.role ?? application.role;
    application.status = req.body.status ?? application.status;
    application.appliedDate = req.body.appliedDate ?? application.appliedDate;
    application.applicationUrl =
      req.body.applicationUrl ?? application.applicationUrl;
    application.primaryGoal = req.body.primaryGoal ?? application.primaryGoal;

    if (req.body.status && req.body.status !== previousStatus) {
      application.activities.push({
        type: "Status Changed",
        title: `Status changed to ${req.body.status}`,
        description: `Application status changed from ${previousStatus} to ${req.body.status}.`,
        date: new Date(),
      });
    }

    await application.save();

    const updatedApplication = await Application.findById(
      req.params.id,
    ).populate("primaryGoal");

    res.status(200).json(updatedApplication);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Add an interview round.
export const addInterviewRound = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const newRound = {
      title: req.body.title,
      status: req.body.status,
      date: req.body.date,
    };

    application.interviewRounds.push(newRound);

    application.activities.push({
      type: "Interview Added",
      title: `Interview round added: ${req.body.title}`,
      description: `A new interview round "${req.body.title}" was added.`,
      date: new Date(),
    });

    await application.save();

    const updatedApplication = await Application.findById(
      req.params.id,
    ).populate("primaryGoal");

    res.status(200).json(updatedApplication);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update an interview round.
export const updateInterviewRound = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const round = application.interviewRounds.id(req.params.roundId);

    if (!round) {
      return res.status(404).json({
        message: "Interview round not found",
      });
    }

    const previousStatus = round.status;
    const previousTitle = round.title;

    round.title = req.body.title ?? round.title;
    round.status = req.body.status ?? round.status;
    round.date = req.body.date ?? round.date;

    const wasCompleted =
      round.status === "Completed" && previousStatus !== "Completed";

    application.activities.push({
      type: wasCompleted ? "Interview Completed" : "Interview Updated",

      title: wasCompleted
        ? `${round.title} completed`
        : `${round.title} updated`,

      description: wasCompleted
        ? `Interview round "${round.title}" was marked as completed.`
        : `Interview round "${previousTitle}" was updated.`,

      date: new Date(),
    });

    await application.save();

    const updatedApplication = await Application.findById(
      req.params.id,
    ).populate("primaryGoal");

    res.status(200).json(updatedApplication);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete an interview round.
export const deleteInterviewRound = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const round = application.interviewRounds.id(req.params.roundId);

    if (!round) {
      return res.status(404).json({
        message: "Interview round not found",
      });
    }

    const deletedRoundTitle = round.title;

    application.interviewRounds.pull(req.params.roundId);

    /*
     * "Interview Deleted" must also exist in the
     * activity enum in Application.js.
     */
    application.activities.push({
      type: "Interview Deleted",
      title: `Interview round deleted: ${deletedRoundTitle}`,
      description: `Interview round "${deletedRoundTitle}" was deleted.`,
      date: new Date(),
    });

    await application.save();

    const updatedApplication = await Application.findById(
      req.params.id,
    ).populate("primaryGoal");

    res.status(200).json(updatedApplication);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get activity history for an application.
export const getApplicationActivities = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const activities = [...application.activities].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Add an activity to an application.
export const addApplicationActivity = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const { type, title, description, date } = req.body;

    if (!type) {
      return res.status(400).json({
        message: "Activity type is required",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Activity title is required",
      });
    }

    application.activities.push({
      type,
      title: title.trim(),
      description: description?.trim() || "",
      date: date || new Date(),
    });

    await application.save();

    const newActivity =
      application.activities[application.activities.length - 1];

    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update an application activity.
export const updateApplicationActivity = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const activity = application.activities.id(req.params.activityId);

    if (!activity) {
      return res.status(404).json({
        message: "Activity not found",
      });
    }

    const { type, title, description, date } = req.body;

    if (type !== undefined) {
      activity.type = type;
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          message: "Activity title is required",
        });
      }

      activity.title = title.trim();
    }

    if (description !== undefined) {
      activity.description = description.trim();
    }

    if (date !== undefined) {
      activity.date = date || null;
    }

    await application.save();

    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete an application activity.
export const deleteApplicationActivity = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const activity = application.activities.id(req.params.activityId);

    if (!activity) {
      return res.status(404).json({
        message: "Activity not found",
      });
    }

    activity.deleteOne();

    await application.save();

    res.status(200).json({
      message: "Activity deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete an application.
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await application.deleteOne();

    res.status(200).json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};