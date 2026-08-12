function UpcomingDeadlines({ upcomingDeadlines }) {
    return (
        <div className="dashboard-section">
            <h2>Upcoming Deadlines</h2>

            {upcomingDeadlines.length > 0 ? (
                <div className="deadline-list">
                    {upcomingDeadlines.map(goal => (
                        <div
                            key={goal._id}
                            className="deadline-item"
                        >
                            <div>
                                <h3>{goal.title}</h3>
                                <p>{goal.category}</p>
                            </div>

                            <span>
                                {new Date(
                                    goal.deadline
                                ).toLocaleDateString(
                                    "en-GB",
                                    {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    }
                                )}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No upcoming deadlines.</p>
            )}
        </div>
    );
}

export default UpcomingDeadlines;