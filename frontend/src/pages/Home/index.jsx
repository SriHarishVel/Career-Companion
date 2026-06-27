import "./index.css";

function Home() {
    const goals = JSON.parse(localStorage.getItem("goals")) || [];

    const primaryGoal = goals.find(goal => goal.goalType === "Primary");

    const secondaryGoals =
    goals.filter(
        goal =>
            goal.goalType === "Secondary" &&
            goal.parentGoalId === primaryGoal?.id
    );

    const completedSecondaryGoals =
    secondaryGoals.filter(
        goal => goal.completed
    ).length;

    return (
        <div className="container">

            <h1>Home</h1>

            <div className="home-grid">

                <div className="home-card">
                   {primaryGoal ? (
                        <>
                            <h2>Current Goal</h2>

                            <h3>{primaryGoal.title}</h3>

                            <p>
                                Progress: {primaryGoal.progress}%
                            </p>

                            <p>
                                Secondary Goals:
                                {" "}
                                {completedSecondaryGoals}
                                {" / "}
                                {secondaryGoals.length}
                                {" "}
                                completed
                            </p>

                            <button>
                                Continue Journey
                            </button>
                        </>
                    ) : (
                        <>
                            <h2>Start Your Career Journey</h2>

                            <p>Create your first primary goal.</p>

                            <button>Create Goal</button>
                        </>
                    )}
                </div>

                <div className="home-card">

                    <h2>Journey Progress</h2>

                    <div className="journey-progress">

                        <div className="journey-step completed">
                            Primary Goal
                        </div>

                        <div className="journey-step">
                            Secondary Goals
                        </div>

                        <div className="journey-step">
                            Skills
                        </div>

                        <div className="journey-step">
                            Resources
                        </div>

                        <div className="journey-step">
                            Applications
                        </div>

                    </div>

                </div>

                <div className="home-card">
                    <h2>Current Goal</h2>

                    <p>
                        No primary goal selected.
                    </p>
                </div>

                <div className="home-card">
                    <h2>Today's Focus</h2>

                    <p>
                        Nothing planned yet.
                    </p>
                </div>

                <div className="home-card">
                    <h2>Quick Access</h2>

                    <div className="quick-links">

                        <button>Goals</button>

                        <button>Skills</button>

                        <button>Resources</button>

                        <button>Applications</button>

                    </div>
                </div>

            </div>

        </div>
    );
}

export default Home;