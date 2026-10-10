import { useEffect, useState } from "react";

import {
  getApplicationActivities,
  addApplicationActivity,
  updateApplicationActivity,
  updateFollowUpStatus,
  deleteApplicationActivity,
} from "../../../services/applicationService";

import FormDialog from "../../../components/FormDialog";
import ConfirmModal from "../../../components/ConfirmModal";

const editableActivityTypes = ["Note Added", "Follow-up"];

function ApplicationActivity({ application }) {
  const applicationId = application?._id;

  const [activities, setActivities] = useState([]);
  const [activityFilter, setActivityFilter] = useState("notes");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedActivity, setSelectedActivity] = useState(null);

  const [type, setType] = useState("Note Added");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const [loading, setLoading] = useState(Boolean(applicationId));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!applicationId) return undefined;

    let cancelled = false;

    async function loadActivities() {
      try {
        setLoading(true);
        setErrorMsg("");

        const activityData = await getApplicationActivities(applicationId);

        if (cancelled) return;

        setActivities(Array.isArray(activityData) ? activityData : []);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to load application activities:", error);

        setActivities([]);
        setErrorMsg(
          error?.response?.data?.message || "Failed to load activity history.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadActivities();

    return () => {
      cancelled = true;
    };
  }, [applicationId, application?.updatedAt]);

  async function reloadActivities() {
    if (!applicationId) return null;

    try {
      const activityData = await getApplicationActivities(applicationId);

      const nextActivities = Array.isArray(activityData) ? activityData : [];

      setActivities(nextActivities);

      return nextActivities;
    } catch (error) {
      console.error("Failed to reload application activities:", error);

      setErrorMsg(
        error?.response?.data?.message || "Failed to reload activity history.",
      );

      return null;
    }
  }

  function isEditableActivity(activity) {
    return editableActivityTypes.includes(activity?.type);
  }

  const displayedActivities = activities
    .filter((activity) => {
      if (activityFilter === "notes") {
        return ["Note Added", "Follow-up"].includes(activity.type);
      }

      return !["Note Added", "Follow-up"].includes(activity.type);
    })
    .sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt || 0).getTime();
      const dateB = new Date(b.date || b.createdAt || 0).getTime();

      return dateB - dateA;
    });

  async function handleFollowUpStatusToggle(activity) {
    if (updatingStatusId || !applicationId || !activity?._id) {
      return;
    }

    const newCompletedStatus = !activity.completed;

    try {
      setUpdatingStatusId(activity._id);
      setErrorMsg("");

      const updatedActivity = await updateFollowUpStatus(
        applicationId,
        activity._id,
        newCompletedStatus,
      );

      setActivities((currentActivities) =>
        currentActivities.map((item) =>
          item._id === activity._id ? { ...item, ...updatedActivity } : item,
        ),
      );

      setSelectedActivity((currentActivity) =>
        currentActivity?._id === activity._id
          ? { ...currentActivity, ...updatedActivity }
          : currentActivity,
      );
    } catch (error) {
      console.error("Failed to update follow-up status:", error);

      setErrorMsg(
        error?.response?.data?.message || "Failed to update follow-up status.",
      );
    } finally {
      setUpdatingStatusId(null);
    }
  }

  function resetForm() {
    setType("Note Added");
    setTitle("");
    setDescription("");
    setDate("");
  }

  function openAddModal() {
    resetForm();
    setErrorMsg("");
    setShowAddModal(true);
  }

  function closeAddModal() {
    if (saving) return;

    setShowAddModal(false);
    setErrorMsg("");
  }

  function openDetailModal(activity) {
    setSelectedActivity(activity);
    setErrorMsg("");
    setShowDetailModal(true);
  }

  function closeDetailModal() {
    if (saving || deleting || updatingStatusId) return;

    setShowDetailModal(false);
    setSelectedActivity(null);
    setErrorMsg("");
  }

  function openEditModal(activity) {
    if (!isEditableActivity(activity)) return;

    setSelectedActivity(activity);
    setType(activity.type || "Note Added");
    setTitle(activity.title || "");
    setDescription(activity.description || "");

    if (activity.date) {
      const parsedDate = new Date(activity.date);

      setDate(
        Number.isNaN(parsedDate.getTime())
          ? ""
          : parsedDate.toISOString().split("T")[0],
      );
    } else {
      setDate("");
    }

    setErrorMsg("");
    setShowDetailModal(false);
    setShowEditModal(true);
  }

  function closeEditModal() {
    if (saving) return;

    setShowEditModal(false);
    setSelectedActivity(null);
    setErrorMsg("");
  }

  function openDeleteModal(activity) {
    if (!isEditableActivity(activity)) return;

    setSelectedActivity(activity);
    setShowDetailModal(false);
    setShowEditModal(false);
    setShowDeleteModal(true);
    setErrorMsg("");
  }

  function closeDeleteModal() {
    if (deleting) return;

    setShowDeleteModal(false);
    setSelectedActivity(null);
    setErrorMsg("");
  }

  async function handleAddSubmit(event) {
    event.preventDefault();

    if (saving) return;

    if (!applicationId) {
      setErrorMsg("Application could not be identified.");
      return;
    }

    if (!title.trim()) {
      setErrorMsg("Activity title is required.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");

      await addApplicationActivity(applicationId, {
        type,
        title: title.trim(),
        description: description.trim(),
        date: date || null,
      });

      await reloadActivities();

      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error("Failed to add application activity:", error);

      setErrorMsg(error?.response?.data?.message || "Failed to add activity.");
    } finally {
      setSaving(false);
    }
  }

  async function handleEditSubmit(event) {
    event.preventDefault();

    if (saving) return;

    if (!applicationId) {
      setErrorMsg("Application could not be identified.");
      return;
    }

    if (!selectedActivity?._id || !isEditableActivity(selectedActivity)) {
      setErrorMsg("This history event cannot be edited.");
      return;
    }

    if (!title.trim()) {
      setErrorMsg("Activity title is required.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");

      await updateApplicationActivity(applicationId, selectedActivity._id, {
        type,
        title: title.trim(),
        description: description.trim(),
        date: date || null,
      });

      await reloadActivities();

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
  }

  async function handleDelete() {
    if (deleting) return;

    if (!applicationId) {
      setErrorMsg("Application could not be identified.");
      return;
    }

    if (!selectedActivity?._id || !isEditableActivity(selectedActivity)) {
      setErrorMsg("This history event cannot be deleted.");
      return;
    }

    try {
      setDeleting(true);
      setErrorMsg("");

      await deleteApplicationActivity(applicationId, selectedActivity._id);

      await reloadActivities();

      setShowDeleteModal(false);
      setSelectedActivity(null);
    } catch (error) {
      console.error("Failed to delete application activity:", error);

      setErrorMsg(
        error?.response?.data?.message || "Failed to delete activity.",
      );
    } finally {
      setDeleting(false);
    }
  }

  function formatDate(activityDate) {
    if (!activityDate) return "No date";

    const parsedDate = new Date(activityDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return "No date";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function isOverdue(activity) {
    if (activity.type !== "Follow-up" || activity.completed || !activity.date) {
      return false;
    }

    const dueDate = new Date(activity.date);

    if (Number.isNaN(dueDate.getTime())) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
  }

  function getActivityPreview(activityDescription) {
    if (!activityDescription) return "";

    const lines = activityDescription
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) return "";

    return lines.length > 1 ? `${lines[0]} ...` : lines[0];
  }

  return (
    <section className="application-activity">
      <div className="application-activity-header">
        <div>
          <span className="application-activity-eyebrow">
            Application history
          </span>

          <h2>Activity Timeline</h2>

          <p>
            Review application updates, interview events, notes, and follow-ups
            in chronological order.
          </p>
        </div>

        <button type="button" className="btn-primary" onClick={openAddModal}>
          Add Activity
        </button>
      </div>

      <div className="application-activity-filters">
        <button
          type="button"
          className={`btn-secondary ${
            activityFilter === "notes" ? "active" : ""
          }`}
          onClick={() => setActivityFilter("notes")}
          aria-pressed={activityFilter === "notes"}
        >
          Notes & Follow-ups
        </button>

        <button
          type="button"
          className={`btn-secondary ${
            activityFilter === "other" ? "active" : ""
          }`}
          onClick={() => setActivityFilter("other")}
          aria-pressed={activityFilter === "other"}
        >
          Other Activities
        </button>
      </div>

      {errorMsg &&
        !showAddModal &&
        !showDetailModal &&
        !showEditModal &&
        !showDeleteModal && (
          <p className="application-activity-error" role="alert">
            {errorMsg}
          </p>
        )}

      {loading ? (
        <div className="application-activity-empty">
          <p>Loading activity history...</p>
        </div>
      ) : displayedActivities.length === 0 ? (
        <div className="application-activity-empty">
          <p>
            {activityFilter === "notes"
              ? "No notes or follow-ups recorded yet."
              : "No other activities recorded yet."}
          </p>
        </div>
      ) : (
        <div className="application-activity-timeline">
          {displayedActivities.map((activity) => {
            const editable = isEditableActivity(activity);

            return (
              <article key={activity._id} className="application-activity-item">
                <div className="application-activity-marker">
                  <span />
                </div>

                <div
                  className="application-activity-card"
                  onClick={() => openDetailModal(activity)}
                >
                  <div className="application-activity-card-header">
                    <div className="application-activity-card-main">
                      <span className="application-activity-type">
                        {activity.type || "Activity"}
                      </span>

                      <h3>{activity.title}</h3>

                      {activity.type === "Follow-up" && (
                        <div className="application-follow-up-badges">
                          <span
                            className={`application-follow-up-status ${
                              activity.completed ? "completed" : "pending"
                            }`}
                          >
                            <span
                              className="application-follow-up-status-icon"
                              aria-hidden="true"
                            >
                              {activity.completed ? "✓" : "○"}
                            </span>

                            {activity.completed ? "Completed" : "Pending"}
                          </span>

                          {isOverdue(activity) && (
                            <span className="application-follow-up-overdue">
                              Overdue
                              <span aria-hidden="true">!</span>
                            </span>
                          )}
                        </div>
                      )}

                      {activity.description && (
                        <p className="application-activity-description">
                          {getActivityPreview(activity.description)}
                        </p>
                      )}
                    </div>

                    <div className="application-activity-card-side">
                      <span className="application-activity-date">
                        {formatDate(activity.date)}
                      </span>

                      <div
                        className="application-activity-actions"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {activity.type === "Follow-up" && editable && (
                          <button
                            type="button"
                            className={`application-follow-up-toggle ${
                              activity.completed ? "completed" : "pending"
                            }`}
                            onClick={() => handleFollowUpStatusToggle(activity)}
                            disabled={updatingStatusId !== null}
                            aria-label={
                              activity.completed
                                ? `Mark ${activity.title} as pending`
                                : `Mark ${activity.title} as completed`
                            }
                            aria-pressed={Boolean(activity.completed)}
                          >
                            {updatingStatusId === activity._id ? (
                              <>
                                <span
                                  className="application-follow-up-toggle-spinner"
                                  aria-hidden="true"
                                />
                                Saving...
                              </>
                            ) : activity.completed ? (
                              <>
                                <span aria-hidden="true">↶</span>
                                Mark as Pending
                              </>
                            ) : (
                              <>
                                <span aria-hidden="true">✓</span>
                                Mark as Complete
                              </>
                            )}
                          </button>
                        )}

                        {editable && (
                          <>
                            <button
                              type="button"
                              className="btn-secondary"
                              onClick={() => openEditModal(activity)}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="btn-danger-outline"
                              onClick={() => openDeleteModal(activity)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
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
              className="btn-primary"
              disabled={saving}
            >
              {saving ? "Saving..." : "Add Activity"}
            </button>

            <button
              type="button"
              className="btn-secondary"
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
            <label htmlFor="application-activity-type">Activity Type</label>

            <select
              id="application-activity-type"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="Note Added">Note</option>
              <option value="Follow-up">Follow-up</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="application-activity-title">Title</label>

            <input
              id="application-activity-title"
              type="text"
              placeholder="e.g. Recruiter follow-up"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div className="filter-group">
            <label htmlFor="application-activity-description">
              Description
            </label>

            <textarea
              id="application-activity-description"
              placeholder="Add additional details..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="application-activity-date">Date</label>

            <input
              id="application-activity-date"
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
            <div className="application-activity-detail-meta">
              <span className="application-activity-type">
                {selectedActivity.type || "Activity"}
              </span>

              <span className="application-activity-date">
                {formatDate(selectedActivity.date)}
              </span>
            </div>

            {selectedActivity.type === "Follow-up" && (
              <p>
                Status:{" "}
                <strong>
                  {selectedActivity.completed ? "Completed" : "Pending"}
                </strong>
              </p>
            )}

            {!isEditableActivity(selectedActivity) && (
              <p>
                <strong>Application history event</strong> · Read-only
              </p>
            )}

            <div className="application-activity-detail-description">
              {selectedActivity.description ? (
                <p>{selectedActivity.description}</p>
              ) : (
                <p className="application-activity-no-description">
                  No description added.
                </p>
              )}
            </div>

            {isEditableActivity(selectedActivity) && (
              <div className="application-activity-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => openEditModal(selectedActivity)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="btn-danger-outline"
                  onClick={() => openDeleteModal(selectedActivity)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
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
              className="btn-primary"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              className="btn-secondary"
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
            <label htmlFor="application-activity-edit-type">
              Activity Type
            </label>

            <select
              id="application-activity-edit-type"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="Note Added">Note</option>
              <option value="Follow-up">Follow-up</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="application-activity-edit-title">Title</label>

            <input
              id="application-activity-edit-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div className="filter-group">
            <label htmlFor="application-activity-edit-description">
              Description
            </label>

            <textarea
              id="application-activity-edit-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="application-activity-edit-date">Date</label>

            <input
              id="application-activity-edit-date"
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

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Activity"
        message={
          selectedActivity
            ? `Are you sure you want to delete "${selectedActivity.title}"? This action cannot be undone.`
            : "Are you sure you want to delete this activity?"
        }
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
        loading={deleting}
      />
    </section>
  );
}

export default ApplicationActivity;
