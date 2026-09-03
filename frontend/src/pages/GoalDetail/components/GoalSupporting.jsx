import { useNavigate } from "react-router-dom";

function GoalSupporting({
  supportingGoals = [],
  relatedSkills = [],
  goalType,
}) {
  const navigate = useNavigate();

  const isPrimary = goalType === "Primary";
  const items = isPrimary ? supportingGoals : relatedSkills;

  if (items.length === 0) {
    return (
      <section className="goal-related-section">
        <div className="goal-related-header">
          <div>
            <span className="goal-related-eyebrow">
              {isPrimary ? "SUPPORTING GOALS" : "RELATED SKILLS"}
            </span>

            <h2>
              {isPrimary ? "Goals that support this journey" : "Skills for this goal"}
            </h2>
          </div>

          <span className="goal-related-count">0</span>
        </div>

        <div className="goal-related-empty">
          {isPrimary
            ? "No secondary goals are linked to this goal."
            : "No skills are currently linked to this goal."}
        </div>
      </section>
    );
  }

  return (
    <section className="goal-related-section">
      <div className="goal-related-header">
        <div>
          <span className="goal-related-eyebrow">
            {isPrimary ? "SUPPORTING GOALS" : "RELATED SKILLS"}
          </span>

          <h2>
            {isPrimary ? "Goals that support this journey" : "Skills for this goal"}
          </h2>
        </div>

        <span className="goal-related-count">{items.length}</span>
      </div>

      <div className="goal-related-list">
        {items.map((item) => {
          const id = item._id;
          const title = isPrimary ? item.title : item.name;
          const progress = Number(item.progress) || 0;

          return (
            <button
              key={id}
              type="button"
              className="goal-related-card"
              onClick={() =>
                navigate(isPrimary ? `/goals/${id}` : `/skills/${id}`)
              }
            >
              <div className="goal-related-card-main">
                <div className="goal-related-card-top">
                  <h3>{title}</h3>

                  {!isPrimary && item.level && (
                    <span className="goal-related-level">
                      {item.level}
                    </span>
                  )}
                </div>

                <div className="goal-related-progress-row">
                  <div className="goal-related-progress">
                    <div
                      className="goal-related-progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <span className="goal-related-progress-value">
                    {progress}%
                  </span>
                </div>
              </div>

              <span className="goal-related-arrow" aria-hidden="true">
                →
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default GoalSupporting;