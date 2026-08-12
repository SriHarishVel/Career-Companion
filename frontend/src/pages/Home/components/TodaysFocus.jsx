function TodaysFocus({ todaysFocus, primaryGoal }) {
    return (
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
    );
}

export default TodaysFocus;