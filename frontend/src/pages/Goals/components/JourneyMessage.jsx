function JourneyMessage({
    journeyStep,
    primaryGoal
}) {

    if (!journeyStep) {
        return null;
    }

    return (
        <div className="journey-message">

            <p className="journey-message-text">
                {journeyStep.description}
            </p>

            {primaryGoal && (
                <div className="journey-current-goal">

                    <span className="journey-current-goal-label">
                        Current Primary Goal:{" "}
                    </span>

                    <strong>
                        {primaryGoal.title}
                    </strong>

                </div>
            )}

        </div>
    );
}

export default JourneyMessage;