import FormDialog from "../../../components/FormDialog";

function SkillForm({
  isOpen,
  onClose,
  title = "Add Skill",
  onSubmit,
  submitLabel = "Add Skill",
  newSkill,
  setNewSkill,
  newCategory,
  setNewCategory,
  secondaryGoalId,
  setSecondaryGoalId,
  secondaryGoalOptions,
  newResource,
  setNewResource,
  learningAreas = [],
  setLearningAreas,
  practicalRequirements = [],
  setPracticalRequirements,
  errorMsg,
  saving,
}) {
  function addLearningArea() {
    setLearningAreas((previous) => [
      ...previous,
      {
        name: "",
        completed: false,
      },
    ]);
  }

  function updateLearningArea(index, field, value) {
    setLearningAreas((previous) =>
      previous.map((area, areaIndex) =>
        areaIndex === index
          ? {
              ...area,
              [field]: value,
            }
          : area,
      ),
    );
  }

  function removeLearningArea(index) {
    setLearningAreas((previous) =>
      previous.filter((_, areaIndex) => areaIndex !== index),
    );
  }

  function addPracticalRequirement() {
    setPracticalRequirements((previous) => [
      ...previous,
      {
        title: "",
        completed: false,
      },
    ]);
  }

  function updatePracticalRequirement(index, field, value) {
    setPracticalRequirements((previous) =>
      previous.map((requirement, requirementIndex) =>
        requirementIndex === index
          ? {
              ...requirement,
              [field]: value,
            }
          : requirement,
      ),
    );
  }

  function removePracticalRequirement(index) {
    setPracticalRequirements((previous) =>
      previous.filter((_, requirementIndex) => requirementIndex !== index),
    );
  }

  function handleSubmit() {
    const cleanedLearningAreas = learningAreas
      .map((area) => ({
        ...area,
        name: area.name.trim(),
      }))
      .filter((area) => area.name !== "");

    const cleanedPracticalRequirements = practicalRequirements
      .map((requirement) => ({
        ...requirement,
        title: requirement.title.trim(),
      }))
      .filter((requirement) => requirement.title !== "");

    setLearningAreas(cleanedLearningAreas);
    setPracticalRequirements(cleanedPracticalRequirements);

    onSubmit({
      learningAreas: cleanedLearningAreas,
      practicalRequirements: cleanedPracticalRequirements,
    });
  }

  return (
    <FormDialog
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            className="skill-action-secondary"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="button"
            className="skill-action-primary"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Saving..." : submitLabel}
          </button>
        </>
      }
    >
      <div className="skill-form-content">
        <div className="skill-form-fields">
          {/* SKILL NAME */}

          <div className="filter-group">
            <label htmlFor="skill-name">Skill Name</label>

            <input
              id="skill-name"
              type="text"
              placeholder="e.g. React"
              value={newSkill}
              onChange={(event) => setNewSkill(event.target.value)}
              disabled={saving}
            />
          </div>

          {/* CATEGORY */}

          <div className="filter-group">
            <label htmlFor="skill-category">Category</label>

            <select
              id="skill-category"
              value={newCategory}
              onChange={(event) => setNewCategory(event.target.value)}
              disabled={saving}
            >
              <option value="Programming">Programming</option>
              <option value="Database">Database</option>
              <option value="Framework">Framework</option>
              <option value="Tools">Tools</option>
              <option value="Soft Skills">Soft Skills</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* RELATED GOAL */}

          <div className="filter-group">
            <label htmlFor="skill-goal">
              Related Goal
              <span className="optional-label">Optional</span>
            </label>

            <select
              id="skill-goal"
              value={secondaryGoalId}
              onChange={(event) => setSecondaryGoalId(event.target.value)}
              disabled={saving}
            >
              <option value="">No Related Goal</option>

              {secondaryGoalOptions.map((goal) => (
                <option key={goal._id} value={goal._id}>
                  {goal.title}
                </option>
              ))}
            </select>
          </div>

          {/* LEARNING RESOURCE */}

          <div className="filter-group">
            <label htmlFor="skill-resource">
              Learning Resource
              <span className="optional-label">Optional</span>
            </label>

            <input
              id="skill-resource"
              type="url"
              placeholder="https://..."
              value={newResource}
              onChange={(event) => setNewResource(event.target.value)}
              disabled={saving}
            />
          </div>

          {/* LEARNING AREAS */}

          <div className="skill-requirements-section">
            <div className="skill-requirements-header">
              <div>
                <label>Learning Areas</label>

                <small>
                  Define the areas you want to cover for this skill.
                </small>
              </div>

              <button
                type="button"
                className="skill-add-item-btn"
                onClick={addLearningArea}
                disabled={saving}
              >
                + Add Area
              </button>
            </div>

            {learningAreas.length > 0 ? (
              <div className="skill-requirements-list">
                {learningAreas.map((area, index) => (
                  <div key={index} className="skill-requirement-row">
                    <input
                      type="text"
                      value={area.name}
                      placeholder="e.g. React Hooks"
                      onChange={(event) =>
                        updateLearningArea(index, "name", event.target.value)
                      }
                      disabled={saving}
                    />

                    <button
                      type="button"
                      className={`skill-requirement-status ${
                        area.completed ? "completed" : ""
                      }`}
                      onClick={() =>
                        updateLearningArea(index, "completed", !area.completed)
                      }
                      disabled={saving}
                    >
                      {area.completed ? "Covered" : "Not Covered"}
                    </button>

                    <button
                      type="button"
                      className="skill-remove-item-btn"
                      onClick={() => removeLearningArea(index)}
                      disabled={saving}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="skill-requirements-empty">
                No learning areas added yet.
              </p>
            )}
          </div>

          {/* PRACTICAL REQUIREMENTS */}

          <div className="skill-requirements-section">
            <div className="skill-requirements-header">
              <div>
                <label>Practical Development</label>

                <small>
                  Add practical work that helps demonstrate development of this
                  skill.
                </small>
              </div>

              <button
                type="button"
                className="skill-add-item-btn"
                onClick={addPracticalRequirement}
                disabled={saving}
              >
                + Add Requirement
              </button>
            </div>

            {practicalRequirements.length > 0 ? (
              <div className="skill-requirements-list">
                {practicalRequirements.map((requirement, index) => (
                  <div key={index} className="skill-requirement-row">
                    <input
                      type="text"
                      value={requirement.title}
                      placeholder="e.g. Build a React project"
                      onChange={(event) =>
                        updatePracticalRequirement(
                          index,
                          "title",
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
                        updatePracticalRequirement(
                          index,
                          "completed",
                          !requirement.completed,
                        )
                      }
                      disabled={saving}
                    >
                      {requirement.completed ? "Completed" : "Not Completed"}
                    </button>

                    <button
                      type="button"
                      className="skill-remove-item-btn"
                      onClick={() => removePracticalRequirement(index)}
                      disabled={saving}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="skill-requirements-empty">
                No practical requirements added yet.
              </p>
            )}
          </div>
        </div>

        {errorMsg && (
          <p className="error" role="alert">
            {errorMsg}
          </p>
        )}
      </div>
    </FormDialog>
  );
}

export default SkillForm;
