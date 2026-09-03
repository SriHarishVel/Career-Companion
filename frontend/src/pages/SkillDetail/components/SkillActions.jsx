import { useState } from "react";

import { updateSkill } from "../../../services/skillService";

import FormDialog from "../../../components/FormDialog";

function SkillActions({
  skill,
  goals = [],
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

  /* Open Edit */

  const handleOpenEdit = () => {
    setEditForm({
      name: skill.name || "",
      category: skill.category || "",
      secondaryGoal: skill.secondaryGoal?._id || "",
      learningAreas: (skill.learningAreas || []).map((area) => ({
        name: area.name || "",
        completed: Boolean(area.completed),
      })),
      practicalRequirements: (skill.practicalRequirements || []).map(
        (requirement) => ({
          title: requirement.title || "",
          completed: Boolean(requirement.completed),
        }),
      ),
    });

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

  /* Form Change */

  const handleChange = (field, value) => {
    setEditForm((previous) => ({
      ...previous,
      [field]: value,
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

    setError("");
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

    setError("");
  };

  const handleRemoveLearningArea = (index) => {
    setEditForm((previous) => ({
      ...previous,
      learningAreas: previous.learningAreas.filter(
        (_, areaIndex) => areaIndex !== index,
      ),
    }));

    setError("");
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

    setError("");
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

    setError("");
  };

  const handleRemovePracticalRequirement = (index) => {
    setEditForm((previous) => ({
      ...previous,
      practicalRequirements: previous.practicalRequirements.filter(
        (_, requirementIndex) => requirementIndex !== index,
      ),
    }));

    setError("");
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

      if (onSkillUpdated) {
        await onSkillUpdated(updatedSkill);
      }

      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update skill:", error);

      setError(error.response?.data?.message || "Failed to update skill.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <section className="skill-detail-actions">
        <div className="skill-detail-actions-main">
          <button
            type="button"
            className="skill-action-secondary"
            onClick={handleOpenEdit}
            disabled={saving}
          >
            Edit Skill
          </button>

          <button
            type="button"
            className="skill-action-secondary"
            onClick={onAddResource}
            disabled={saving}
          >
            Add Resource
          </button>
          <button
            type="button"
            className="skill-action-danger"
            onClick={onDelete}
            disabled={deleting || saving}
          >
            {deleting ? "Deleting..." : "Delete Skill"}
          </button>
        </div>
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
              disabled={saving}
              required
            />
          </div>

          <div className="skill-edit-field">
            <label htmlFor="edit-skill-category">Category</label>

            <select
              id="edit-skill-category"
              value={editForm.category}
              onChange={(event) => handleChange("category", event.target.value)}
              disabled={saving}
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
              disabled={saving}
            >
              <option value="">No Related Goal</option>

              {goals.map((goal) => (
                <option key={goal._id} value={goal._id}>
                  {goal.title}
                </option>
              ))}
            </select>
          </div>

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
