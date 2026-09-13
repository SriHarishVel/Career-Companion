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

  /*
   * LOAD ACTIVITIES
   */
  useEffect(() => {
    if (!applicationId) {
      return undefined;
    }

    let cancelled = false;

    const loadActivities = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        console.log("Loading activities for application:", applicationId);

        const activityData = await getApplicationActivities(applicationId);

        if (cancelled) {
          return;
        }

        setActivities(Array.isArray(activityData) ? activityData : []);
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
    };

    loadActivities();

    return () => {
      cancelled = true;
    };
  }, [applicationId]);

  /*
   * RELOAD ACTIVITIES
   *
   * Activity update/delete endpoints do not return the
   * complete application, so we reload the activity list.
   */
  const reloadActivities = async () => {
    if (!applicationId) {
      return;
    }

    try {
      const activityData = await getApplicationActivities(applicationId);

      setActivities(Array.isArray(activityData) ? activityData : []);
    } catch (error) {
      console.error("Failed to reload application activities:", error);

      setErrorMsg(
        error?.response?.data?.message || "Failed to reload activity history.",
      );
    }
  };

  /*
   * RESET FORM
   */
  const resetForm = () => {
    setType("Note Added");
    setTitle("");
    setDescription("");
    setDate("");
  };

  /*
   * ADD MODAL
   */
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

  /*
   * DETAIL MODAL
   */
  const openDetailModal = (activity) => {
    setSelectedActivity(activity);
    setErrorMsg("");
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    if (saving || deleting) {
      return;
    }

    setShowDetailModal(false);
    setSelectedActivity(null);
    setErrorMsg("");
  };

  /*
   * EDIT MODAL
   */
  const openEditModal = (activity) => {
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
  };

  const closeEditModal = () => {
    if (saving) {
      return;
    }

    setShowEditModal(false);
    setSelectedActivity(null);
    setErrorMsg("");
  };

  /*
   * DELETE MODAL
   */
  const openDeleteModal = (activity) => {
    setSelectedActivity(activity);

    setShowDetailModal(false);
    setShowEditModal(false);
    setShowDeleteModal(true);
    setErrorMsg("");
  };

  const closeDeleteModal = () => {
    if (deleting) {
      return;
    }

    setShowDeleteModal(false);
    setSelectedActivity(null);
    setErrorMsg("");
  };

  /*
   * ADD ACTIVITY
   */
  const handleAddSubmit = async (event) => {
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

      console.log("Adding activity to application:", applicationId);

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
  };

  /*
   * EDIT ACTIVITY
   */
  const handleEditSubmit = async (event) => {
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

      console.log("Updating activity:", selectedActivity._id);

      console.log("Application ID:", applicationId);

      await updateApplicationActivity(applicationId, selectedActivity._id, {
        type,
        title: title.trim(),
        description: description.trim(),
        date: date || null,
      });

      /*
       * Backend returns the updated activity,
       * not the complete application.
       */
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
  };

  /*
   * DELETE ACTIVITY
   */
  const handleDelete = async () => {
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

      console.log("Deleting activity:", selectedActivity._id);

      console.log("Application ID:", applicationId);

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
  };

  /*
   * FORMAT DATE
   */
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

  /*
   * FORMAT ACTIVITY TYPE
   */
  const formatActivityType = (activityType) => {
    if (!activityType) {
      return "Activity";
    }

    return activityType;
  };

  return (
    <section className="application-activity">
      {/* HEADER */}

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
          className="btn-primary"
          onClick={openAddModal}
        >
          Add Activity
        </button>
      </div>

      {/* ERROR */}

      {errorMsg &&
        !showAddModal &&
        !showDetailModal &&
        !showEditModal &&
        !showDeleteModal && (
          <p className="application-activity-error" role="alert">
            {errorMsg}
          </p>
        )}

      {/* TIMELINE */}

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
              >
                <div className="application-activity-card-header">
                  <div className="application-activity-card-main">
                    <span className="application-activity-type">
                      {formatActivityType(activity.type)}
                    </span>

                    <h3>{activity.title}</h3>

                    {activity.description && (
                      <p className="application-activity-description">
                        {activity.description}
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

      {/* ADD ACTIVITY */}

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

      {/* ACTIVITY DETAILS */}

      <FormDialog
        isOpen={showDetailModal}
        title={selectedActivity?.title || "Activity"}
        onClose={closeDetailModal}
      >
        {selectedActivity && (
          <div className="application-activity-detail">
            <div className="application-activity-detail-meta">
              <span className="application-activity-type">
                {formatActivityType(selectedActivity.type)}
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

      {/* EDIT ACTIVITY */}

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
            <label htmlFor="activity-edit-type">Activity Type</label>

            <select
              id="activity-edit-type"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="Note Added">Note</option>

              <option value="Follow-up">Follow-up</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="activity-edit-title">Title</label>

            <input
              id="activity-edit-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div className="filter-group">
            <label htmlFor="activity-edit-description">Description</label>

            <textarea
              id="activity-edit-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={6}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="activity-edit-date">Date</label>

            <input
              id="activity-edit-date"
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

      {/* DELETE CONFIRMATION */}

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
