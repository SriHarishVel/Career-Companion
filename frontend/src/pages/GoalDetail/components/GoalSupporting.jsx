import { useNavigate } from "react-router-dom";

function GoalSupporting({ supportingGoals }) {
  const navigate = useNavigate();

  if (supportingGoals.length === 0) {
    return null;
  }

  return (
    <section className="goal-detail-section supporting-goals-section">
      <div className="goal-section-heading">
        <div>
          <span className="goal-section-eyebrow">Supporting goals</span>

          <h2>Goals that support this journey</h2>
        </div>

        <span className="goal-count">{supportingGoals.length}</span>
      </div>

      <div className="goal-supporting-list">
        {supportingGoals.map((supportingGoal) => {
          const progress = Number(supportingGoal.progress) || 0;

          return (
            <button
              key={supportingGoal._id}
              type="button"
              className="goal-supporting-item"
              onClick={() => navigate(`/goals/${supportingGoal._id}`)}
            >
              <div className="goal-supporting-main">
                <div className="goal-supporting-title-row">
                  <strong>{supportingGoal.title}</strong>

                  {supportingGoal.completed && (
                    <span className="goal-supporting-completed">✓</span>
                  )}
                </div>

                <div className="goal-supporting-progress">
                  <div className="goal-supporting-progress-track">
                    <div
                      className="goal-supporting-progress-fill"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>

                  <span>{progress}%</span>
                </div>
              </div>

              <span className="goal-supporting-arrow" aria-hidden="true">
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
