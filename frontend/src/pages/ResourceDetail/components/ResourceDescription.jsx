import { useState } from "react";

function ResourceDescription({ description, onSave }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftDescription, setDraftDescription] = useState(description || "");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const hasDescription = Boolean(description?.trim());

  const trimmedDescription = description?.trim() || "";

  const previewLines = trimmedDescription.split("\n").slice(0, 4);

  const previewText = hasDescription
    ? previewLines.join("\n")
    : "Add notes about what you learned, important points, or anything you want to remember.";

  const hasMoreLines =
    hasDescription && trimmedDescription.split("\n").length > 4;

  const handleOpen = () => {
    setDraftDescription(description || "");
    setIsEditing(false);
    setErrorMsg("");
    setIsOpen(true);
  };

  const handleClose = () => {
    if (saving) {
      return;
    }

    setIsOpen(false);
    setIsEditing(false);
    setErrorMsg("");
    setDraftDescription(description || "");
  };

  const handleEdit = () => {
    setDraftDescription(description || "");
    setErrorMsg("");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (saving) {
      return;
    }

    setDraftDescription(description || "");
    setErrorMsg("");
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (saving) {
      return;
    }

    if (typeof onSave !== "function") {
      setErrorMsg("Unable to save notes. Save functionality is unavailable.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");

      const updatedDescription = draftDescription.trim();

      await onSave(updatedDescription);

      setIsEditing(false);
      setDraftDescription(updatedDescription);
    } catch (error) {
      console.error("Failed to save resource notes:", error);

      setErrorMsg(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to save notes. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <section className="resource-description">
        <div className="resource-section-header">
          <span className="resource-description-label">
            Description / Notes
          </span>

          <h2>Resource Notes</h2>
        </div>

        <button
          type="button"
          className={`resource-notes-preview ${
            hasDescription ? "has-notes" : "empty"
          }`}
          onClick={handleOpen}
          aria-label={
            hasDescription
              ? "View resource notes"
              : "Add notes to this resource"
          }
        >
          <div className="resource-notes-pin" />

          <div className="resource-notes-content">
            <span className="resource-notes-title">
              {hasDescription ? "My Notes" : "No Notes Yet"}
            </span>

            <p className="resource-notes-preview-text">
              {previewText}

              {hasMoreLines && <span className="resource-notes-more">...</span>}
            </p>

            <span className="resource-notes-hint">
              {hasDescription
                ? "Click to view full notes"
                : "Click to add notes"}
            </span>
          </div>

          <span className="resource-notes-arrow" aria-hidden="true">
            ↗
          </span>
        </button>
      </section>

      {isOpen && (
        <div
          className="resource-notes-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleClose();
            }
          }}
        >
          <div
            className="resource-notes-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="resource-notes-modal-title"
          >
            <div className="resource-notes-modal-header">
              <div>
                <span className="resource-description-label">
                  Description / Notes
                </span>

                <h2 id="resource-notes-modal-title">Resource Notes</h2>
              </div>

              <button
                type="button"
                className="resource-notes-close"
                onClick={handleClose}
                disabled={saving}
                aria-label="Close notes"
              >
                ×
              </button>
            </div>

            {isEditing ? (
              <div className="resource-notes-editor">
                <textarea
                  value={draftDescription}
                  onChange={(event) => {
                    setDraftDescription(event.target.value);

                    if (errorMsg) {
                      setErrorMsg("");
                    }
                  }}
                  placeholder="Write your notes here..."
                  disabled={saving}
                  autoFocus
                  aria-label="Resource notes"
                />

                {errorMsg && (
                  <p className="resource-notes-error" role="alert">
                    {errorMsg}
                  </p>
                )}

                <div className="resource-notes-editor-actions">
                  <button
                    type="button"
                    className="resource-notes-cancel"
                    onClick={handleCancelEdit}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="resource-notes-save"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Notes"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="resource-notes-full">
                {hasDescription ? (
                  <p>{description}</p>
                ) : (
                  <div className="resource-notes-empty">
                    <span aria-hidden="true">📝</span>

                    <p>No notes have been added to this resource yet.</p>
                  </div>
                )}

                <div className="resource-notes-modal-actions">
                  <button
                    type="button"
                    className="resource-notes-edit"
                    onClick={handleEdit}
                  >
                    Edit Notes
                  </button>

                  <button
                    type="button"
                    className="resource-notes-close-secondary"
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ResourceDescription;
