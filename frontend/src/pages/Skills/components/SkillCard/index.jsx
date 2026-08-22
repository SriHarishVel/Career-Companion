import "./index.css";

function SkillCard({
  id,
  name,
  progress,
  category,
  level,
  relatedGoalTitle,
  onDetails,
}) {
  return (
    <div
      className="skill-card"
      onClick={() => onDetails(id)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onDetails(id);
        }
      }}
    >
      <div className="skill-card-header">
        <h2>{name}</h2>
      </div>

      <div className="badges-row">
        {category && <span className="category-badge">{category}</span>}

        {level && (
          <span className={`level-badge ${level.toLowerCase()}`}>{level}</span>
        )}
      </div>

      {relatedGoalTitle && (
        <div className="related-goal-card">
          <div className="related-goal-label">Related Goal</div>

          <div className="related-goal-title">{relatedGoalTitle}</div>
        </div>
      )}

      <div className="skill-progress-section">
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
    </div>
  );
}

export default SkillCard;
