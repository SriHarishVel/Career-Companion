function GoalHeader({ goal, onBack }) {
  return (
    <header className="goal-detail-header">
      <button type="button" className="goal-back-link" onClick={onBack}>
        ← Back to goals
      </button>

      <div className="goal-detail-heading">
        <div className="goal-detail-heading-main">
          <span className="goal-detail-eyebrow">
            {goal.goalType || "Career goal"}
          </span>

          <h1>{goal.title}</h1>

          {goal.description && <p>{goal.description}</p>}
        </div>

        {goal.priority && (
          <span
            className={`goal-detail-priority ${goal.priority.toLowerCase()}`}
          >
            {goal.priority}
          </span>
        )}
      </div>
    </header>
  );
}

export default GoalHeader;
