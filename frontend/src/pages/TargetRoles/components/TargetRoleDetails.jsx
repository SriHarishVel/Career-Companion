import { useQuery } from "@tanstack/react-query";
import { getTargetRoleReadiness } from "../../../services/targetRoleService";
import LoadingState from "../../../components/LoadingState";

function TargetRoleDetails({ role, onClose }) {
  const {
    data: readiness,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["target-role-readiness", role._id],
    queryFn: () => getTargetRoleReadiness(role._id),
    enabled: Boolean(role?._id),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <section
        className="target-role-details"
        aria-label={`${role.title} readiness details`}
      >
        <button type="button" className="btn-secondary" onClick={onClose}>
          Back to roles
        </button>

        <LoadingState message="Analyzing role requirements..." />
      </section>
    );
  }

  if (error || !readiness) {
    return (
      <section className="target-role-details">
        <button type="button" className="btn-secondary" onClick={onClose}>
          Back to roles
        </button>

        <div className="target-role-error" role="alert">
          Unable to load this role's readiness analysis.
          <button
            type="button"
            className="btn-secondary"
            onClick={() => refetch()}
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  const { readinessScore, summary, requirements = [], gaps = [] } = readiness;

  const matchedRequirements = requirements.filter(
    (requirement) => requirement.status === "Met",
  );

  return (
    <section
      className="target-role-details"
      aria-labelledby="target-role-details-title"
    >
      <div className="target-role-details-header">
        <button type="button" className="btn-secondary" onClick={onClose}>
          ← Back to roles
        </button>

        <span className="target-role-card-label">CAREER ANALYSIS</span>

        <h2 id="target-role-details-title">{role.title}</h2>

        {role.description && <p>{role.description}</p>}
      </div>

      <div className="target-role-details-overview">
        <article className="target-role-details-score">
          <span className="readiness-metric-label">Readiness score</span>

          <strong>
            {readinessScore == null ? "N/A" : `${readinessScore}%`}
          </strong>

          <p>
            {readinessScore == null
              ? "Add skill requirements to calculate readiness."
              : "Based on the proficiency levels recorded for your skills."}
          </p>
        </article>

        <article className="readiness-metric">
          <span className="readiness-metric-label">Requirements met</span>
          <strong>
            {summary?.metRequirements ?? matchedRequirements.length}/
            {summary?.totalRequirements ?? requirements.length}
          </strong>
          <span className="readiness-metric-note">
            Skills at the required level
          </span>
        </article>

        <article className="readiness-metric">
          <span className="readiness-metric-label">Skill gaps</span>
          <strong>{gaps.length}</strong>
          <span className="readiness-metric-note">
            Requirements needing attention
          </span>
        </article>
      </div>

      <div className="target-role-details-section">
        <div className="target-role-details-section-heading">
          <div>
            <h3>Skill requirements</h3>
          </div>
        </div>

        {requirements.length === 0 ? (
          <div className="target-role-no-requirements">
            No requirements have been added to this role yet.
          </div>
        ) : (
          <div className="target-role-requirements-list">
            {requirements.map((requirement) => (
              <article
                className="target-role-requirement-item"
                key={requirement.skillId || requirement.skillName}
              >
                <div className="target-role-requirement-item-main">
                  <h4>{requirement.skillName}</h4>

                  <p>
                    {requirement.category || "Other"} ·{" "}
                    {requirement.importance || "Medium"} importance
                  </p>
                </div>

                <div className="target-role-requirement-levels">
                  <span>
                    Current: {requirement.currentLevel || "Not tracked"}
                  </span>

                  <span>Required: {requirement.requiredLevel}</span>
                </div>

                <span
                  className={`target-role-requirement-status ${
                    requirement.status === "Met"
                      ? "is-met"
                      : requirement.status === "Missing"
                        ? "is-missing"
                        : "is-below-level"
                  }`}
                >
                  {requirement.status}
                </span>
              </article>
            ))}
          </div>
        )}
      </div>

      {gaps.length > 0 && (
        <div className="target-role-details-section">
          <div className="target-role-details-section-heading">
            <div>
              <h3>Prioritized skill gaps</h3>
              <p>
                Address important gaps first, then work through the remaining
                requirements.
              </p>
            </div>
          </div>

          <div className="target-role-prioritized-gaps">
            {gaps.map((gap, index) => (
              <article
                className="target-role-prioritized-gap"
                key={gap.skillName}
              >
                <span className="target-role-gap-number">{index + 1}</span>

                <div>
                  <h4>{gap.skillName}</h4>
                  <p>
                    {gap.status === "Missing"
                      ? "Create this skill in your Skills section and start tracking your development."
                      : `Develop this skill to the ${gap.requiredLevel} level.`}
                  </p>
                </div>

                <span
                  className={`gap-status ${
                    gap.importance === "High"
                      ? "is-missing"
                      : gap.importance === "Low"
                        ? "is-below-level"
                        : ""
                  }`}
                >
                  {gap.importance || "Medium"} priority
                </span>
              </article>
            ))}
          </div>
        </div>
      )}

      {requirements.length > 0 && gaps.length === 0 && (
        <div className="target-role-no-gaps">
          All requirements for this role are currently met.
        </div>
      )}
    </section>
  );
}

export default TargetRoleDetails;