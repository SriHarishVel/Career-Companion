import "./index.css";

function Dashboard() {
    // Dashboard reads the saved page data and calculates quick summaries from it.
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
    
    // Show the nearest goal deadlines first.
    const upcomingGoals = [...goals]
        .filter(goal => goal.deadline)
        .sort(
        (a, b) =>
            new Date(a.deadline) -
            new Date(b.deadline)
        )
        .slice(0, 3);

    
    const recentGoal =
        goals.length > 0
            ? [...goals].sort(
                  (a, b) =>
                      b.lastUpdated -
                      a.lastUpdated
              )[0]
            : null;

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
    
    // Count goals in each category for the dashboard summary.
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
    
    const highPriorityGoals = goals
    .filter(
        goal =>
            goal.priority ===
            "High"
    )
    .slice(0, 5);

    const completedGoals =
        goals.filter(
            goal => goal.completed
        ).length;
        
    return (
        <div className="container">
            {/* Page title */}
            <h1>Dashboard</h1>

            {/* Dashboard cards grid */}
            <div className="dashboard-grid">

                {/* Overall progress bars */}
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

                {/* Total item counts */}
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

                    <p>
                        <strong>Completed Goals:</strong>{" "}
                        {completedGoals}
                    </p>
                </div>
                
                {/* Goal category counts */}
                <div className="dashboard-section">
                    <h2>Goals by Category</h2>

                    <p>Learning: {categoryCounts.Learning}</p>

                    <p>Career: {categoryCounts.Career}</p>

                    <p>Personal: {categoryCounts.Personal}</p>

                    <p>Health: {categoryCounts.Health}</p>
                </div>

                {/* Best goal and skill progress */}
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
                
                {/* Displaying goals based on priority*/}

                <div className="dashboard-section">
                    <h2>High Priority Goals</h2>

                    {highPriorityGoals.length > 0 ? (
                        highPriorityGoals.map(goal => (
                            <p key={goal.id}>
                                {goal.title}
                                {" "}
                                ({goal.progress}%)
                            </p>
                        ))
                    ) : (
                        <p>
                            No high priority goals.
                        </p>
                    )}
                </div>

                {/* Goals with the nearest deadlines */}
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

                {/* Most recently updated goal */}
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

                {/* Most recently updated skill */}
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

                {/* Most recently updated resource */}
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
