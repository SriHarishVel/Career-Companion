import { useState } from "react";

const SKILL_CATEGORIES = [
  "Programming",
  "Database",
  "Framework",
  "Tools",
  "Soft Skills",
  "Other",
];

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced"];

const IMPORTANCE_LEVELS = ["High", "Medium", "Low"];

const createEmptyRequirement = () => ({
  skillName: "",
  category: "Other",
  requiredLevel: "Intermediate",
  importance: "Medium",
});

function TargetRoleForm({ onSubmit, onClose, saving = false }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState([createEmptyRequirement()]);
  const [errorMsg, setErrorMsg] = useState("");

  function updateRequirement(index, field, value) {
    setRequirements((current) =>
      current.map((requirement, i) =>
        i === index ? { ...requirement, [field]: value } : requirement,
      ),
    );
  }

  function addRequirement() {
    setRequirements((current) => [...current, createEmptyRequirement()]);
  }

  function removeRequirement(index) {
    setRequirements((current) => current.filter((_, i) => i !== index));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const normalizedRequirements = requirements.map((requirement) => ({
      ...requirement,
      skillName: requirement.skillName.trim(),
    }));

    if (!title.trim()) {
      setErrorMsg("Role title is required.");
      return;
    }

    if (normalizedRequirements.some((item) => !item.skillName)) {
      setErrorMsg("Enter a skill name for every requirement.");
      return;
    }

    const skillNames = normalizedRequirements.map((item) =>
      item.skillName.toLowerCase(),
    );

    if (new Set(skillNames).size !== skillNames.length) {
      setErrorMsg("Each skill can only be added once per role.");
      return;
    }

    setErrorMsg("");

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        requirements: normalizedRequirements,
      });
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message ||
          "Unable to save the target role. Please try again.",
      );
    }
  }

  return (
    <section className="target-role-form-section">
      <div className="target-role-form-header">
        <h2>Add Target Role</h2>

        <button
          type="button"
          className="btn-ghost"
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </button>
      </div>

      <form className="target-role-form" onSubmit={handleSubmit}>
        <div className="target-role-form-field">
          <label htmlFor="target-role-title">Role title</label>
          <input
            id="target-role-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Frontend Developer"
            maxLength={120}
            required
          />
        </div>

        <div className="target-role-form-field">
          <label htmlFor="target-role-description">Description</label>
          <textarea
            id="target-role-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Optional description of your career goal"
            rows={3}
          />
        </div>

        <div className="target-role-requirements">
          <div className="target-role-requirements-header">
            <div>
              <h3>Required skills</h3>
              <p>Define the proficiency expected for each skill.</p>
            </div>

            <button
              type="button"
              className="btn-secondary"
              onClick={addRequirement}
              disabled={saving}
            >
              + Add Skill
            </button>
          </div>

          {requirements.map((requirement, index) => (
            <div className="target-role-requirement" key={index}>
              <div className="target-role-form-field">
                <label htmlFor={`requirement-name-${index}`}>Skill name</label>
                <input
                  id={`requirement-name-${index}`}
                  type="text"
                  value={requirement.skillName}
                  onChange={(event) =>
                    updateRequirement(index, "skillName", event.target.value)
                  }
                  placeholder="e.g. React"
                  required
                />
              </div>

              <div className="target-role-requirement-fields">
                <div className="target-role-form-field">
                  <label htmlFor={`requirement-category-${index}`}>
                    Category
                  </label>
                  <select
                    id={`requirement-category-${index}`}
                    value={requirement.category}
                    onChange={(event) =>
                      updateRequirement(index, "category", event.target.value)
                    }
                  >
                    {SKILL_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="target-role-form-field">
                  <label htmlFor={`requirement-level-${index}`}>
                    Required level
                  </label>
                  <select
                    id={`requirement-level-${index}`}
                    value={requirement.requiredLevel}
                    onChange={(event) =>
                      updateRequirement(
                        index,
                        "requiredLevel",
                        event.target.value,
                      )
                    }
                  >
                    {SKILL_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="target-role-form-field">
                  <label htmlFor={`requirement-importance-${index}`}>
                    Importance
                  </label>
                  <select
                    id={`requirement-importance-${index}`}
                    value={requirement.importance}
                    onChange={(event) =>
                      updateRequirement(index, "importance", event.target.value)
                    }
                  >
                    {IMPORTANCE_LEVELS.map((importance) => (
                      <option key={importance} value={importance}>
                        {importance}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {requirements.length > 1 && (
                <button
                  type="button"
                  className="btn-danger-outline"
                  onClick={() => removeRequirement(index)}
                  disabled={saving}
                >
                  Remove Skill
                </button>
              )}
            </div>
          ))}
        </div>

        {errorMsg && (
          <div className="target-role-error" role="alert">
            {errorMsg}
          </div>
        )}

        <div className="target-role-form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Create Target Role"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default TargetRoleForm;