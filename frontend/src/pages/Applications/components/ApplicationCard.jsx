import { useNavigate } from "react-router-dom";

function ApplicationCard({ application }) {
  const navigate = useNavigate();

  const status = application?.status?.trim() || "Applied";

  const statusClass = status.toLowerCase().replace(/\s+/g, "-");

  const interviewRounds = Array.isArray(application?.interviewRounds)
    ? application.interviewRounds
    : [];

  const handleOpen = () => {
    if (!application?._id) return;

    navigate(`/applications/${application._id}`);
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "-";

    return parsedDate.toLocaleDateString("en-GB");
  };

  const formatUpdatedDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "-";

    return parsedDate.toLocaleString();
  };

  const applicationUrl = application?.applicationUrl?.trim();

  const normalizedApplicationUrl = applicationUrl
    ? /^https?:\/\//i.test(applicationUrl)
      ? applicationUrl
      : `https://${applicationUrl}`
    : null;

  return (
    <article
      className="application-card"
      onClick={handleOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpen();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="application-header">
        <div className="application-title-content">
          <h2>{application?.role || "Untitled Role"}</h2>

          <p className="application-company">
            {application?.company || "Company not specified"}
          </p>
        </div>

        <span className={`application-status ${statusClass}`}>{status}</span>
      </div>

      {application?.primaryGoal?.title && (
        <div className="related-goal-card">
          <span className="related-goal-label">Career Goal</span>

          <div className="related-goal-title">
            {application.primaryGoal.title}
          </div>
        </div>
      )}

      <div className="application-details">
        <div>
          <span className="application-detail-label">Applied</span>

          <strong>{formatDate(application?.appliedDate)}</strong>
        </div>

        <div>
          <span className="application-detail-label">Interview Rounds</span>

          <strong>{interviewRounds.length}</strong>
        </div>
      </div>

      <p className="application-updated">
        Last Updated: {formatUpdatedDate(application?.updatedAt)}
      </p>

      {normalizedApplicationUrl && (
        <div className="card-actions">
          <a
            href={normalizedApplicationUrl}
            className="view-posting-link"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            ↗ View Posting
          </a>
        </div>
      )}
    </article>
  );
}

export default ApplicationCard;