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
}) {
  const safeLearningProgress = Math.min(
    Math.max(Number(learningProgress) || 0, 0),
    100,
  );

  const safePracticalProgress = Math.min(
    Math.max(Number(practicalProgress) || 0, 0),
    100,
  );

  return (
    <section className="skill-requirements-section">
      <div className="skill-section-header">
        <div>
          <span className="section-label">Development Areas</span>

          <h2>What You're Working Toward</h2>

          <p>
            Track both knowledge coverage and practical application as you
            develop this skill.
          </p>
        </div>
      </div>

      {/* Learning Areas */}

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

        {learningAreas.length > 0 ? (
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
        ) : (
          <div className="skill-requirements-empty">
            <h3>No learning areas added</h3>

            <p>
              Add the concepts or areas you want to cover when editing this
              skill.
            </p>
          </div>
        )}
      </div>

      {/* Practical Development */}

      <div className="skill-requirements-block">
        <div className="skill-requirements-header">
          <div>
            <h2>Practical Development</h2>

            <p>Practical work that helps demonstrate applied understanding.</p>
          </div>

          <div className="skill-requirements-summary">
            <strong>
              {completedPracticalRequirements}/{practicalRequirements.length}
            </strong>

            <span>{safePracticalProgress}% completed</span>
          </div>
        </div>

        {practicalRequirements.length > 0 ? (
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
        ) : (
          <div className="skill-requirements-empty">
            <h3>No practical work added</h3>

            <p>
              Add projects, exercises, or other practical work when editing this
              skill.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default SkillRequirements;
