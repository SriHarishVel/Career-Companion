import { useState } from "react";

import FormDialog from "../../../components/FormDialog";
import ConfirmModal from "../../../components/ConfirmModal";

function ApplicationInterviews({
  application,
  onAddRound,
  onUpdateRound,
  onDeleteRound,
}) {
  const interviewRounds = application?.interviewRounds || [];

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedRound, setSelectedRound] = useState(null);

  const [roundTitle, setRoundTitle] = useState("");
  const [roundStatus, setRoundStatus] = useState("Pending");
  const [roundDate, setRoundDate] = useState("");

  const [saving, setSaving] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  const sortedRounds = [...interviewRounds].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;

    return new Date(a.date) - new Date(b.date);
  });

  function formatDate(date) {
    if (!date) {
      return "Date not set";
    }

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function getStatusClass(status) {
    return (status || "").toLowerCase().replace(/\s+/g, "-");
  }

  function resetForm() {
    setRoundTitle("");
    setRoundStatus("Pending");
    setRoundDate("");
    setErrorMsg("");
  }

  function openAddDialog() {
    resetForm();
    setShowAddDialog(true);
  }

  function closeAddDialog() {
    if (saving) {
      return;
    }

    setShowAddDialog(false);
    resetForm();
  }

  function openEditDialog(round) {
    setSelectedRound(round);

    setRoundTitle(round.title || "");
    setRoundStatus(round.status || "Pending");

    setRoundDate(
      round.date ? new Date(round.date).toISOString().split("T")[0] : "",
    );

    setErrorMsg("");
    setShowEditDialog(true);
  }

  function closeEditDialog() {
    if (saving) {
      return;
    }

    setShowEditDialog(false);
    setSelectedRound(null);
    resetForm();
  }

  function openDeleteDialog(round) {
    setSelectedRound(round);
    setShowDeleteModal(true);
  }

  function closeDeleteDialog() {
    if (saving) {
      return;
    }

    setShowDeleteModal(false);
    setSelectedRound(null);
  }

  async function handleAddRound() {
    if (!roundTitle.trim()) {
      setErrorMsg("Please enter an interview round name.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");

      await onAddRound({
        title: roundTitle.trim(),
        status: roundStatus,
        date: roundDate || "",
      });

      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      setErrorMsg(error.message || "Failed to add interview round.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateRound() {
    if (!selectedRound) {
      return;
    }

    if (!roundTitle.trim()) {
      setErrorMsg("Please enter an interview round name.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");

      await onUpdateRound(selectedRound._id, {
        title: roundTitle.trim(),
        status: roundStatus,
        date: roundDate || "",
      });

      setShowEditDialog(false);
      setSelectedRound(null);
      resetForm();
    } catch (error) {
      setErrorMsg(error.message || "Failed to update interview round.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteRound() {
    if (!selectedRound) {
      return;
    }

    try {
      setSaving(true);

      await onDeleteRound(selectedRound._id);

      setShowDeleteModal(false);
      setSelectedRound(null);
    } catch (error) {
      setErrorMsg(error.message || "Failed to delete interview round.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <section className="application-interviews">
        <div className="application-interviews-header">
          <div className="application-interviews-heading">
            <span className="application-section-label">Interview Process</span>

            <h2>Interview Rounds</h2>

            <p className="application-interviews-description">
              Track the stages of your interview process.
            </p>
          </div>

          <button
            type="button"
            className="application-add-round-btn"
            onClick={openAddDialog}
          >
            + Add Round
          </button>
        </div>

        {sortedRounds.length === 0 ? (
          <div className="application-interviews-empty">
            <h3>No interview rounds yet</h3>

            <p>Add your first interview round to start tracking the process.</p>
          </div>
        ) : (
          <div className="application-interview-list">
            {sortedRounds.map((round, index) => (
              <article key={round._id} className="application-interview-round">
                <div className="application-interview-round-marker">
                  {index + 1}
                </div>

                <div className="application-interview-round-main">
                  <strong className="application-interview-round-title">
                    {round.title}
                  </strong>

                  <div className="application-interview-round-meta">
                    <span
                      className={`application-round-status ${getStatusClass(
                        round.status,
                      )}`}
                    >
                      {round.status || "Pending"}
                    </span>

                    <span className="application-interview-round-date">
                      {formatDate(round.date)}
                    </span>
                  </div>
                </div>

                <div className="application-interview-round-actions">
                  <button
                    type="button"
                    className="application-round-action"
                    aria-label={`Edit ${round.title}`}
                    onClick={() => openEditDialog(round)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="application-round-action application-round-action-danger"
                    aria-label={`Delete ${round.title}`}
                    onClick={() => openDeleteDialog(round)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ADD INTERVIEW ROUND */}

      <FormDialog
        isOpen={showAddDialog}
        title="Add Interview Round"
        onClose={closeAddDialog}
        footer={
          <>
            <button
              type="button"
              className="application-action-secondary"
              onClick={closeAddDialog}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="button"
              className="application-action-primary"
              onClick={handleAddRound}
              disabled={saving}
            >
              {saving ? "Adding..." : "Add Round"}
            </button>
          </>
        }
      >
        <div className="interview-form-fields">
          <div className="interview-form-field">
            <label htmlFor="add-round-title">Round Name</label>

            <input
              id="add-round-title"
              type="text"
              placeholder="e.g. Technical Interview"
              value={roundTitle}
              onChange={(e) => setRoundTitle(e.target.value)}
            />
          </div>

          <div className="interview-form-field">
            <label htmlFor="add-round-status">Status</label>

            <select
              id="add-round-status"
              value={roundStatus}
              onChange={(e) => setRoundStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div className="interview-form-field">
            <label htmlFor="add-round-date">Interview Date</label>

            <input
              id="add-round-date"
              type="date"
              value={roundDate}
              onChange={(e) => setRoundDate(e.target.value)}
            />
          </div>

          {errorMsg && (
            <p className="interview-form-error" role="alert">
              {errorMsg}
            </p>
          )}
        </div>
      </FormDialog>

      {/* EDIT INTERVIEW ROUND */}

      <FormDialog
        isOpen={showEditDialog}
        title={
          selectedRound ? `Edit ${selectedRound.title}` : "Edit Interview Round"
        }
        onClose={closeEditDialog}
        footer={
          <>
            <button
              type="button"
              className="application-action-secondary"
              onClick={closeEditDialog}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="button"
              className="application-action-primary"
              onClick={handleUpdateRound}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </>
        }
      >
        <div className="interview-form-fields">
          <div className="interview-form-field">
            <label htmlFor="edit-round-title">Round Name</label>

            <input
              id="edit-round-title"
              type="text"
              placeholder="e.g. Technical Interview"
              value={roundTitle}
              onChange={(e) => setRoundTitle(e.target.value)}
            />
          </div>

          <div className="interview-form-field">
            <label htmlFor="edit-round-status">Status</label>

            <select
              id="edit-round-status"
              value={roundStatus}
              onChange={(e) => setRoundStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div className="interview-form-field">
            <label htmlFor="edit-round-date">Interview Date</label>

            <input
              id="edit-round-date"
              type="date"
              value={roundDate}
              onChange={(e) => setRoundDate(e.target.value)}
            />
          </div>

          {errorMsg && (
            <p className="interview-form-error" role="alert">
              {errorMsg}
            </p>
          )}
        </div>
      </FormDialog>

      {/* DELETE INTERVIEW ROUND */}

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Interview Round"
        message={
          selectedRound
            ? `Are you sure you want to delete "${selectedRound.title}"? This action cannot be undone.`
            : "Are you sure you want to delete this interview round?"
        }
        onConfirm={handleDeleteRound}
        onCancel={closeDeleteDialog}
      />
    </>
  );
}

export default ApplicationInterviews;
