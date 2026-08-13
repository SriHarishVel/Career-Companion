function JourneyBanner({
    primaryGoal,
    secondaryGoals,
    skills,
    resources,
    applications,
    journeyStep,
    onContinue
}) {
    const completedSecondaryGoals = secondaryGoals.filter(
        goal => goal.completed
    ).length;

    const overallProgress =
        secondaryGoals.length > 0
            ? Math.round(
                secondaryGoals.reduce(
                    (total, goal) =>
                        total + (goal.progress || 0),
                    0
                ) / secondaryGoals.length
            )
            : 0;

    if (!primaryGoal) {
        return (
            <div className="journey-banner journey-banner-empty">

                <div className="journey-banner-content">
                    <span className="journey-eyebrow">
                        YOUR CAREER JOURNEY
                    </span>

                    <h2>
                        Start building your future.
                    </h2>

                    <p>
                        Set a career goal and turn it into
                        something you can work toward every day.
                    </p>

                    <button onClick={onContinue}>
                        Create Your Goal →
                    </button>
                </div>

            </div>
        );
    }

    return (
        <div className="journey-banner">

            <div className="journey-banner-top">

                <div>
                    <span className="journey-eyebrow">
                        YOUR CAREER JOURNEY
                    </span>

                    <h2>
                        {primaryGoal.title}
                    </h2>

                    <p>
                        Keep building toward your next opportunity.
                    </p>
                </div>

                <div className="journey-progress-number">
                    {overallProgress}%
                </div>

            </div>


            <div className="journey-progress-track">
                <div
                    className="journey-progress-fill"
                    style={{
                        width: `${overallProgress}%`
                    }}
                />
            </div>


            <div className="journey-stats">

                <div>
                    <strong>
                        {completedSecondaryGoals}/{secondaryGoals.length}
                    </strong>

                    <span>
                        milestones
                    </span>
                </div>

                <div>
                    <strong>
                        {skills.length}
                    </strong>

                    <span>
                        skills
                    </span>
                </div>

                <div>
                    <strong>
                        {resources.length}
                    </strong>

                    <span>
                        resources
                    </span>
                </div>

                <div>
                    <strong>
                        {applications.length}
                    </strong>

                    <span>
                        applications
                    </span>
                </div>

            </div>


            {journeyStep && (
                <div className="journey-next">

                    <div>
                        <span>
                            NEXT UP
                        </span>

                        <strong>
                            {journeyStep.title}
                        </strong>

                        <p>
                            {journeyStep.description}
                        </p>
                    </div>

                    <button onClick={onContinue}>
                        Continue Journey →
                    </button>

                </div>
            )}

        </div>
    );
}

export default JourneyBanner;