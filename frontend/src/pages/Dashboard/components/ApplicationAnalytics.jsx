function ApplicationAnalytics({ applications }) {
  const statusCounts = {
    Applied: 0,
    "In Progress": 0,
    Offer: 0,
    Rejected: 0,
    Withdrawn: 0,
  };

  applications.forEach((application) => {
    if (Object.hasOwn(statusCounts, application.status)) {
      statusCounts[application.status] += 1;
    }
  });

  const totalApplications = applications.length;
  const activeApplications =
    statusCounts.Applied + statusCounts["In Progress"];

  const offerRate =
    totalApplications > 0
      ? Math.round((statusCounts.Offer / totalApplications) * 100)
      : 0;

  const monthlyApplications = applications.reduce((counts, application) => {
    if (!application.appliedDate) return counts;

    const date = new Date(application.appliedDate);

    if (Number.isNaN(date.getTime())) return counts;

    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}`;

    counts[monthKey] = (counts[monthKey] || 0) + 1;

    return counts;
  }, {});

  const recentMonths = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (5 - index));

    const key = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}`;

    return {
      key,
      label: date.toLocaleDateString(undefined, {
        month: "short",
        year: "2-digit",
      }),
      count: monthlyApplications[key] || 0,
    };
  });

  const maxMonthlyApplications = Math.max(
    1,
    ...recentMonths.map((month) => month.count),
  );

  const metrics = [
    { label: "Total Applications", value: totalApplications },
    { label: "Active Applications", value: activeApplications },
    { label: "Offers Received", value: statusCounts.Offer },
    { label: "Offer Rate", value: `${offerRate}%` },
  ];

  return (
    <section className="dashboard-section application-analytics">
      <div className="application-analytics-header">
        <div>
          <h2>Application Analytics</h2>
          <p>A snapshot of your job search progress</p>
        </div>
      </div>

      <div className="application-analytics-metrics">
        {metrics.map((metric) => (
          <div className="application-analytics-card" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </div>
        ))}
      </div>

      <div className="application-analytics-breakdown">
        <h3>Application Status</h3>

        {Object.entries(statusCounts).map(([status, count]) => (
          <div className="application-analytics-status" key={status}>
            <span>{status}</span>
            <div
              className="application-analytics-status-track"
              role="progressbar"
              aria-label={`${status} applications`}
              aria-valuemin={0}
              aria-valuemax={Math.max(1, totalApplications)}
              aria-valuenow={count}
            >
              <div
                className="application-analytics-status-fill"
                style={{
                  width: `${totalApplications ? (count / totalApplications) * 100 : 0}%`,
                }}
              />
            </div>
            <strong>{count}</strong>
          </div>
        ))}
      </div>

      <div className="application-analytics-trend">
        <h3>Applications Submitted</h3>
        <p>Based on application dates over the last six months</p>

        <div className="application-analytics-months">
          {recentMonths.map((month) => (
            <div className="application-analytics-month" key={month.key}>
              <strong>{month.count}</strong>
              <div className="application-analytics-month-track">
                <div
                  className="application-analytics-month-fill"
                  style={{
                    height: `${(month.count / maxMonthlyApplications) * 100}%`,
                  }}
                />
              </div>
              <span>{month.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ApplicationAnalytics;