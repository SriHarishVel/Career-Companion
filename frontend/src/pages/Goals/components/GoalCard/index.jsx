import { useNavigate } from "react-router-dom";

import "./index.css";

function GoalCard({
  id,
  title,
  progress,
  category,
  goalType,
  priority,
  deadline,
  completed,
  parentGoalTitle,
  childGoals = [],
}) {
  const navigate = useNavigate();

  const openGoal = () => {
    navigate(`/goals/${id}`);
  };

  let daysLeft = null;

  if (deadline) {
    const today = new Date();
    const deadlineDate = new Date(deadline);

    const difference = deadlineDate - today;

    daysLeft = Math.ceil(difference / (1000 * 60 * 60 * 24));
  }

  const deadlineStatus =
    daysLeft < 0 ? "overdue" : daysLeft === 0 ? "today" : "upcoming";

  return (
    <article
      className={`card ${completed ? "completed-card" : ""}`}
      role="button"
      tabIndex={0}
      onClick={openGoal}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openGoal();
        }
      }}
    >
      {/* Header */}

      <div className="card-header">
        <div className="card-title-row">
          <h2>{title}</h2>

          {completed && <span className="completed-badge">✓ Completed</span>}
        </div>

        <div className="badges-row">
          {category && <span className="category-badge">{category}</span>}

          {goalType && (
            <span className={`goal-type-badge ${goalType.toLowerCase()}`}>
              {goalType}
            </span>
          )}

          {priority && (
            <span className={`priority-badge ${priority.toLowerCase()}`}>
              {priority}
            </span>
          )}
        </div>
      </div>

      {/* Supporting Goals */}

      {childGoals.length > 0 && (
        <div className="child-goals">
          <div className="child-goals-label">Supporting Goals</div>

          <div className="child-goals-list">
            {childGoals.map((goal) => (
              <div key={goal._id} className="child-goal-item">
                <span>•</span>
                {goal.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Parent Goal */}

      {parentGoalTitle && (
        <div className="parent-goal-card">
          <div className="parent-goal-label">Primary Goal</div>

          <div className="parent-goal-title">{parentGoalTitle}</div>
        </div>
      )}

      {/* Progress */}

      <div className="goal-progress-section">
        <div className="progress-header">
          <span>Progress</span>

          <strong>{progress}%</strong>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      {/* Deadline */}

      {deadline && (
        <div className="deadline-info">
          <div>
            <span className="deadline-label">Deadline</span>

            <strong>
              {new Date(deadline).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </strong>
          </div>

          <span className={`deadline-status ${deadlineStatus}`}>
            {daysLeft > 0
              ? `${daysLeft} days left`
              : daysLeft === 0
                ? "Due today"
                : "Overdue"}
          </span>
        </div>
      )}
    </article>
  );
}

export default GoalCard;
