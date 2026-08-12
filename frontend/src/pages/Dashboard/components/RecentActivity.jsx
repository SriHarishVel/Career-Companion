function RecentActivity({ recentItems }) {
    return (
        <div className="dashboard-section">
            <h2>Recent Activity</h2>

            <div className="activity-grid">
                {recentItems.length > 0 ? (
                    recentItems.map((item, index) => (
                        <div
                            key={index}
                            className="activity-card"
                        >
                            <span className="activity-type">
                                {item.type}
                            </span>

                            <h3>{item.title}</h3>
                        </div>
                    ))
                ) : (
                    <p>No recent activity.</p>
                )}
            </div>
        </div>
    );
}

export default RecentActivity;