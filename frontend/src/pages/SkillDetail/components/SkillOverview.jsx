import { useNavigate } from "react-router-dom";

function SkillOverview({ skill }) {
  const navigate = useNavigate();

  const progress = Number(skill.progress) || 0;

  const progressStatus =
    progress >= 80
      ? "Advanced"
      : progress >= 40
        ? "Developing"
        : "Getting Started";

  return (
    <section className="skill-overview">
      <div className="skill-detail-header">
        <div>
          <span className="skill-detail-label">Skill</span>

          <h1>{skill.name}</h1>
        </div>

        <div className="skill-detail-header-meta">
          <span className="skill-category">
            {skill.category || "Uncategorized"}
          </span>

          <span className="skill-level">{skill.level || "Beginner"}</span>

          <span className="skill-development-status">
            {skill.developmentStatus || "In Progress"}
          </span>
        </div>
      </div>

      <div className="skill-overview-grid">
        <section className="skill-progress-section">
          <div className="skill-progress-header">
            <div>
              <span className="section-label">Current Progress</span>

              <h2>{progress}%</h2>
            </div>

            <span className="progress-status">{progressStatus}</span>
          </div>

          <div className="skill-progress-track">
            <div
              className="skill-progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <p className="skill-development-note">
            Progress reflects the development of this skill based on the tracked
            work associated with it.
          </p>
        </section>

        <section className="skill-goal-section">
          <span className="section-label">Supporting Goal</span>

          {skill.secondaryGoal ? (
            <>
              <h2>{skill.secondaryGoal.title}</h2>

              <p>This skill contributes toward the supporting career goal.</p>

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

              <p>This skill is currently not linked to a secondary goal.</p>
            </>
          )}
        </section>
      </div>
    </section>
  );
}

export default SkillOverview;
