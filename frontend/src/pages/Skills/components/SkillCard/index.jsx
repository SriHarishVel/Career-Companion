import { useNavigate } from "react-router-dom";

import "./index.css";

function SkillCard({
  id,
  name,
  progress = 0,
  category,
  level,
  relatedGoalTitle,
}) {
  const navigate = useNavigate();

  const safeProgress = Math.min(Math.max(Number(progress) || 0, 0), 100);

  function handleSkillDetails() {
    navigate(`/skills/${id}`);
  }

  return (
    <article
      className="skill-card"
      onClick={handleSkillDetails}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleSkillDetails();
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

          <strong>{safeProgress}%</strong>
        </div>

        <div
          className="progress-bar"
          role="progressbar"
          aria-valuenow={safeProgress}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label={`${name} progress`}
        >
          <div
            className="progress-fill"
            style={{
              width: `${safeProgress}%`,
            }}
          />
        </div>
      </div>
    </article>
  );
}

export default SkillCard;
