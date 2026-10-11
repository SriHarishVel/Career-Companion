import { useNavigate } from "react-router-dom";

function GoalSupporting({
  supportingGoals = [],
  relatedSkills = [],
  relatedApplications = [],
  goalType,
}) {
  const navigate = useNavigate();

  const isPrimary = goalType === "Primary";

  const items = isPrimary ? supportingGoals : relatedSkills;

  const applicationStatusCounts = relatedApplications.reduce(
    (counts, application) => {
      const status = application.status || "Unknown";
      counts[status] = (counts[status] || 0) + 1;
      return counts;
    },
    {},
  );

  const renderRelatedSection = ({
    eyebrow,
    title,
    items: sectionItems,
    emptyMessage,
    getTitle,
    getMeta,
    getPath,
  }) => {
    if (sectionItems.length === 0) {
      return (
        <section className="goal-related-section">
          <div className="goal-related-header">
            <div>
              <span className="goal-related-eyebrow">{eyebrow}</span>
              <h2>{title}</h2>
            </div>

            <span className="goal-related-count">0</span>
          </div>

          <div className="goal-related-empty">{emptyMessage}</div>
        </section>
      );
    }

    return (
      <section className="goal-related-section">
        <div className="goal-related-header">
          <div>
            <span className="goal-related-eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
          </div>

          <span className="goal-related-count">
            {sectionItems.length}
          </span>
        </div>

        <div className="goal-related-list">
          {sectionItems.map((item) => {
            const id = item._id;
            const meta = getMeta(item);

            return (
              <button
                key={id}
                type="button"
                className="goal-related-card"
                onClick={() => navigate(getPath(item))}
              >
                <div className="goal-related-card-main">
                  <div className="goal-related-card-top">
                    <h3>{getTitle(item)}</h3>

                    {meta && (
                      <span className="goal-related-level">{meta}</span>
                    )}
                  </div>

                  {typeof item.progress !== "undefined" && (
                    <div className="goal-related-progress-row">
                      <div className="goal-related-progress">
                        <div
                          className="goal-related-progress-fill"
                          style={{
                            width: `${Math.max(
                              0,
                              Math.min(100, Number(item.progress) || 0),
                            )}%`,
                          }}
                        />
                      </div>

                      <span className="goal-related-progress-value">
                        {Math.max(
                          0,
                          Math.min(100, Number(item.progress) || 0),
                        )}
                        %
                      </span>
                    </div>
                  )}
                </div>

                <span className="goal-related-arrow" aria-hidden="true">
                  →
                </span>
              </button>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <>
      {renderRelatedSection({
        eyebrow: isPrimary ? "SUPPORTING GOALS" : "RELATED SKILLS",
        title: isPrimary
          ? "Goals that support this journey"
          : "Skills for this goal",
        items,
        emptyMessage: isPrimary
          ? "No secondary goals are linked to this goal."
          : "No skills are currently linked to this goal.",
        getTitle: (item) => (isPrimary ? item.title : item.name),
        getMeta: (item) => (!isPrimary && item.level ? item.level : ""),
        getPath: (item) =>
          isPrimary ? `/goals/${item._id}` : `/skills/${item._id}`,
      })}

      {isPrimary && (
        <section className="goal-related-section">
          <div className="goal-related-header">
            <div>
              <span className="goal-related-eyebrow">
                RELATED APPLICATIONS
              </span>

              <h2>Applications for this goal</h2>
            </div>

            <span className="goal-related-count">
              {relatedApplications.length}
            </span>
          </div>

          {relatedApplications.length > 0 && (
            <div className="application-status-breakdown">
              {Object.entries(applicationStatusCounts).map(
                ([status, count]) => (
                  <div
                    key={status}
                    className="application-status-summary"
                  >
                    <span>{status}</span>
                    <strong>{count}</strong>
                  </div>
                ),
              )}
            </div>
          )}

          {relatedApplications.length > 0 ? (
            <div className="goal-related-list">
              {relatedApplications.map((application) => (
                <button
                  key={application._id}
                  type="button"
                  className="goal-related-card"
                  onClick={() =>
                    navigate(`/applications/${application._id}`)
                  }
                >
                  <div className="goal-related-card-main">
                    <div className="goal-related-card-top">
                      <h3>
                        {application.role} at {application.company}
                      </h3>

                      <span className="goal-related-level">
                        {application.status || "Unknown"}
                      </span>
                    </div>
                  </div>

                  <span className="goal-related-arrow" aria-hidden="true">
                    →
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="goal-related-empty">
              No applications are linked to this goal.
            </div>
          )}
        </section>
      )}
    </>
  );
}

export default GoalSupporting;
