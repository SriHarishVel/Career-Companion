import { useEffect, useState } from "react";

import {
  getApplicationActivities,
  addApplicationActivity,
  updateApplicationActivity,
  deleteApplicationActivity,
} from "../../../services/applicationService";

import FormDialog from "../../../components/FormDialog";
import ConfirmModal from "../../../components/ConfirmModal";

function ApplicationActivity({ application }) {
  const applicationId = application?._id;

  const [activities, setActivities] = useState([]);

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
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!applicationId) {
      return undefined;
    }

    let cancelled = false;

    async function loadActivities() {
      try {
        setLoading(true);
        setErrorMsg("");

        const activityData = await getApplicationActivities(applicationId);

        if (cancelled) {
          return;
        }

        const filteredActivities = Array.isArray(activityData)
          ? activityData.filter(
              (activity) =>
                activity.type === "Note Added" || activity.type === "Follow-up",
            )
          : [];

        setActivities(filteredActivities);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Failed to load application activities:", error);

        setActivities([]);

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
  }, [applicationId]);

  async function reloadActivities() {
    if (!applicationId) {
      return;
    }

    try {
      const activityData = await getApplicationActivities(applicationId);

      const filteredActivities = Array.isArray(activityData)
        ? activityData.filter(
            (activity) =>
              activity.type === "Note Added" || activity.type === "Follow-up",
          )
        : [];

      setActivities(filteredActivities);
    } catch (error) {
      console.error("Failed to reload application activities:", error);

      setErrorMsg(
        error?.response?.data?.message || "Failed to reload activity history.",
      );
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
    if (saving) {
      return;
    }

    setShowAddModal(false);
    setErrorMsg("");
  }

  function openDetailModal(activity) {
    setSelectedActivity(activity);
    setErrorMsg("");
    setShowDetailModal(true);
  }

  function closeDetailModal() {
    if (saving || deleting) {
      return;
    }

    setShowDetailModal(false);
    setSelectedActivity(null);
    setErrorMsg("");
  }

  function openEditModal(activity) {
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
    if (saving) {
      return;
    }

    setShowEditModal(false);
    setSelectedActivity(null);
    setErrorMsg("");
  }

  function openDeleteModal(activity) {
    setSelectedActivity(activity);
    setShowDetailModal(false);
    setShowEditModal(false);
    setShowDeleteModal(true);
    setErrorMsg("");
  }

  function closeDeleteModal() {
    if (deleting) {
      return;
    }

    setShowDeleteModal(false);
    setSelectedActivity(null);
    setErrorMsg("");
  }

  async function handleAddSubmit(event) {
    event.preventDefault();

    if (saving) {
      return;
    }

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

    if (saving) {
      return;
    }

    if (!applicationId) {
      setErrorMsg("Application could not be identified.");
      return;
    }

    if (!selectedActivity?._id) {
      setErrorMsg("Activity could not be identified.");
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
    if (deleting) {
      return;
    }

    if (!applicationId) {
      setErrorMsg("Application could not be identified.");
      return;
    }

    if (!selectedActivity?._id) {
      setErrorMsg("Activity could not be identified.");
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
  }

  function getActivityPreview(activityDescription) {
    if (!activityDescription) {
      return "";
    }

    const lines = activityDescription
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      return "";
    }

    return lines.length > 1 ? `${lines[0]} ...` : lines[0];
  }

  return (
    <section className="application-activity">
      <div className="application-activity-header">
        <div>
          <span className="application-activity-eyebrow">
            Application notes
          </span>

          <h2>Activity Timeline</h2>

          <p>
            Keep track of important notes and follow-ups for this application.
          </p>
        </div>

        <button type="button" className="btn-primary" onClick={openAddModal}>
          Add Activity
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
      ) : activities.length === 0 ? (
        <div className="application-activity-empty">
          <p>No notes or follow-ups recorded yet.</p>
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
              >
                <div className="application-activity-card-header">
                  <div className="application-activity-card-main">
                    <span className="application-activity-type">
                      {activity.type || "Activity"}
                    </span>

                    <h3>{activity.title}</h3>

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
                    </div>
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

            <div className="application-activity-detail-description">
              {selectedActivity.description ? (
                <p>{selectedActivity.description}</p>
              ) : (
                <p className="application-activity-no-description">
                  No description added.
                </p>
              )}
            </div>
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