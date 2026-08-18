function RecentActivity({ recentItems }) {
  return (
    <div className="dashboard-section recent-activity">
      <div className="recent-activity-header">
        <div>
          <h2>Recent Activity</h2>

          <p>Your latest career updates</p>
        </div>
      </div>

      {recentItems.length > 0 ? (
        <div className="activity-timeline">
          {recentItems.map((item, index) => (
            <div key={index} className="activity-entry">
              <div className="activity-card">
                <div className="activity-card-header">
                  <span className="activity-type">{item.type}</span>

                  {item.updatedAt && (
                    <small>
                      {new Date(item.updatedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </small>
                  )}
                </div>

                <h3>{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-state">No recent activity.</p>
      )}
    </div>
  );
}

export default RecentActivity;
