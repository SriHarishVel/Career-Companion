import "./index.css";

function Dashboard() {
    const goals =
        JSON.parse(localStorage.getItem("goals")) || [];

    const skills =
        JSON.parse(localStorage.getItem("skills")) || [];

    const resources =
        JSON.parse(localStorage.getItem("resources")) || [];

    const topGoal =
        goals.length > 0
            ? goals.reduce((best, goal) =>
                  goal.progress > best.progress
                      ? goal
                      : best
              )
            : null;

    const topSkill =
        skills.length > 0
            ? skills.reduce((best, skill) =>
                  skill.progress > best.progress
                      ? skill
                      : best
              )
            : null;

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
                  (a, b) =>
                      b.lastUpdated -
                      a.lastUpdated
              )[0]
            : null;
    
    const upcomingGoals = [...goals]
        .filter(goal => goal.deadline)
        .sort(
        (a, b) =>
            new Date(a.deadline) -
            new Date(b.deadline)
        )
        .slice(0, 3);

    const recentSkill =
        skills.length > 0
            ? [...skills].sort(
                  (a, b) =>
                      b.lastUpdated -
                      a.lastUpdated
              )[0]
            : null;

    const recentResource =
        resources.length > 0
            ? [...resources].sort(
                  (a, b) =>
                      b.lastUpdated -
                      a.lastUpdated
              )[0]
            : null;
    
    const categoryCounts = {
            Learning: goals.filter(
                goal =>
                    goal.category ===
                    "Learning"
            ).length,
    
            Career: goals.filter(
                goal =>
                    goal.category ===
                    "Career"
            ).length,
    
            Personal: goals.filter(
                goal =>
                    goal.category ===
                    "Personal"
            ).length,
    
            Health: goals.filter(
                goal =>
                    goal.category ===
                    "Health"
            ).length
        };

    return (
        <div className="container">
            <h1>Dashboard</h1>

            <div className="dashboard-grid">

                <div className="dashboard-section progress-section">
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
                    <h2>Statistics</h2>

                    <p>
                        <strong>Total Goals:</strong>{" "}
                        {goals.length}
                    </p>

                    <p>
                        <strong>Total Skills:</strong>{" "}
                        {skills.length}
                    </p>

                    <p>
                        <strong>Total Resources:</strong>{" "}
                        {resources.length}
                    </p>
                </div>
                
                <div className="dashboard-section">
                    <h2>Goals by Category</h2>

                    <p>Learning: {categoryCounts.Learning}</p>

                    <p>Career: {categoryCounts.Career}</p>

                    <p>Personal: {categoryCounts.Personal}</p>

                    <p>Health: {categoryCounts.Health}</p>
                </div>

                <div className="dashboard-section">
                    <h2>Top Progress</h2>

                    {topGoal ? (
                        <p>
                            <strong>Goal:</strong>{" "}
                            {topGoal.title}
                            {" "}
                            ({topGoal.progress}%)
                        </p>
                    ) : (
                        <p>No goals added.</p>
                    )}

                    {topSkill ? (
                        <p>
                            <strong>Skill:</strong>{" "}
                            {topSkill.title}
                            {" "}
                            ({topSkill.progress}%)
                        </p>
                    ) : (
                        <p>No skills added.</p>
                    )}
                </div>

                <div className="dashboard-section">
                    <h2>Upcoming Deadlines</h2>

                    {upcomingGoals.length > 0 ? (
                        upcomingGoals.map(goal => (
                            <p key={goal.id}>
                                {goal.title}
                                {" - "}
                                {goal.deadline}
                            </p>
                        ))
                    ) : (
                        <p>No deadlines set.</p>
                    )}
                </div>

                <div className="dashboard-section">
                    <h2>Recent Goal</h2>

                    {recentGoal ? (
                        <p>
                            {recentGoal.title}
                            {" "}
                            ({recentGoal.progress}%)
                        </p>
                    ) : (
                        <p>No goals added.</p>
                    )}
                </div>

                <div className="dashboard-section">
                    <h2>Recent Skill</h2>

                    {recentSkill ? (
                        <p>
                            {recentSkill.title}
                            {" "}
                            ({recentSkill.progress}%)
                        </p>
                    ) : (
                        <p>No skills added.</p>
                    )}
                </div>

                <div className="dashboard-section">
                    <h2>Recent Resource</h2>

                    {recentResource ? (
                        <p>
                            {recentResource.title}
                        </p>
                    ) : (
                        <p>No resources added.</p>
                    )}
                </div>

            </div>
        </div>
    );
}

export default Dashboard;