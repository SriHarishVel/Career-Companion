function JourneyCard({
    primaryGoal,
    secondaryGoals,
    completedSecondaryGoals,
    overallProgress,
    journeyStep,
    onContinue
}) {
    return (
        <div className="home-card">
            {primaryGoal ? (
                <>
                    <h2>Current Career Journey</h2>

                    <h3>{primaryGoal.title}</h3>

                    <p className="journey-message">
                        <strong>Next Step:</strong>{" "}
                        {journeyStep.title}
                    </p>

                    <p className="journey-description">
                        {journeyStep.description}
                    </p>

                    <div className="journey-summary">
                        <div className="summary-item">
                            <span>Progress</span>
                            <strong>{overallProgress}%</strong>
                        </div>

                        <div className="summary-item">
                            <span>Secondary Goals</span>
                            <strong>
                                {completedSecondaryGoals} /{" "}
                                {secondaryGoals.length}
                            </strong>
                        </div>
                    </div>

                    <button onClick={onContinue}>
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

                    <button onClick={onContinue}>
                        Create Primary Goal
                    </button>
                </>
            )}
        </div>
    );
}

export default JourneyCard;