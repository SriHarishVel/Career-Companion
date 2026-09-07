import { useEffect, useState } from "react";

import {
  getApplicationActivities,
  addApplicationActivity,
  updateApplicationActivity,
  deleteApplicationActivity,
} from "../../../services/applicationService";

import FormDialog from "../../../components/FormDialog";

function ApplicationActivity({ application }) {
  const [activities, setActivities] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [selectedActivity, setSelectedActivity] = useState(null);

  const [type, setType] = useState("Note Added");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!application?._id) {
      return;
    }

    let cancelled = false;

    async function loadActivities() {
      try {
        setLoading(true);
        setErrorMsg("");

        const activityData = await getApplicationActivities(application._id);

        if (cancelled) {
          return;
        }

        setActivities(Array.isArray(activityData) ? activityData : []);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Failed to load application activities:", error);

        setErrorMsg(
          error?.response?.data?.message || "Failed to load activity history.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadActivities();

    return () => {
      cancelled = true;
    };
  }, [application?._id]);

  const resetForm = () => {
    setType("Note Added");
    setTitle("");
    setDescription("");
    setDate("");
  };

  const openAddModal = () => {
    resetForm();
    setErrorMsg("");
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    if (saving) {
      return;
    }

    setShowAddModal(false);
    setErrorMsg("");
  };

  const openDetailModal = (activity) => {
    setSelectedActivity(activity);
    setErrorMsg("");
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    if (saving) {
      return;
    }

    setShowDetailModal(false);
    setSelectedActivity(null);
    setErrorMsg("");
  };

  const openEditModal = (activity) => {
    setSelectedActivity(activity);

    setType(activity.type || "Note Added");
    setTitle(activity.title || "");
    setDescription(activity.description || "");

    if (activity.date) {
      const parsedDate = new Date(activity.date);

      if (!Number.isNaN(parsedDate.getTime())) {
        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
        const day = String(parsedDate.getDate()).padStart(2, "0");

        setDate(`${year}-${month}-${day}`);
      } else {
        setDate("");
      }
    } else {
      setDate("");
    }

    setErrorMsg("");
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    if (saving) {
      return;
    }

    setShowEditModal(false);
    setSelectedActivity(null);
    setErrorMsg("");
    resetForm();
  };

  const handleAddSubmit = async (event) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    if (!title.trim()) {
      setErrorMsg("Activity title is required.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");

      const activity = await addApplicationActivity(application._id, {
        type,
        title: title.trim(),
        description: description.trim(),
        date: date || null,
      });

      setActivities((currentActivities) => [activity, ...currentActivities]);

      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error("Failed to add application activity:", error);

      setErrorMsg(error?.response?.data?.message || "Failed to add activity.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    if (saving || !selectedActivity) {
      return;
    }

    if (!title.trim()) {
      setErrorMsg("Activity title is required.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");

      const updatedActivity = await updateApplicationActivity(
        application._id,
        selectedActivity._id,
        {
          type,
          title: title.trim(),
          description: description.trim(),
          date: date || null,
        },
      );

      setActivities((currentActivities) =>
        currentActivities.map((activity) =>
          activity._id === selectedActivity._id ? updatedActivity : activity,
        ),
      );

      setShowEditModal(false);
      setSelectedActivity(null);
      resetForm();
    } catch (error) {
      console.error("Failed to update application activity:", error);

      setErrorMsg(
        error?.response?.data?.message || "Failed to update activity.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (activity) => {
    if (!activity?._id) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${activity.title}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setErrorMsg("");

      await deleteApplicationActivity(application._id, activity._id);

      setActivities((currentActivities) =>
        currentActivities.filter((item) => item._id !== activity._id),
      );

      if (selectedActivity?._id === activity._id) {
        setShowDetailModal(false);
        setSelectedActivity(null);
      }
    } catch (error) {
      console.error("Failed to delete application activity:", error);

      setErrorMsg(
        error?.response?.data?.message || "Failed to delete activity.",
      );
    }
  };

  const formatDate = (activityDate) => {
    if (!activityDate) {
      return "No date";
    }

    const parsedDate = new Date(activityDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return "No date";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatActivityType = (activityType) => {
    if (!activityType) {
      return "Activity";
    }

    return activityType;
  };

  return (
    <section className="application-activity">
      <div className="application-activity-header">
        <div>
          <span className="application-activity-eyebrow">
            Application history
          </span>

          <h2>Activity Timeline</h2>

          <p>Keep track of important events and notes for this application.</p>
        </div>

        <button
          type="button"
          className="application-action-primary"
          onClick={openAddModal}
        >
          Add Activity
        </button>
      </div>

      {errorMsg && !showAddModal && !showEditModal && !showDetailModal && (
        <p className="application-activity-error" role="alert">
          {errorMsg}
        </p>
      )}

      {loading ? (
        <div className="application-activity-empty">
          <p>Loading activity history...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="application-activity-empty">
          <p>No activity recorded yet.</p>
        </div>
      ) : (
        <div className="application-activity-timeline">
          {activities.map((activity) => (
            <article key={activity._id} className="application-activity-item">
              <div className="application-activity-marker">
                <span />
              </div>

              <div
                className="application-activity-card"
                onClick={() => openDetailModal(activity)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openDetailModal(activity);
                  }
                }}
              >
                <div className="application-activity-main">
                  <span className="application-activity-type">
                    {formatActivityType(activity.type)}
                  </span>

                  <h3>{activity.title}</h3>
                </div>

                <div className="application-activity-description-wrap">
                  {activity.description ? (
                    <p className="application-activity-description">
                      {activity.description}
                    </p>
                  ) : (
                    <p className="application-activity-description application-activity-no-description">
                      No description
                    </p>
                  )}
                </div>

                <div className="application-activity-actions">
                  <span className="application-activity-date">
                    {formatDate(activity.date)}
                  </span>

                  <div className="application-activity-buttons">
                    <button
                      type="button"
                      className="application-activity-edit"
                      onClick={(event) => {
                        event.stopPropagation();
                        openEditModal(activity);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="application-activity-delete"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(activity);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <FormDialog
        isOpen={showAddModal}
        title="Add Activity"
        onClose={closeAddModal}
        footer={
          <>
            <button
              type="submit"
              form="application-activity-form"
              className="application-action-primary"
              disabled={saving}
            >
              {saving ? "Saving..." : "Add Activity"}
            </button>

            <button
              type="button"
              className="application-action-secondary"
              onClick={closeAddModal}
              disabled={saving}
            >
              Cancel
            </button>
          </>
        }
      >
        <form
          id="application-activity-form"
          className="application-activity-form"
          onSubmit={handleAddSubmit}
        >
          <div className="filter-group">
            <label htmlFor="activity-type">Activity Type</label>

            <select
              id="activity-type"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="Note Added">Note</option>

              <option value="Follow-up">Follow-up</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="activity-title">Title</label>

            <input
              id="activity-title"
              type="text"
              placeholder="e.g. Recruiter follow-up"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div className="filter-group">
            <label htmlFor="activity-description">Description</label>

            <textarea
              id="activity-description"
              placeholder="Add additional details..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="activity-date">Date</label>

            <input
              id="activity-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          {errorMsg && (
            <p className="error" role="alert">
              {errorMsg}
            </p>
          )}
        </form>
      </FormDialog>

      <FormDialog
        isOpen={showEditModal}
        title="Edit Activity"
        onClose={closeEditModal}
        footer={
          <>
            <button
              type="submit"
              form="application-activity-edit-form"
              className="application-action-primary"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              className="application-action-secondary"
              onClick={closeEditModal}
              disabled={saving}
            >
              Cancel
            </button>
          </>
        }
      >
        <form
          id="application-activity-edit-form"
          className="application-activity-form"
          onSubmit={handleEditSubmit}
        >
          <div className="filter-group">
            <label htmlFor="edit-activity-type">Activity Type</label>

            <select
              id="edit-activity-type"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="Note Added">Note</option>

              <option value="Follow-up">Follow-up</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="edit-activity-title">Title</label>

            <input
              id="edit-activity-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div className="filter-group">
            <label htmlFor="edit-activity-description">Description</label>

            <textarea
              id="edit-activity-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="edit-activity-date">Date</label>

            <input
              id="edit-activity-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          {errorMsg && (
            <p className="error" role="alert">
              {errorMsg}
            </p>
          )}
        </form>
      </FormDialog>

      <FormDialog
        isOpen={showDetailModal}
        title={selectedActivity?.title || "Activity"}
        onClose={closeDetailModal}
      >
        {selectedActivity && (
          <div className="application-activity-detail">
            <span className="application-activity-type">
              {formatActivityType(selectedActivity.type)}
            </span>

            <span className="application-activity-date">
              {formatDate(selectedActivity.date)}
            </span>

            {selectedActivity.description ? (
              <p className="application-activity-modal-description">
                {selectedActivity.description}
              </p>
            ) : (
              <p className="application-activity-description application-activity-no-description">
                No description
              </p>
            )}
          </div>
        )}
      </FormDialog>
    </section>
  );
}

export default ApplicationActivity;