import { useState } from "react";

import { updateSkill } from "../../../services/skillService";
import { updateResource } from "../../../services/resourceService";

import FormDialog from "../../../components/FormDialog";

function SkillActions({
  skill,
  goals = [],
  resources = [],
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
    learningAreas: skill.learningAreas || [],
    practicalRequirements: skill.practicalRequirements || [],
  });

  const [resourceUrls, setResourceUrls] = useState({});

  /* Open Edit */

  const handleOpenEdit = () => {
    setEditForm({
      name: skill.name || "",
      category: skill.category || "",
      secondaryGoal: skill.secondaryGoal?._id || "",
      learningAreas: skill.learningAreas || [],
      practicalRequirements: skill.practicalRequirements || [],
    });

    const urls = {};

    resources.forEach((resource) => {
      urls[resource._id] = resource.url || "";
    });

    setResourceUrls(urls);
    setError("");
    setShowEditModal(true);
  };

  /* Close Edit */

  const handleCloseEdit = () => {
    if (saving) {
      return;
    }

    setError("");
    setShowEditModal(false);
  };

  /* General Form Change */

  const handleChange = (field, value) => {
    setEditForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  /* Resource URL */

  const handleResourceUrlChange = (resourceId, value) => {
    setResourceUrls((previous) => ({
      ...previous,
      [resourceId]: value,
    }));

    setError("");
  };

  /* Learning Areas */

  const handleLearningAreaChange = (index, value) => {
    setEditForm((previous) => ({
      ...previous,
      learningAreas: previous.learningAreas.map((area, areaIndex) =>
        areaIndex === index
          ? {
              ...area,
              name: value,
            }
          : area,
      ),
    }));

    setError("");
  };

  const handleLearningAreaStatusChange = (index) => {
    setEditForm((previous) => ({
      ...previous,
      learningAreas: previous.learningAreas.map((area, areaIndex) =>
        areaIndex === index
          ? {
              ...area,
              completed: !area.completed,
            }
          : area,
      ),
    }));
  };

  const handleAddLearningArea = () => {
    setEditForm((previous) => ({
      ...previous,
      learningAreas: [
        ...previous.learningAreas,
        {
          name: "",
          completed: false,
        },
      ],
    }));
  };

  const handleRemoveLearningArea = (index) => {
    setEditForm((previous) => ({
      ...previous,
      learningAreas: previous.learningAreas.filter(
        (_, areaIndex) => areaIndex !== index,
      ),
    }));
  };

  /* Practical Requirements */

  const handlePracticalRequirementChange = (index, value) => {
    setEditForm((previous) => ({
      ...previous,
      practicalRequirements: previous.practicalRequirements.map(
        (requirement, requirementIndex) =>
          requirementIndex === index
            ? {
                ...requirement,
                title: value,
              }
            : requirement,
      ),
    }));

    setError("");
  };

  const handlePracticalRequirementStatusChange = (index) => {
    setEditForm((previous) => ({
      ...previous,
      practicalRequirements: previous.practicalRequirements.map(
        (requirement, requirementIndex) =>
          requirementIndex === index
            ? {
                ...requirement,
                completed: !requirement.completed,
              }
            : requirement,
      ),
    }));
  };

  const handleAddPracticalRequirement = () => {
    setEditForm((previous) => ({
      ...previous,
      practicalRequirements: [
        ...previous.practicalRequirements,
        {
          title: "",
          completed: false,
        },
      ],
    }));
  };

  const handleRemovePracticalRequirement = (index) => {
    setEditForm((previous) => ({
      ...previous,
      practicalRequirements: previous.practicalRequirements.filter(
        (_, requirementIndex) => requirementIndex !== index,
      ),
    }));
  };

  /* Save */

  const handleSave = async (event) => {
    event.preventDefault();

    const name = editForm.name.trim();

    if (!name) {
      setError("Skill name is required.");
      return;
    }

    const learningAreas = editForm.learningAreas
      .map((area) => ({
        name: area.name.trim(),
        completed: Boolean(area.completed),
      }))
      .filter((area) => area.name);

    const practicalRequirements = editForm.practicalRequirements
      .map((requirement) => ({
        title: requirement.title.trim(),
        completed: Boolean(requirement.completed),
      }))
      .filter((requirement) => requirement.title);

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
        name,
        category: editForm.category,
        secondaryGoal: editForm.secondaryGoal || null,
        learningAreas,
        practicalRequirements,
      });

      for (const resource of resources) {
        const url = (resourceUrls[resource._id] || "").trim();

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
      {/* Skill Actions */}

      <section className="skill-detail-actions">
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

      {/* Edit Skill Dialog */}

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
          {/* Basic Skill Information */}

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

          {/* Learning Areas */}

          <div className="skill-edit-requirements">
            <div className="skill-edit-requirements-header">
              <div>
                <label>Learning Areas</label>

                <small>
                  Areas you want to cover while developing this skill.
                </small>
              </div>

              <button
                type="button"
                className="skill-add-item-btn"
                onClick={handleAddLearningArea}
                disabled={saving}
              >
                + Add Area
              </button>
            </div>

            {editForm.learningAreas.length > 0 ? (
              <div className="skill-edit-requirements-list">
                {editForm.learningAreas.map((area, index) => (
                  <div key={index} className="skill-edit-requirement-row">
                    <input
                      type="text"
                      value={area.name}
                      placeholder="e.g. React Hooks"
                      onChange={(event) =>
                        handleLearningAreaChange(index, event.target.value)
                      }
                      disabled={saving}
                    />

                    <button
                      type="button"
                      className={`skill-requirement-status ${
                        area.completed ? "completed" : ""
                      }`}
                      onClick={() => handleLearningAreaStatusChange(index)}
                      disabled={saving}
                    >
                      {area.completed ? "Covered" : "Not Covered"}
                    </button>

                    <button
                      type="button"
                      className="skill-remove-item-btn"
                      onClick={() => handleRemoveLearningArea(index)}
                      disabled={saving}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="skill-edit-requirements-empty">
                No learning areas added.
              </p>
            )}
          </div>

          {/* Practical Development */}

          <div className="skill-edit-requirements">
            <div className="skill-edit-requirements-header">
              <div>
                <label>Practical Development</label>

                <small>
                  Practical work that supports development of this skill.
                </small>
              </div>

              <button
                type="button"
                className="skill-add-item-btn"
                onClick={handleAddPracticalRequirement}
                disabled={saving}
              >
                + Add Requirement
              </button>
            </div>

            {editForm.practicalRequirements.length > 0 ? (
              <div className="skill-edit-requirements-list">
                {editForm.practicalRequirements.map((requirement, index) => (
                  <div key={index} className="skill-edit-requirement-row">
                    <input
                      type="text"
                      value={requirement.title}
                      placeholder="e.g. Build a React project"
                      onChange={(event) =>
                        handlePracticalRequirementChange(
                          index,
                          event.target.value,
                        )
                      }
                      disabled={saving}
                    />

                    <button
                      type="button"
                      className={`skill-requirement-status ${
                        requirement.completed ? "completed" : ""
                      }`}
                      onClick={() =>
                        handlePracticalRequirementStatusChange(index)
                      }
                      disabled={saving}
                    >
                      {requirement.completed ? "Completed" : "Not Completed"}
                    </button>

                    <button
                      type="button"
                      className="skill-remove-item-btn"
                      onClick={() => handleRemovePracticalRequirement(index)}
                      disabled={saving}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="skill-edit-requirements-empty">
                No practical requirements added.
              </p>
            )}
          </div>

          {/* Learning Resources */}

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
                    type="text"
                    value={resourceUrls[resource._id] || ""}
                    onChange={(event) =>
                      handleResourceUrlChange(resource._id, event.target.value)
                    }
                    placeholder="https://..."
                    disabled={saving}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Error */}

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
