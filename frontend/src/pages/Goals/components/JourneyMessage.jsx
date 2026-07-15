function JourneyMessage({
    journeyStep,
    primaryGoal
}) {
    return (
        <div className="journey-message">

            <p>
                {journeyStep.description}
            </p>

            {primaryGoal && (
                <p>
                    <strong>Current Primary Goal:</strong>{" "}
                    {primaryGoal.title}
                </p>
            )}

        </div>
    );
}

export default JourneyMessage;