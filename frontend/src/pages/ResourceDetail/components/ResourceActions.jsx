import { useState } from "react";

import { updateResource } from "../../../services/resourceService";

import FormDialog from "../../../components/FormDialog";
import ConfirmModal from "../../../components/ConfirmModal";

function ResourceActions({
  resource,
  skills = [],
  onResourceUpdated,
  onDelete,
  deleting,
}) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [editForm, setEditForm] = useState({
    title: resource.title || "",
    type: resource.type || "Other",
    url: resource.url || "",
    skillId: resource.skill?._id || "",
  });

  const formId = `edit-resource-form-${resource._id}`;

  /* EDIT */

  const handleOpenEdit = () => {
    setEditForm({
      title: resource.title || "",
      type: resource.type || "Other",
      url: resource.url || "",
      skillId: resource.skill?._id || "",
    });

    setError("");
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    if (saving) {
      return;
    }

    setError("");
    setShowEditModal(false);
  };

  const handleChange = (field, value) => {
    setEditForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const title = editForm.title.trim();
    const url = editForm.url.trim();

    if (!title) {
      setError("Resource title cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const formattedUrl = url
        ? url.startsWith("http")
          ? url
          : `https://${url}`
        : "";

      const updatedResource = await updateResource(resource._id, {
        title,
        type: editForm.type,
        url: formattedUrl,
        skill: editForm.skillId || null,
      });

      if (onResourceUpdated) {
        await onResourceUpdated(updatedResource);
      }

      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update resource:", error);

      setError(
        error.response?.data?.message ||
          "Unable to update the resource. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* DELETE */

  const handleOpenDelete = () => {
    if (deleting) {
      return;
    }

    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    if (deleting) {
      return;
    }

    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    if (deleting) {
      return;
    }

    try {
      await onDelete();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete resource:", error);
    }
  };

  return (
    <>
      {/* RESOURCE ACTIONS */}

      <section className="resource-detail-actions">
        <button
          type="button"
          className="resource-action-secondary"
          onClick={handleOpenEdit}
          disabled={deleting}
        >
          Edit Resource
        </button>

        <button
          type="button"
          className="resource-action-danger"
          onClick={handleOpenDelete}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete Resource"}
        </button>
      </section>

      {/* EDIT MODAL */}

      <FormDialog
        isOpen={showEditModal}
        title={`Edit ${resource.title}`}
        onClose={handleCloseEdit}
        footer={
          <>
            <button
              type="button"
              className="resource-action-secondary"
              onClick={handleCloseEdit}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              form={formId}
              className="resource-action-primary"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </>
        }
      >
        <form id={formId} className="resource-edit-form" onSubmit={handleSave}>
          {/* TITLE */}

          <div className="resource-edit-field">
            <label htmlFor="edit-resource-title">Resource Title</label>

            <input
              id="edit-resource-title"
              type="text"
              value={editForm.title}
              onChange={(event) => handleChange("title", event.target.value)}
              placeholder="Enter resource title"
              required
            />
          </div>

          {/* TYPE */}

          <div className="resource-edit-field">
            <label htmlFor="edit-resource-type">Type</label>

            <select
              id="edit-resource-type"
              value={editForm.type}
              onChange={(event) => handleChange("type", event.target.value)}
            >
              <option value="Course">Course</option>
              <option value="Video">Video</option>
              <option value="Article">Article</option>
              <option value="Book">Book</option>
              <option value="Documentation">Documentation</option>
              <option value="Practice">Practice</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* URL */}

          <div className="resource-edit-field">
            <label htmlFor="edit-resource-url">Resource URL</label>

            <input
              id="edit-resource-url"
              type="url"
              value={editForm.url}
              onChange={(event) => handleChange("url", event.target.value)}
              placeholder="https://... (optional)"
            />

            <small>Leave empty if this resource does not have a URL.</small>
          </div>

          {/* RELATED SKILL */}

          <div className="resource-edit-field">
            <label htmlFor="edit-resource-skill">Related Skill</label>

            <select
              id="edit-resource-skill"
              value={editForm.skillId}
              onChange={(event) => handleChange("skillId", event.target.value)}
            >
              <option value="">No Related Skill</option>

              {skills.map((skill) => (
                <option key={skill._id} value={skill._id}>
                  {skill.name}
                </option>
              ))}
            </select>
          </div>

          {/* ERROR */}

          {error && (
            <div className="resource-edit-form-error" role="alert">
              {error}
            </div>
          )}
        </form>
      </FormDialog>

      {/* DELETE CONFIRMATION */}

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Resource?"
        message={`Are you sure you want to delete "${resource.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}

export default ResourceActions;
