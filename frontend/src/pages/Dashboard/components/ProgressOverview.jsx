function ProgressOverview({ averageGoalProgress, averageSkillProgress }) {
  return (
    <div className="dashboard-section progress-overview">
      <div className="progress-overview-header">
        <h2>Progress Overview</h2>
        <span>Average progress</span>
      </div>

      <div className="progress-list">
        <div className="progress-item">
          <div className="progress-info">
            <span>Goals</span>
            <strong>{averageGoalProgress}%</strong>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${averageGoalProgress}%`,
              }}
            />
          </div>
        </div>

        <div className="progress-item">
          <div className="progress-info">
            <span>Skills</span>
            <strong>{averageSkillProgress}%</strong>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${averageSkillProgress}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressOverview;
