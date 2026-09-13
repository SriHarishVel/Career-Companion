import { useNavigate } from "react-router-dom";

function TodaysFocus({ todaysFocus, primaryGoal }) {
  const navigate = useNavigate();

  if (!primaryGoal) {
    return (
      <section className="todays-focus todays-focus-empty">
        <span className="focus-eyebrow">TODAY'S FOCUS</span>

        <h2>Choose where you're going first.</h2>

        <p>Set your primary career goal and start building a path toward it.</p>

        <button
          type="button"
          className="btn-primary"
          onClick={() => navigate("/goals")}
        >
          Set Career Goal →
        </button>
      </section>
    );
  }

  if (!todaysFocus) {
    return (
      <section className="todays-focus todays-focus-empty">
        <span className="focus-eyebrow">TODAY'S FOCUS</span>

        <h2>Your milestones are complete.</h2>

        <p>
          Use today to strengthen your skills, learn something useful, or keep
          your job search moving.
        </p>

        <button
          type="button"
          className="btn-primary"
          onClick={() => navigate("/applications")}
        >
          Review Applications →
        </button>
      </section>
    );
  }

  const skills = todaysFocus.skills || [];

  const handleOpenGoal = () => {
    if (primaryGoal?._id) {
      navigate(`/goals/${primaryGoal._id}`);
    } else {
      navigate("/goals");
    }
  };

  return (
    <section className="todays-focus">
      <div className="focus-header">
        <div>
          <span className="focus-eyebrow">TODAY'S FOCUS</span>

          <h2>{todaysFocus.title}</h2>
        </div>

        <span className="focus-percent">{todaysFocus.progress || 0}%</span>
      </div>

      <div className="focus-progress-track">
        <div
          className="focus-progress-fill"
          style={{
            width: `${Math.min(Math.max(todaysFocus.progress || 0, 0), 100)}%`,
          }}
        />
      </div>

      <div className="focus-action">
        <div>
          <span className="focus-label">NEXT MILESTONE</span>

          <p>Make measurable progress toward this goal today.</p>
        </div>

        <button type="button" className="btn-primary" onClick={handleOpenGoal}>
          Open Goal →
        </button>
      </div>

      {skills.length > 0 && (
        <div className="focus-skills">
          <span className="focus-label">CONNECTED SKILLS</span>

          <div className="focus-skill-list">
            {skills.slice(0, 4).map((skill) => (
              <span key={skill._id}>{skill.name}</span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default TodaysFocus;
