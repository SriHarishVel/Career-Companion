function UpcomingActions({ upcomingActions }) {
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

export default UpcomingActions;