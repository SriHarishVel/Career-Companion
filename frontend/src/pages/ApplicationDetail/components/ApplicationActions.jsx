import { useState } from "react";

import { updateApplication } from "../../../services/applicationService";

import FormDialog from "../../../components/FormDialog";
import ConfirmModal from "../../../components/ConfirmModal";

function ApplicationActions({
  application,
  onApplicationUpdated,
  onDelete,
  deleting,
}) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [company, setCompany] = useState(application.company || "");
  const [role, setRole] = useState(application.role || "");
  const [applicationUrl, setApplicationUrl] = useState(
    application.applicationUrl || "",
  );
  const [status, setStatus] = useState(application.status || "Applied");
  const [primaryGoalId, setPrimaryGoalId] = useState(
    application.primaryGoal?._id || "",
  );
  const [appliedDate, setAppliedDate] = useState(
    application.appliedDate
      ? new Date(application.appliedDate).toISOString().split("T")[0]
      : "",
  );

  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);

  function openEditModal() {
    setCompany(application.company || "");
    setRole(application.role || "");
    setApplicationUrl(application.applicationUrl || "");
    setStatus(application.status || "Applied");
    setPrimaryGoalId(application.primaryGoal?._id || "");

    setAppliedDate(
      application.appliedDate
        ? new Date(application.appliedDate).toISOString().split("T")[0]
        : "",
    );

    setErrorMsg("");
    setShowEditModal(true);
  }

  function closeEditModal() {
    if (saving) {
      return;
    }

    setShowEditModal(false);
    setErrorMsg("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) {
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");

      const updatedApplication = await updateApplication(application._id, {
        company: company.trim(),
        role: role.trim(),
        applicationUrl: applicationUrl.trim(),
        status,
        primaryGoal: primaryGoalId || null,
        appliedDate: appliedDate || null,
      });

      onApplicationUpdated(updatedApplication);

      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update application:", error);

      setErrorMsg(
        error.response?.data?.message || "Failed to update application.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="application-detail-actions">
        <button
          type="button"
          className="application-action-secondary"
          onClick={openEditModal}
          disabled={deleting}
        >
          Edit Application
        </button>

        <button
          type="button"
          className="application-action-danger"
          onClick={() => setShowDeleteModal(true)}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete Application"}
        </button>
      </div>

      <FormDialog
        isOpen={showEditModal}
        title="Edit Application"
        onClose={closeEditModal}
        footer={
          <>
            <button
              type="submit"
              form="application-detail-edit-form"
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
          id="application-detail-edit-form"
          className="application-edit-form"
          onSubmit={handleSubmit}
        >
          <div className="filter-group">
            <label htmlFor="application-edit-company">Company</label>

            <input
              id="application-edit-company"
              type="text"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              required
            />
          </div>

          <div className="filter-group">
            <label htmlFor="application-edit-role">Role</label>

            <input
              id="application-edit-role"
              type="text"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              required
            />
          </div>

          <div className="filter-group">
            <label htmlFor="application-edit-url">Application URL</label>

            <input
              id="application-edit-url"
              type="url"
              placeholder="https://..."
              value={applicationUrl}
              onChange={(event) => setApplicationUrl(event.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="application-edit-status">Status</label>

            <select
              id="application-edit-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="Applied">Applied</option>
              <option value="In Progress">In Progress</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="application-edit-goal">
              Career Goal
              <span className="optional-label">Optional</span>
            </label>

            <select
              id="application-edit-goal"
              value={primaryGoalId}
              onChange={(event) => setPrimaryGoalId(event.target.value)}
            >
              <option value="">No Career Goal</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="application-edit-date">Applied Date</label>

            <input
              id="application-edit-date"
              type="date"
              value={appliedDate}
              onChange={(event) => setAppliedDate(event.target.value)}
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
        title="Delete Application"
        message={`Are you sure you want to delete the application for "${application.role}" at "${application.company}"? This action cannot be undone.`}
        onConfirm={onDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}

export default ApplicationActions;
