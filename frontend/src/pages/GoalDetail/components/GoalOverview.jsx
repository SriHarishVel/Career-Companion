import { useNavigate } from "react-router-dom";

function GoalOverview({
  goal,
  progress,
  formattedDeadline,
  formattedCreatedAt,
  daysLeft,
  deadlineStatus,
  parentGoal,
}) {
  const navigate = useNavigate();

  const goalType = goal.goalType || "Primary";

  return (
    <section className="goal-overview">
      <header className="goal-detail-hero">
        <div className="goal-detail-hero-main">
          <div className="goal-detail-meta">
            <span className="goal-detail-eyebrow">{goalType}</span>

            {goal.category && (
              <span className="goal-detail-category">{goal.category}</span>
            )}
          </div>

          <h1>{goal.title}</h1>

          {goal.description && (
            <p className="goal-detail-description">{goal.description}</p>
          )}

          <div className="goal-detail-badges">
            {goal.priority && (
              <span
                className={`goal-detail-priority ${goal.priority.toLowerCase()}`}
              >
                {goal.priority} priority
              </span>
            )}

            {goal.completed && (
              <span className="goal-detail-completed">✓ Completed</span>
            )}
          </div>
        </div>

        <div
          className="goal-detail-progress-ring"
          style={{
            "--goal-progress": `${progress}%`,
          }}
          aria-label={`${progress}% complete`}
        >
          <div className="goal-detail-progress-number">
            <strong>{progress}%</strong>
            <span>complete</span>
          </div>
        </div>
      </header>

      <section className="goal-detail-info-grid">
        <div className="goal-detail-section">
          <span className="goal-section-eyebrow">Deadline</span>

          <h2>{formattedDeadline}</h2>

          {daysLeft !== null && (
            <span className={`goal-deadline-status ${deadlineStatus}`}>
              {daysLeft > 0
                ? `${daysLeft} days remaining`
                : daysLeft === 0
                  ? "Due today"
                  : `${Math.abs(daysLeft)} days overdue`}
            </span>
          )}
        </div>

        <div className="goal-detail-section">
          <span className="goal-section-eyebrow">Goal type</span>

          <h2>{goalType}</h2>

          <p>
            {goalType === "Secondary"
              ? "Supporting career objective"
              : "Primary career objective"}
          </p>
        </div>

        {formattedCreatedAt && (
          <div className="goal-detail-section">
            <span className="goal-section-eyebrow">Created</span>

            <h2>{formattedCreatedAt}</h2>

            <p>Part of your career journey.</p>
          </div>
        )}
      </section>

      {parentGoal && (
        <section className="goal-detail-section goal-parent-section">
          <div>
            <span className="goal-section-eyebrow">Primary goal</span>

            <h2>{parentGoal.title}</h2>
          </div>

          <button
            type="button"
            className="goal-parent-arrow"
            onClick={() => navigate(`/goals/${parentGoal._id}`)}
            aria-label={`Open primary goal: ${parentGoal.title}`}
          >
            →
          </button>
        </section>
      )}
    </section>
  );
}

export default GoalOverview;
