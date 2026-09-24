function UpcomingInterviews({ upcomingInterviews }) {
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

export default UpcomingInterviews;