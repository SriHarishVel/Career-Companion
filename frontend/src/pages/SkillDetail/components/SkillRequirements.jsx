import { useState } from "react";

function SkillRequirements({
  learningAreas = [],
  practicalRequirements = [],
  completedLearningAreas = 0,
  completedPracticalRequirements = 0,
  learningProgress = 0,
  practicalProgress = 0,
  updatingRequirement = false,
  onToggleLearningArea,
  onTogglePracticalRequirement,
  onAddLearningArea,
  onAddPracticalRequirement,
}) {
  const [addingLearningArea, setAddingLearningArea] = useState(false);
  const [addingPracticalRequirement, setAddingPracticalRequirement] =
    useState(false);

  const [learningAreaName, setLearningAreaName] = useState("");
  const [practicalRequirementTitle, setPracticalRequirementTitle] =
    useState("");

  const safeLearningProgress = Math.min(
    Math.max(Number(learningProgress) || 0, 0),
    100,
  );

  const safePracticalProgress = Math.min(
    Math.max(Number(practicalProgress) || 0, 0),
    100,
  );

  const submitLearningArea = async (event) => {
    event.preventDefault();

    const value = learningAreaName.trim();

    if (!value || updatingRequirement || !onAddLearningArea) {
      return;
    }

    try {
      await onAddLearningArea(value);

      setLearningAreaName("");
      setAddingLearningArea(false);
    } catch (error) {
      console.error("Failed to add learning area:", error);
    }
  };

  const submitPracticalRequirement = async (event) => {
    event.preventDefault();

    const value = practicalRequirementTitle.trim();

    if (!value || updatingRequirement || !onAddPracticalRequirement) {
      return;
    }

    try {
      await onAddPracticalRequirement(value);

      setPracticalRequirementTitle("");
      setAddingPracticalRequirement(false);
    } catch (error) {
      console.error("Failed to add practical requirement:", error);
    }
  };

  const cancelLearningArea = () => {
    if (updatingRequirement) {
      return;
    }

    setLearningAreaName("");
    setAddingLearningArea(false);
  };

  const cancelPracticalRequirement = () => {
    if (updatingRequirement) {
      return;
    }

    setPracticalRequirementTitle("");
    setAddingPracticalRequirement(false);
  };

  return (
    <section className="skill-requirements-section">
      {/* Header */}
      <div className="skill-section-header">
        <div>
          <span className="section-label">Development Areas</span>

          <h2>What You're Working Toward</h2>

          <p>
            Track the knowledge and practical work needed to develop this skill.
          </p>
        </div>
      </div>

      {/* Learning areas */}
      <div className="skill-requirements-block">
        <div className="skill-requirements-header">
          <div>
            <h2>Learning Areas</h2>

            <p>Topics and concepts you want to cover.</p>
          </div>

          <div className="skill-requirements-summary">
            <strong>
              {completedLearningAreas}/{learningAreas.length}
            </strong>

            <span>{safeLearningProgress}% covered</span>
          </div>
        </div>

        {learningAreas.length > 0 && (
          <>
            <div
              className="skill-requirements-progress"
              role="progressbar"
              aria-valuenow={safeLearningProgress}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Learning areas progress"
            >
              <div
                className="skill-requirements-progress-fill"
                style={{
                  width: `${safeLearningProgress}%`,
                }}
              />
            </div>

            <div className="skill-requirements-list">
              {learningAreas.map((area, index) => (
                <button
                  key={index}
                  type="button"
                  className={`skill-requirement-item ${
                    area.completed ? "completed" : ""
                  }`}
                  onClick={() => onToggleLearningArea(index)}
                  disabled={updatingRequirement}
                  aria-pressed={area.completed}
                >
                  <span
                    className="skill-requirement-indicator"
                    aria-hidden="true"
                  >
                    {area.completed ? "✓" : "○"}
                  </span>

                  <span className="skill-requirement-name">{area.name}</span>

                  <span className="skill-requirement-state">
                    {area.completed ? "Covered" : "Not Covered"}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {!addingLearningArea ? (
          <button
            type="button"
            className="skill-requirements-add-button"
            onClick={() => setAddingLearningArea(true)}
            disabled={updatingRequirement}
          >
            + Add learning area
          </button>
        ) : (
          <form
            className="skill-requirement-add-form"
            onSubmit={submitLearningArea}
          >
            <input
              type="text"
              value={learningAreaName}
              onChange={(event) => setLearningAreaName(event.target.value)}
              placeholder="e.g. Angular components"
              autoFocus
              disabled={updatingRequirement}
            />

            <div className="skill-requirement-add-actions">
              <button
                type="button"
                className="skill-requirement-cancel"
                onClick={cancelLearningArea}
                disabled={updatingRequirement}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="skill-requirement-save"
                disabled={updatingRequirement || !learningAreaName.trim()}
              >
                {updatingRequirement ? "Adding..." : "Add"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Practical development */}
      <div className="skill-requirements-block">
        <div className="skill-requirements-header">
          <div>
            <h2>Practical Development</h2>

            <p>Work that demonstrates applied understanding.</p>
          </div>

          <div className="skill-requirements-summary">
            <strong>
              {completedPracticalRequirements}/{practicalRequirements.length}
            </strong>

            <span>{safePracticalProgress}% completed</span>
          </div>
        </div>

        {practicalRequirements.length > 0 && (
          <>
            <div
              className="skill-requirements-progress"
              role="progressbar"
              aria-valuenow={safePracticalProgress}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Practical development progress"
            >
              <div
                className="skill-requirements-progress-fill"
                style={{
                  width: `${safePracticalProgress}%`,
                }}
              />
            </div>

            <div className="skill-requirements-list">
              {practicalRequirements.map((requirement, index) => (
                <button
                  key={index}
                  type="button"
                  className={`skill-requirement-item ${
                    requirement.completed ? "completed" : ""
                  }`}
                  onClick={() => onTogglePracticalRequirement(index)}
                  disabled={updatingRequirement}
                  aria-pressed={requirement.completed}
                >
                  <span
                    className="skill-requirement-indicator"
                    aria-hidden="true"
                  >
                    {requirement.completed ? "✓" : "○"}
                  </span>

                  <span className="skill-requirement-name">
                    {requirement.title}
                  </span>

                  <span className="skill-requirement-state">
                    {requirement.completed ? "Completed" : "Not Completed"}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {!addingPracticalRequirement ? (
          <button
            type="button"
            className="skill-requirements-add-button"
            onClick={() => setAddingPracticalRequirement(true)}
            disabled={updatingRequirement}
          >
            + Add practical requirement
          </button>
        ) : (
          <form
            className="skill-requirement-add-form"
            onSubmit={submitPracticalRequirement}
          >
            <input
              type="text"
              value={practicalRequirementTitle}
              onChange={(event) =>
                setPracticalRequirementTitle(event.target.value)
              }
              placeholder="e.g. Build an Angular project"
              autoFocus
              disabled={updatingRequirement}
            />

            <div className="skill-requirement-add-actions">
              <button
                type="button"
                className="skill-requirement-cancel"
                onClick={cancelPracticalRequirement}
                disabled={updatingRequirement}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="skill-requirement-save"
                disabled={
                  updatingRequirement || !practicalRequirementTitle.trim()
                }
              >
                {updatingRequirement ? "Adding..." : "Add"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

export default SkillRequirements;
