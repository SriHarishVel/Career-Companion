import { useState } from "react";

function ApplicationList({
  applications,
  openEditRoundModal,
  setRoundApplicationId,
  setSelectedRound,
  setShowDeleteRoundModal,
  setShowRoundModal,
  openEditModal,
  setApplicationToDeleteId,
  setShowDeleteModal,
}) {
  const [expandedApplications, setExpandedApplications] = useState({});

  function toggleInterviewRounds(applicationId) {
    setExpandedApplications((current) => ({
      ...current,
      [applicationId]: !current[applicationId],
    }));
  }

  return (
    <div className="applications-grid">
      {applications.map((application) => {
        const interviewRounds = application.interviewRounds || [];

        const isExpanded = expandedApplications[application._id];

        return (
          <div key={application._id} className="application-card">
            <div className="application-header">
              <div>
                <h2>{application.role}</h2>

                <p className="application-company">{application.company}</p>
              </div>

              <span
                className={`application-status ${application.status
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
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
                    ? new Date(application.appliedDate).toLocaleDateString(
                        "en-GB",
                      )
                    : "-"}
                </strong>
              </div>

              {interviewRounds.length > 0 ? (
                <button
                  className="interview-rounds-detail"
                  onClick={() => toggleInterviewRounds(application._id)}
                >
                  <span className="application-detail-label">
                    Interview Rounds
                  </span>

                  <strong>{interviewRounds.length}</strong>
                </button>
              ) : (
                <div>
                  <span className="application-detail-label">
                    Interview Rounds
                  </span>

                  <strong>0</strong>
                </div>
              )}
            </div>

            {isExpanded && (
              <div className="interview-rounds">
                <div className="interview-rounds-label">Interview Rounds</div>

                <div className="interview-rounds-list">
                  {[...interviewRounds]
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((round) => (
                      <div
                        key={round._id}
                        className={`round-item ${round.status.toLowerCase()}`}
                      >
                        <div className="round-content">
                          <strong>{round.title}</strong>

                          <span>{round.status}</span>

                          {round.date && (
                            <small className="round-date">
                              {new Date(round.date).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </small>
                          )}
                        </div>

                        <div className="round-actions">
                          <button
                            className="round-action-btn"
                            title="Edit Round"
                            onClick={() =>
                              openEditRoundModal(application._id, round)
                            }
                          >
                            ✏️
                          </button>

                          <button
                            className="round-action-btn delete"
                            title="Delete Round"
                            onClick={() => {
                              setRoundApplicationId(application._id);

                              setSelectedRound(round);

                              setShowDeleteRoundModal(true);
                            }}
                          >
                            ✖
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <p className="application-updated">
              Last Updated: {new Date(application.updatedAt).toLocaleString()}
            </p>

            <div className="card-actions">
              {application.applicationUrl && (
                <a
                  href={
                    application.applicationUrl.startsWith("http")
                      ? application.applicationUrl
                      : `https://${application.applicationUrl}`
                  }
                  className="view-posting-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ↗ View Posting
                </a>
              )}

              <button
                onClick={() => {
                  setRoundApplicationId(application._id);

                  setShowRoundModal(true);
                }}
              >
                Add Round
              </button>

              <button
                className="edit-btn"
                onClick={() => openEditModal(application)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => {
                  setApplicationToDeleteId(application._id);

                  setShowDeleteModal(true);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ApplicationList;
