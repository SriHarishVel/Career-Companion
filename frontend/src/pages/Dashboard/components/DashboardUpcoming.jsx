export function UpcomingActions({ upcomingActions }) {
  return (
    <div className="dashboard-section">
      <h2>Upcoming Actions</h2>

      {upcomingActions.length > 0 ? (
        <div className="dashboard-list">
          {upcomingActions.map((action) => (
            <div key={action.id} className="dashboard-list-item">
              <div>
                <span>{action.type}</span>

                <h3>{action.title}</h3>

                <p>
                  {action.role} at {action.company}
                </p>
              </div>

              <div>
                <strong>
                  {new Date(action.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </strong>

                {action.time && <span>{action.time}</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No upcoming actions.</p>
      )}
    </div>
  );
}

export function UpcomingDeadlines({ upcomingDeadlines }) {
  return (
    <div className="dashboard-section">
      <h2>Upcoming Deadlines</h2>

      {upcomingDeadlines.length > 0 ? (
        <div className="dashboard-list">
          {upcomingDeadlines.map((goal) => (
            <div key={goal._id} className="dashboard-list-item">
              <div>
                <h3>{goal.title}</h3>

                {goal.category && <p>{goal.category}</p>}
              </div>

              <span>
                {new Date(goal.deadline).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
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

export function UpcomingInterviews({ upcomingInterviews }) {
  return (
    <div className="dashboard-section">
      <h2>Upcoming Interviews</h2>

      {upcomingInterviews.length > 0 ? (
        <div className="dashboard-list">
          {upcomingInterviews.map((interview) => (
            <div key={interview.id} className="dashboard-list-item">
              <div>
                <span>{interview.status}</span>

                <h3>{interview.title}</h3>

                <p>
                  {interview.role} at {interview.company}
                </p>
              </div>

              <div>
                <strong>
                  {new Date(interview.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </strong>

                {interview.time && (
                  <span>
                    {new Date(
                      `1970-01-01T${interview.time}`,
                    ).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No upcoming interviews.</p>
      )}
    </div>
  );
}

export default UpcomingActions;