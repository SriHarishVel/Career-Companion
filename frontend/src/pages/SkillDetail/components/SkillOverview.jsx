import { useNavigate } from "react-router-dom";

function SkillOverview({ skill }) {
  const navigate = useNavigate();

  const progress = Math.min(Math.max(Number(skill?.progress) || 0, 0), 100);

  const progressStatus =
    progress === 100
      ? "Complete"
      : progress > 0
        ? "In Progress"
        : "Not Started";

  return (
    <section className="skill-overview">
      {/* Skill Header */}
      <div className="skill-detail-header">
        <div className="skill-detail-title">
          <span className="skill-detail-label">SKILL</span>
          <h1>{skill?.name || "Untitled Skill"}</h1>
        </div>

        <div className="skill-detail-header-meta">
          {skill?.category && (
            <span className="skill-category">{skill.category}</span>
          )}

          {skill?.developmentStatus && (
            <span
              className={`skill-development-status ${skill.developmentStatus
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
            >
              {skill.developmentStatus}
            </span>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="skill-overview-grid">
        {/* Progress */}
        <section className="skill-progress-section">
          <div className="skill-progress-header">
            <div>
              <span className="section-label">CURRENT PROGRESS</span>

              <h2>{progress}%</h2>
            </div>

            <span className="progress-status">{progressStatus}</span>
          </div>

          <div
            className="skill-progress-track"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label={`${skill?.name || "Skill"} progress`}
          >
            <div
              className="skill-progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <p className="skill-development-note">
            Progress is based on the development requirements and learning
            resources tracked for this skill.
          </p>
        </section>

        {/* Supporting Goal */}
        <section className="skill-goal-section">
          <span className="section-label">SUPPORTING GOAL</span>

          {skill?.secondaryGoal ? (
            <>
              <h2>{skill.secondaryGoal.title}</h2>

              <p>This skill contributes to the supporting career goal.</p>

              <button
                type="button"
                className="skill-goal-link"
                onClick={() => navigate(`/goals/${skill.secondaryGoal._id}`)}
              >
                View supporting goal →
              </button>
            </>
          ) : (
            <>
              <h2>No supporting goal</h2>

              <p>
                This skill is currently not linked to a supporting career goal.
              </p>
            </>
          )}
        </section>
      </div>
    </section>
  );
}

export default SkillOverview;
