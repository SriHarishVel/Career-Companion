import { useNavigate } from "react-router-dom";
import { storageService } from "../../services/storageService";
import "./index.css";

function Home() {
    const navigate = useNavigate();
    const goals = storageService.getGoals();

    const skills = storageService.getSkills();

    const resources = storageService.getResources();

    const applications = storageService.getResources();

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
            navigate("/goals", {
    state: {
        fromJourney: true,
        action: "createPrimaryGoal"
    }
});
            return;
        }

        if (secondaryGoals.length === 0) {
           navigate("/goals", {
                state: {
                    fromJourney: true,
                    action: "createSecondaryGoal"
                }
            });
            return;
        }

        if (skills.length === 0) {
           navigate("/skills", {
                state: {
                    fromJourney: true,
                    action: "createSkill"
                }
            });
            return;
        }

        if (resources.length === 0) {
            navigate("/resources", {
                state: {
                    fromJourney: true,
                    action: "addResource"
                }
            });
            return;
        }

        navigate("/applications", {
            state: {
                fromJourney: true,
                action: "addApplication"
            }
        });
    }
    const todaysFocus = secondaryGoals.find(goal => !goal.completed);

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

                        <div
                            className={`journey-step ${
                                skills.length > 0 ? "completed" : ""
                            }`}
                        >
                            {skills.length > 0 ? "✓ " : ""}
                            Skills
                        </div>

                        <div
                            className={`journey-step ${
                                resources.length > 0 ? "completed" : ""
                            }`}
                        >
                            {resources.length > 0 ? "✓ " : ""}
                            Resources
                        </div>

                        <div
                            className={`journey-step ${
                                applications.length > 0 ? "completed" : ""
                            }`}
                        >
                            {applications.length > 0 ? "✓ " : ""}
                            Applications
                        </div>
                    </div>

                </div>

                <div className="home-card">
                    <h2>Today's Focus</h2>

                    {todaysFocus ? (
                        <>
                            <h3>{todaysFocus.title}</h3>

                            <p>
                                Progress: {todaysFocus.progress}%
                            </p>
                        </>
                    ) : primaryGoal ? (
                        <p>
                            All secondary goals are completed.
                        </p>
                    ) : (
                        <p>
                            Create a primary goal to get started.
                        </p>
                    )}
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