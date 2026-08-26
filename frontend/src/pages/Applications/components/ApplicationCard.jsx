import { useNavigate } from "react-router-dom";

function ApplicationCard({ application }) {
  const navigate = useNavigate();

  const statusClass = (application.status || "")
    .toLowerCase()
    .replace(/\s+/g, "-");

  const interviewRounds = application.interviewRounds || [];

  const handleOpen = () => {
    navigate(`/applications/${application._id}`);
  };

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
        <div>
          <h2>{application.role}</h2>

          <p className="application-company">{application.company}</p>
        </div>

        <span className={`application-status ${statusClass}`}>
          {application.status}
        </span>
      </div>

      {application.primaryGoal && (
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

          <strong>
            {application.appliedDate
              ? new Date(application.appliedDate).toLocaleDateString("en-GB")
              : "-"}
          </strong>
        </div>

        <div>
          <span className="application-detail-label">Interview Rounds</span>

          <strong>{interviewRounds.length}</strong>
        </div>
      </div>

      <p className="application-updated">
        Last Updated:{" "}
        {application.updatedAt
          ? new Date(application.updatedAt).toLocaleString()
          : "-"}
      </p>

      {application.applicationUrl && (
        <div className="card-actions">
          <a
            href={
              application.applicationUrl.startsWith("http")
                ? application.applicationUrl
                : `https://${application.applicationUrl}`
            }
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
