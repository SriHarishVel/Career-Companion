import { useState } from "react";
import { updateSkill } from "../../../services/skillService";
import { updateResource } from "../../../services/resourceService";

import FormDialog from "../../../components/FormDialog";

function SkillActions({
  skill,
  goals = [],
  resources = [],
  onUpdateProgress,
  onAddResource,
  onDelete,
  deleting,
  onSkillUpdated,
}) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [editForm, setEditForm] = useState({
    name: skill.name || "",
    category: skill.category || "",
    secondaryGoal: skill.secondaryGoal?._id || "",
  });

  const [resourceUrls, setResourceUrls] = useState({});

  const progress = Number(skill.progress) || 0;
  const progressComplete = progress >= 100;

  const handleOpenEdit = () => {
    setEditForm({
      name: skill.name || "",
      category: skill.category || "",
      secondaryGoal: skill.secondaryGoal?._id || "",
    });

    const urls = {};

    resources.forEach((resource) => {
      urls[resource._id] = resource.url || "";
    });

    setResourceUrls(urls);
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
  };

  const handleResourceUrlChange = (resourceId, value) => {
    setResourceUrls((previous) => ({
      ...previous,
      [resourceId]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!editForm.name.trim()) {
      setError("Skill name is required.");
      return;
    }

    for (const resource of resources) {
      const url = (resourceUrls[resource._id] || "").trim();

      if (!url) {
        setError(`URL is required for "${resource.title}".`);
        return;
      }
    }

    try {
      setSaving(true);
      setError("");

      const updatedSkill = await updateSkill(skill._id, {
        name: editForm.name.trim(),
        category: editForm.category,
        secondaryGoal: editForm.secondaryGoal || null,
      });

      for (const resource of resources) {
        const url = resourceUrls[resource._id].trim();

        const formattedUrl = url.startsWith("http") ? url : `https://${url}`;

        if (formattedUrl !== resource.url) {
          await updateResource(resource._id, {
            url: formattedUrl,
          });
        }
      }

      if (onSkillUpdated) {
        await onSkillUpdated(updatedSkill);
      }

      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update skill:", error);

      setError(
        error.response?.data?.message || "Failed to update skill and resource.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <section className="skill-detail-actions">
        <button
          type="button"
          className="skill-action-primary"
          onClick={onUpdateProgress}
          disabled={progressComplete}
        >
          {progressComplete ? "Progress Complete" : "Update Progress"}
        </button>

        <button
          type="button"
          className="skill-action-secondary"
          onClick={handleOpenEdit}
        >
          Edit Skill
        </button>

        <button
          type="button"
          className="skill-action-secondary"
          onClick={onAddResource}
        >
          Add Resource
        </button>

        <button
          type="button"
          className="skill-action-danger"
          onClick={onDelete}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete Skill"}
        </button>
      </section>

      <FormDialog
        isOpen={showEditModal}
        title={`Edit ${skill.name}`}
        onClose={handleCloseEdit}
        footer={
          <>
            <button
              type="button"
              className="skill-action-secondary"
              onClick={handleCloseEdit}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              form="edit-skill-form"
              className="skill-action-primary"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </>
        }
      >
        <form
          id="edit-skill-form"
          className="skill-edit-form"
          onSubmit={handleSave}
        >
          <div className="skill-edit-field">
            <label htmlFor="edit-skill-name">Skill Name</label>

            <input
              id="edit-skill-name"
              type="text"
              value={editForm.name}
              onChange={(event) => handleChange("name", event.target.value)}
              required
            />
          </div>

          <div className="skill-edit-field">
            <label htmlFor="edit-skill-category">Category</label>

            <select
              id="edit-skill-category"
              value={editForm.category}
              onChange={(event) => handleChange("category", event.target.value)}
            >
              <option value="">Select category</option>
              <option value="Programming">Programming</option>
              <option value="Database">Database</option>
              <option value="Framework">Framework</option>
              <option value="Tools">Tools</option>
              <option value="Soft Skills">Soft Skills</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="skill-edit-field">
            <label htmlFor="edit-skill-goal">
              Related Goal
              <span className="optional-label">Optional</span>
            </label>

            <select
              id="edit-skill-goal"
              value={editForm.secondaryGoal}
              onChange={(event) =>
                handleChange("secondaryGoal", event.target.value)
              }
            >
              <option value="">No Related Goal</option>

              {goals.map((goal) => (
                <option key={goal._id} value={goal._id}>
                  {goal.title}
                </option>
              ))}
            </select>
          </div>

          {resources.length > 0 && (
            <div className="skill-edit-resources">
              <div className="skill-edit-resources-header">
                <label>Learning Resources</label>
                <span>URL only</span>
              </div>

              {resources.map((resource) => (
                <div key={resource._id} className="skill-edit-resource">
                  <strong>{resource.title}</strong>

                  <input
                    type="url"
                    value={resourceUrls[resource._id] || ""}
                    onChange={(event) =>
                      handleResourceUrlChange(resource._id, event.target.value)
                    }
                    placeholder="https://..."
                  />
                </div>
              ))}
            </div>
          )}

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
        </form>
      </FormDialog>
    </>
  );
}

export default SkillActions;
