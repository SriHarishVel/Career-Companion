import "./index.css";

function Dashboard() {
    const goals =
        JSON.parse(localStorage.getItem("goals")) || [];

    const skills =
        JSON.parse(localStorage.getItem("skills")) || [];

    const resources =
        JSON.parse(localStorage.getItem("resources")) || [];

    const averageGoalProgress =
        goals.length > 0
            ? Math.round(
                  goals.reduce(
                      (sum, goal) =>
                          sum + goal.progress,
                      0
                  ) / goals.length
              )
            : 0;

    const averageSkillProgress =
        skills.length > 0
            ? Math.round(
                  skills.reduce(
                      (sum, skill) =>
                          sum + skill.progress,
                      0
                  ) / skills.length
              )
            : 0;

    const recentGoal =
        goals.length > 0
            ? [...goals].sort(
                (a, b) => b.lastUpdated - a.lastUpdated
            )[0]
            : null;

    const recentSkill =
        skills.length > 0
            ? [...skills].sort(
                (a, b) => b.lastUpdated - a.lastUpdated
            )[0]
            : null;

    const recentResource =
        resources.length > 0
            ? [...resources].sort(
                (a, b) => b.lastUpdated - a.lastUpdated
            )[0]
            : null;

    return (
        <div className="container">
            <h1>Dashboard</h1>

            <div className="dashboard-section">
                <h2>Overall Progress</h2>

                <h3>Goal Progress</h3>

                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{
                            width: `${averageGoalProgress}%`
                        }}
                    ></div>
                </div>

                <p>{averageGoalProgress}%</p>

                <h3>Skill Progress</h3>

                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{
                            width: `${averageSkillProgress}%`
                        }}
                    ></div>
                </div>

                <p>{averageSkillProgress}%</p>
            </div>

            <div className="dashboard-section">
                <h2>Recently Worked On</h2>

                {recentGoal ? (
                    <p>
                        {recentGoal.title}
                        {" "}
                        ({recentGoal.progress}%)
                    </p>
                ) : (
                    <p>No goals added.</p>
                )}

                {recentSkill ? (
                    <p>
                        {recentSkill.name}
                        {" "}
                        ({recentSkill.progress}%)
                    </p>
                ) : (
                    <p>No skills added.</p>
                )}
            </div>

            <div className="dashboard-section">
                <h2>Recently Saved Resource</h2>

                {recentResource ? (
                    <p>{recentResource.title}</p>
                ) : (
                    <p>No resources added.</p>
                )}
            </div>
        </div>
    );
}

export default Dashboard;