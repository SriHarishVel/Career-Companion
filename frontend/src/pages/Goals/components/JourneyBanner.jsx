function JourneyBanner({
    isGuidedSetup,
    journeyStep,
    secondaryGoals
}) {

    if (!isGuidedSetup) {
        return null;
    }

    return (
        <>
            {journeyStep.action === "createPrimaryGoal" && (
                <div className="journey-banner">

                    <div className="setup-progress">
                        <div className="setup-progress-fill step-1" />
                    </div>

                    <p>
                        Create your primary career goal to begin your career journey.
                    </p>

                    <p className="journey-hint">
                        Every career journey starts with one clear primary goal.
                    </p>

                </div>
            )}

            {journeyStep.action === "createSecondaryGoal" && (
                <div className="journey-banner">

                    <div className="setup-progress">
                        <div className="setup-progress-fill step-2" />
                    </div>

                    <p>
                        Add one or more secondary goals that will help you achieve your primary goal.
                    </p>

                    <p className="journey-hint">
                        You can add multiple secondary goals before finishing your setup.
                    </p>

                    <p className="journey-summary">
                        {secondaryGoals.length} secondary goal
                        {secondaryGoals.length !== 1 ? "s" : ""} added
                    </p>

                </div>
            )}
        </>
    );
}

export default JourneyBanner;