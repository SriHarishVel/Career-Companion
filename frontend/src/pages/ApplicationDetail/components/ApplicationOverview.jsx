function ApplicationOverview({ application }) {
  const {
    company,
    role,
    status,
    appliedDate,
    applicationUrl,
    primaryGoal,
    interviewRounds,
  } = application;

  const statusClass = (status || "").toLowerCase().replace(/\s+/g, "-");

  const formattedAppliedDate = appliedDate
    ? new Date(appliedDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not provided";

  const formattedApplicationUrl = applicationUrl
    ? applicationUrl.startsWith("http")
      ? applicationUrl
      : `https://${applicationUrl}`
    : "";

  return (
    <section className="application-overview">
      <div className="application-overview-header">
        <div className="application-overview-main">
          <div className="application-overview-eyebrow">Job Application</div>

          <h1>{role}</h1>

          <p className="application-overview-company">{company}</p>
        </div>

        <span className={`application-detail-status ${statusClass}`}>
          {status}
        </span>
      </div>

      <div className="application-overview-details">
        <div className="application-overview-detail">
          <span className="application-overview-detail-label">
            Applied Date
          </span>

          <strong>{formattedAppliedDate}</strong>
        </div>

        <div className="application-overview-detail">
          <span className="application-overview-detail-label">Career Goal</span>

          <strong>{primaryGoal?.title || "No goal linked"}</strong>
        </div>

        <div className="application-overview-detail">
          <span className="application-overview-detail-label">
            Interview Rounds
          </span>

          <strong>{interviewRounds?.length || 0}</strong>
        </div>
      </div>

      {applicationUrl && (
        <div className="application-detail-url">
          <span className="application-detail-url-label">
            Application Link:
          </span>

          <a
            href={formattedApplicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="application-detail-url-link"
          >
            {applicationUrl}
          </a>
        </div>
      )}
    </section>
  );
}

export default ApplicationOverview;
