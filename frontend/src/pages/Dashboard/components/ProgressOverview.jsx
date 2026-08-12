function ProgressOverview({
    averageGoalProgress,
    averageSkillProgress
}) {
    return (
        <div className="dashboard-section">
            <h2>Progress Overview</h2>

            <div className="progress-item">
                <p>Average Goal Progress</p>

                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{
                            width: `${averageGoalProgress}%`
                        }}
                    />
                </div>

                <span>{averageGoalProgress}%</span>
            </div>

            <div className="progress-item">
                <p>Average Skill Progress</p>

                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{
                            width: `${averageSkillProgress}%`
                        }}
                    />
                </div>

                <span>{averageSkillProgress}%</span>
            </div>
        </div>
    );
}

export default ProgressOverview;