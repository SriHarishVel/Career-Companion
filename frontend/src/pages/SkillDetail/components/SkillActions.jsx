import { useState } from "react";
import { updateSkill } from "../../../services/skillService";

function SkillActions({ skill, goals, onSkillUpdated, onDelete, deleting }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [editForm, setEditForm] = useState({
    name: skill.name || "",
    category: skill.category || "",
    level: skill.level || "",
    secondaryGoal: skill.secondaryGoal?._id || "",
  });

  const handleOpenEdit = () => {
    setError("");

    setEditForm({
      name: skill.name || "",
      category: skill.category || "",
      level: skill.level || "",
      secondaryGoal: skill.secondaryGoal?._id || "",
    });

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

  const handleSave = async (event) => {
    event.preventDefault();

    if (!editForm.name.trim()) {
      setError("Skill name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const updatedSkill = await updateSkill(skill._id, {
        name: editForm.name.trim(),
        category: editForm.category,
        level: editForm.level,
        secondaryGoal: editForm.secondaryGoal || null,
      });

      onSkillUpdated(updatedSkill);

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
        <button
          className="skill-action-primary"
          onClick={() => {
            const currentProgress = Number(skill.progress) || 0;

            if (currentProgress >= 100) {
              return;
            }

            const newProgress = Math.min(currentProgress + 10, 100);

            onSkillUpdated({
              ...skill,
              progress: newProgress,
            });
          }}
          disabled={(Number(skill.progress) || 0) >= 100}
        >
          {(Number(skill.progress) || 0) >= 100
            ? "Progress Complete"
            : "Update Progress"}
        </button>

        <button className="skill-action-secondary" onClick={handleOpenEdit}>
          Edit Skill
        </button>

        <button
          className="skill-action-danger"
          onClick={onDelete}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete Skill"}
        </button>
      </section>

      {showEditModal && (
        <div
          className="skill-edit-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseEdit();
            }
          }}
        >
          <div
            className="skill-edit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="skill-edit-title"
          >
            <div className="skill-edit-modal-header">
              <div>
                <span className="section-label">Edit Skill</span>

                <h2 id="skill-edit-title">Update {skill.name}</h2>

                <p>Change the details of this skill.</p>
              </div>

              <button
                type="button"
                className="skill-edit-close"
                onClick={handleCloseEdit}
                disabled={saving}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form className="skill-edit-form" onSubmit={handleSave}>
              <div className="skill-edit-field skill-edit-field-full">
                <label htmlFor="edit-skill-name">Skill Name</label>

                <input
                  id="edit-skill-name"
                  type="text"
                  value={editForm.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  required
                />
              </div>

              <div className="skill-edit-grid">
                <div className="skill-edit-field">
                  <label htmlFor="edit-skill-category">Category</label>

                  <select
                    id="edit-skill-category"
                    value={editForm.category}
                    onChange={(event) =>
                      handleChange("category", event.target.value)
                    }
                  >
                    <option value="">Select category</option>

                    <option value="Technical">Technical</option>

                    <option value="Soft Skill">Soft Skill</option>

                    <option value="Tools">Tools</option>

                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="skill-edit-field">
                  <label htmlFor="edit-skill-level">Level</label>

                  <select
                    id="edit-skill-level"
                    value={editForm.level}
                    onChange={(event) =>
                      handleChange("level", event.target.value)
                    }
                  >
                    <option value="">Select level</option>

                    <option value="Beginner">Beginner</option>

                    <option value="Intermediate">Intermediate</option>

                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="skill-edit-field">
                  <label htmlFor="edit-skill-goal">Supporting Goal</label>

                  <select
                    id="edit-skill-goal"
                    value={editForm.secondaryGoal}
                    onChange={(event) =>
                      handleChange("secondaryGoal", event.target.value)
                    }
                  >
                    <option value="">No supporting goal</option>

                    {goals.map((goal) => (
                      <option key={goal._id} value={goal._id}>
                        {goal.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && <div className="skill-edit-form-error">{error}</div>}

              <div className="skill-edit-modal-footer">
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
                  className="skill-action-primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default SkillActions;
