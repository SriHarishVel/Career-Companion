import { useNavigate } from "react-router-dom";
import "./index.css";

function Home() {
    const navigate = useNavigate();
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
    
    const overallProgress =
        secondaryGoals.length > 0
            ? Math.round(
                secondaryGoals.reduce(
                    (total, goal) => total + goal.progress,
                    0
                ) / secondaryGoals.length
            )
            : 0;

    function handleContinueJourney() {

        if (!primaryGoal) {
            navigate("/goals");
            return;
        }

        if (secondaryGoals.length === 0) {
            navigate("/goals");
            return;
        }

        navigate("/goals");
    }
    return (
        <div className="container">

            <h1>Home</h1>

            <div className="home-grid">

                <div className="home-card">
                   {primaryGoal ? (
                        <>
                            <h2>Current Career Journey</h2>

                            <h3>{primaryGoal.title}</h3>
                            <div className="journey-summary">

                                <div className="summary-item">
                                    <span>Progress</span>
                                    <strong>{overallProgress}%</strong>
                                </div>

                                <div className="summary-item">
                                    <span>Secondary Goals</span>
                                    <strong>
                                        {completedSecondaryGoals} / {secondaryGoals.length}
                                    </strong>
                                </div>

                            </div>

                            <button onClick={handleContinueJourney}>
                                Continue Journey
                            </button>
                        </>
                    ) : (
                        <>
                            <h2>Welcome to Career Companion</h2>

                            <p>
                                You haven't started your career journey yet.
                                Create your primary goal to begin planning your career.
                            </p>

                            <button onClick={handleContinueJourney}>
                                Create Primary Goal
                            </button>
                        </>
                    )}
                </div>

                <div className="home-card">

                    <h2>Journey Progress</h2>

                    <div className="journey-progress">

                        <div
                            className={`journey-step ${
                                primaryGoal ? "completed" : ""
                            }`}
                        >
                            {primaryGoal ? "✓ " : ""}
                            Primary Goal
                        </div>

                        <div
                            className={`journey-step ${
                                secondaryGoals.length > 0 ? "completed" : ""
                            }`}
                        >
                            {secondaryGoals.length > 0 ? "✓ " : ""}
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