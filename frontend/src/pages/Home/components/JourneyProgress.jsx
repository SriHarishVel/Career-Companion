function JourneyProgress({
    primaryGoal,
    secondaryGoals,
    skills,
    resources,
    applications
}) {
    return (
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
                        secondaryGoals.length > 0
                            ? "completed"
                            : ""
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
                        applications.length > 0
                            ? "completed"
                            : ""
                    }`}
                >
                    {applications.length > 0 ? "✓ " : ""}
                    Applications
                </div>
            </div>
        </div>
    );
}

export default JourneyProgress;