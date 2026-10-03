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

          <span className="goal-related-count">{sectionItems.length}</span>
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

                    {meta && <span className="goal-related-level">{meta}</span>}
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
                        {Math.max(0, Math.min(100, Number(item.progress) || 0))}
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

      {isPrimary &&
        renderRelatedSection({
          eyebrow: "RELATED APPLICATIONS",
          title: "Applications for this goal",
          items: relatedApplications,
          emptyMessage: "No applications are linked to this goal.",
          getTitle: (item) => `${item.role} at ${item.company}`,
          getMeta: (item) => item.status || "",
          getPath: (item) => `/applications/${item._id}`,
        })}
    </>
  );
}

export default GoalSupporting;