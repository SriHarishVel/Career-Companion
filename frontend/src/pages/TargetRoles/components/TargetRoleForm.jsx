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

function getInitialRequirements(role) {
  if (!role?.requirements?.length) {
    return [createEmptyRequirement()];
  }

  return role.requirements.map((requirement) => ({
    skillName: requirement.skillName || "",
    category: requirement.category || "Other",
    requiredLevel: requirement.requiredLevel || "Intermediate",
    importance: requirement.importance || "Medium",
  }));
}

function TargetRoleForm({
  initialRole = null,
  onSubmit,
  onClose,
  saving = false,
}) {
  const isEditing = Boolean(initialRole);

  const [title, setTitle] = useState(() => initialRole?.title || "");
  const [description, setDescription] = useState(
    () => initialRole?.description || "",
  );
  const [requirements, setRequirements] = useState(() =>
    getInitialRequirements(initialRole),
  );
  const [errorMsg, setErrorMsg] = useState("");

  function updateRequirement(index, field, value) {
    setRequirements((current) =>
      current.map((requirement, i) =>
        i === index ? { ...requirement, [field]: value } : requirement,
      ),
    );

    setErrorMsg("");
  }

  function addRequirement() {
    if (saving) return;

    setRequirements((current) => [...current, createEmptyRequirement()]);
    setErrorMsg("");
  }

  function removeRequirement(index) {
    if (saving) return;

    setRequirements((current) => current.filter((_, i) => i !== index));
    setErrorMsg("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) return;

    const normalizedTitle = title.trim();

    const normalizedRequirements = requirements.map((requirement) => ({
      ...requirement,
      skillName: requirement.skillName.trim(),
    }));

    if (!normalizedTitle) {
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
        title: normalizedTitle,
        description: description.trim(),
        requirements: normalizedRequirements,
      });
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message ||
          `Unable to ${isEditing ? "update" : "create"} the target role. Please try again.`,
      );
    }
  }

  return (
    <section className="target-role-form-section">
      <div className="target-role-form-header">
        <h2>{isEditing ? "Edit Target Role" : "Add Target Role"}</h2>

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
            onChange={(event) => {
              setTitle(event.target.value);
              setErrorMsg("");
            }}
            placeholder="e.g. Frontend Developer"
            maxLength={120}
            required
            disabled={saving}
          />
        </div>

        <div className="target-role-form-field">
          <label htmlFor="target-role-description">Description</label>
          <textarea
            id="target-role-description"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
              setErrorMsg("");
            }}
            placeholder="Describe the role you want to qualify for"
            rows={3}
            disabled={saving}
          />
        </div>

        <div className="target-role-requirements">
          <div className="target-role-requirements-header">
            <div>
              <h3>Required skills</h3>
              <p>
                Define the skills and proficiency levels expected for this role.
              </p>
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
              <div className="target-role-requirement-heading">
                <h4>Requirement {index + 1}</h4>

                {requirements.length > 1 && (
                  <button
                    type="button"
                    className="btn-danger-outline"
                    onClick={() => removeRequirement(index)}
                    disabled={saving}
                  >
                    Remove
                  </button>
                )}
              </div>

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
                  disabled={saving}
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
                    disabled={saving}
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
                    disabled={saving}
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
                    disabled={saving}
                  >
                    {IMPORTANCE_LEVELS.map((importance) => (
                      <option key={importance} value={importance}>
                        {importance}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
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
            {saving
              ? isEditing
                ? "Saving Changes..."
                : "Creating Role..."
              : isEditing
                ? "Save Changes"
                : "Create Target Role"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default TargetRoleForm;