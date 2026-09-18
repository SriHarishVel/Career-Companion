import { useState } from "react";

import {
  addResourceItem,
  updateResourceItem,
  deleteResourceItem,
} from "../../../services/resourceService";

import { API_BASE_URL } from "../../../api/axios";

import FormDialog from "../../../components/FormDialog";
import ConfirmModal from "../../../components/ConfirmModal";

function ResourcePreview({ resource, onResourceUpdated }) {
  const [showItemModal, setShowItemModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const [itemForm, setItemForm] = useState({
    title: "",
    type: "Course",
    source: "external",
    url: "",
    file: null,
  });

  const items = resource.items || [];
  const formId = `resource-item-form-${resource._id}`;

  const MAX_FILE_SIZE = 100 * 1024 * 1024;

  function resetItemForm() {
    setItemForm({
      title: "",
      type: "Course",
      source: "external",
      url: "",
      file: null,
    });

    setError("");
  }

  function handleOpenAdd() {
    setEditingItem(null);
    resetItemForm();
    setShowItemModal(true);
  }

  function handleOpenEdit(item) {
    setEditingItem(item);

    setItemForm({
      title: item.title || "",
      type: item.type || "Other",
      source: item.source || "external",
      url: item.url || "",
      file: null,
    });

    setError("");
    setShowItemModal(true);
  }

  function handleCloseItemModal() {
    if (saving) {
      return;
    }

    setShowItemModal(false);
    setEditingItem(null);
    resetItemForm();
  }

  function handleChange(field, value) {
    setItemForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  }

  function handleSourceChange(event) {
    const selectedSource = event.target.value;

    setItemForm((previous) => ({
      ...previous,
      source: selectedSource,
      url: selectedSource === "upload" ? "" : previous.url,
      file: selectedSource === "external" ? null : previous.file,
    }));

    setError("");
  }

  function handleFileChange(event) {
    const selectedFile = event.target.files[0] || null;

    if (!selectedFile) {
      setItemForm((previous) => ({
        ...previous,
        file: null,
      }));

      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      event.target.value = "";

      setItemForm((previous) => ({
        ...previous,
        file: null,
      }));

      setError("File size cannot exceed 100 MB.");
      return;
    }

    setItemForm((previous) => ({
      ...previous,
      file: selectedFile,
    }));

    setError("");
  }

  async function handleSave(event) {
    event.preventDefault();

    const title = itemForm.title.trim();

    if (!title) {
      setError("Resource item title is required.");
      return;
    }

    if (itemForm.source === "external" && !itemForm.url.trim()) {
      setError("Resource item URL is required.");
      return;
    }

    if (itemForm.source === "upload" && !editingItem && !itemForm.file) {
      setError("Please select a file.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const formData = new FormData();

      formData.append("title", title);
      formData.append("type", itemForm.type);

      if (itemForm.source === "external") {
        const formattedUrl = itemForm.url.trim().startsWith("http")
          ? itemForm.url.trim()
          : `https://${itemForm.url.trim()}`;

        formData.append("url", formattedUrl);
      } else if (itemForm.file) {
        formData.append("file", itemForm.file);
      }

      let updatedResource;

      if (editingItem) {
        updatedResource = await updateResourceItem(
          resource._id,
          editingItem._id,
          formData,
        );
      } else {
        updatedResource = await addResourceItem(resource._id, formData);
      }

      await onResourceUpdated(updatedResource);

      handleCloseItemModal();
    } catch (error) {
      console.error("Failed to save resource item:", error);

      setError(
        error.response?.data?.message ||
          "Unable to save the resource item. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleOpenDelete(item) {
    setDeletingItem(item);
    setShowDeleteModal(true);
  }

  function handleCancelDelete() {
    if (deleting) {
      return;
    }

    setDeletingItem(null);
    setShowDeleteModal(false);
  }

  async function handleConfirmDelete() {
    if (!deletingItem || deleting) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const updatedResource = await deleteResourceItem(
        resource._id,
        deletingItem._id,
      );

      await onResourceUpdated(updatedResource);

      setDeletingItem(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete resource item:", error);

      setError(
        error.response?.data?.message ||
          "Unable to delete the resource item. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggleCompleted(item) {
    try {
      setError("");

      const formData = new FormData();

      formData.append("completed", !item.completed);

      const updatedResource = await updateResourceItem(
        resource._id,
        item._id,
        formData,
      );

      await onResourceUpdated(updatedResource);
    } catch (error) {
      console.error("Failed to update resource item:", error);

      setError(
        error.response?.data?.message ||
          "Unable to update the resource item. Please try again.",
      );
    }
  }

  function getItemUrl(item) {
    if (item.source === "upload" && item.file?.filename) {
      return `${API_BASE_URL}/uploads/resources/${item.file.filename}`;
    }

    return item.url;
  }

  return (
    <>
      <section className="resource-items">
        <div className="resource-items-header">
          <div>
            <h2>Resource Items</h2>

            <p>
              {items.length} {items.length === 1 ? "item" : "items"} in this
              resource.
            </p>
          </div>

          <button type="button" className="btn-primary" onClick={handleOpenAdd}>
            Add Item
          </button>
        </div>

        {error && (
          <div className="resource-items-error" role="alert">
            {error}
          </div>
        )}

        {items.length === 0 ? (
          <div className="resource-items-empty">
            <p>No items have been added yet.</p>

            <button
              type="button"
              className="btn-secondary"
              onClick={handleOpenAdd}
            >
              Add First Item
            </button>
          </div>
        ) : (
          <div className="resource-items-list">
            {items.map((item) => {
              const itemUrl = getItemUrl(item);

              return (
                <article
                  className={`resource-item ${
                    item.completed ? "completed" : ""
                  }`}
                  key={item._id}
                >
                  <div className="resource-item-content">
                    <div className="resource-item-header">
                      <div>
                        <div className="resource-item-badges">
                          <span className="resource-item-type">
                            {item.type}
                          </span>

                          <span className="resource-item-source">
                            {item.source === "upload" ? "Uploaded" : "External"}
                          </span>

                          {item.completed && (
                            <span className="resource-item-completed">
                              Completed
                            </span>
                          )}
                        </div>

                        <h3>{item.title}</h3>
                      </div>
                    </div>

                    <div className="resource-item-meta">
                      {item.source === "upload" && item.file?.originalName && (
                        <span>{item.file.originalName}</span>
                      )}

                      {item.source === "external" && item.url && (
                        <span>{item.url}</span>
                      )}
                    </div>
                  </div>

                  <div className="resource-item-actions">
                    <button
                      type="button"
                      className={
                        item.completed ? "btn-success" : "btn-secondary"
                      }
                      onClick={() => handleToggleCompleted(item)}
                    >
                      {item.completed ? "Mark Unfinished" : "Mark Completed"}
                    </button>

                    {itemUrl && (
                      <a
                        href={itemUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                      >
                        Open
                      </a>
                    )}

                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => handleOpenEdit(item)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => handleOpenDelete(item)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <FormDialog
        isOpen={showItemModal}
        title={editingItem ? "Edit Resource Item" : "Add Resource Item"}
        onClose={handleCloseItemModal}
        footer={
          <>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCloseItemModal}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              form={formId}
              className="btn-primary"
              disabled={saving}
            >
              {saving ? "Saving..." : editingItem ? "Save Changes" : "Add Item"}
            </button>
          </>
        }
      >
        <form id={formId} className="resource-item-form" onSubmit={handleSave}>
          <div className="filter-group">
            <label htmlFor={`${formId}-title`}>Item Title</label>

            <input
              id={`${formId}-title`}
              type="text"
              value={itemForm.title}
              onChange={(event) => handleChange("title", event.target.value)}
              placeholder="e.g. React Hooks Tutorial"
              required
            />
          </div>

          <div className="filter-group">
            <label htmlFor={`${formId}-type`}>Item Type</label>

            <select
              id={`${formId}-type`}
              value={itemForm.type}
              onChange={(event) => handleChange("type", event.target.value)}
            >
              <option value="Documentation">Documentation</option>
              <option value="Course">Course</option>
              <option value="Video">Video</option>
              <option value="Audio">Audio</option>
              <option value="Article">Article</option>
              <option value="Book">Book</option>
              <option value="Practice">Practice</option>
              <option value="PDF">PDF</option>
              <option value="Image">Image</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor={`${formId}-source`}>Item Source</label>

            <select
              id={`${formId}-source`}
              value={itemForm.source}
              onChange={handleSourceChange}
            >
              <option value="external">External URL</option>
              <option value="upload">Upload File</option>
            </select>
          </div>

          {itemForm.source === "external" ? (
            <div className="filter-group">
              <label htmlFor={`${formId}-url`}>Item URL</label>

              <input
                id={`${formId}-url`}
                type="url"
                value={itemForm.url}
                onChange={(event) => handleChange("url", event.target.value)}
                placeholder="https://..."
                required
              />
            </div>
          ) : (
            <div className="filter-group">
              <label htmlFor={`${formId}-file`}>
                {editingItem ? "Replace File" : "Item File"}
              </label>

              <input
                id={`${formId}-file`}
                type="file"
                accept="video/*,audio/*,application/pdf,image/*"
                onChange={handleFileChange}
                required={!editingItem}
              />

              {itemForm.file && (
                <span className="resource-file-name">
                  Selected: {itemForm.file.name}
                </span>
              )}

              {editingItem &&
                !itemForm.file &&
                editingItem.file?.originalName && (
                  <span className="resource-file-name">
                    Current: {editingItem.file.originalName}
                  </span>
                )}

              <small>Maximum file size: 100 MB.</small>
            </div>
          )}

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
        </form>
      </FormDialog>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Resource Item?"
        message={
          deletingItem
            ? `Are you sure you want to delete "${deletingItem.title}"? This action cannot be undone.`
            : "Are you sure you want to delete this resource item?"
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}

export default ResourcePreview;