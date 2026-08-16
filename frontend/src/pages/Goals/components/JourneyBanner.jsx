function JourneyBanner({
    isGuidedSetup,
    journeyStep,
    secondaryGoals
}) {

    if (!isGuidedSetup || !journeyStep) {
        return null;
    }

    const isPrimaryStep =
        journeyStep.action === "createPrimaryGoal";

    const isSecondaryStep =
        journeyStep.action === "createSecondaryGoal";

    if (!isPrimaryStep && !isSecondaryStep) {
        return null;
    }

    const currentStep = isPrimaryStep ? 1 : 2;

    return (
        <div className="journey-banner">

            <div className="journey-progress-header">

                <span>
                    Career Setup
                </span>

                <span>
                    Step {currentStep} of 2
                </span>

            </div>

            <div className="setup-progress">

                <div
                    className={`setup-progress-fill step-${currentStep}`}
                />

            </div>

            {isPrimaryStep && (
                <>
                    <h3>
                        Start with your primary goal
                    </h3>

                    <p>
                        Create your main career goal to begin
                        building your career journey.
                    </p>

                    <p className="journey-hint">
                        Keep it clear and specific. You can
                        break it down into smaller goals next.
                    </p>
                </>
            )}

            {isSecondaryStep && (
                <>
                    <h3>
                        Build your path to that goal
                    </h3>

                    <p>
                        Add secondary goals that will help you
                        achieve your primary goal.
                    </p>

                    <div className="journey-secondary-summary">
                        <strong>
                            {secondaryGoals.length}
                        </strong>

                        <span>
                            secondary{" "}
                            {secondaryGoals.length === 1
                                ? "goal"
                                : "goals"}{" "}
                            added
                        </span>
                    </div>

                    <p className="journey-hint">
                        Add as many as you need, then finish
                        your setup when you're ready.
                    </p>
                </>
            )}

        </div>
    );
}

export default JourneyBanner;