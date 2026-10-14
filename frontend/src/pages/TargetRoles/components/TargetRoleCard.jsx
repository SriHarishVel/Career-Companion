function TargetRoleCard({
  role,
  readiness,
  readinessLoading,
  deleting,
  onViewDetails,
  onEdit,
  onDelete,
}) {
  const score = readiness?.readinessScore;
  const gaps = readiness?.gaps || [];
  const requirementCount = readiness?.summary?.totalRequirements ?? 0;
  const metCount = readiness?.summary?.metRequirements ?? 0;

  return (
    <article className="card target-role-card">
      <div className="target-role-card-header">
        <div className="target-role-title-group">
          <span className="target-role-card-label">TARGET ROLE</span>
          <div className="card-header">
            <h3>{role.title}</h3>
          </div>
        </div>

        {readinessLoading ? (
          <span className="readiness-score unavailable">Loading</span>
        ) : score != null ? (
          <div
            className="readiness-score-ring"
            role="img"
            aria-label={`${score}% readiness for ${role.title}`}
            style={{ "--readiness-progress": `${score}%` }}
          >
            <div className="readiness-score-ring-inner">
              <strong>{score}%</strong>
              <span>ready</span>
            </div>
          </div>
        ) : (
          <span className="readiness-score unavailable">Not assessed</span>
        )}
      </div>

      {role.description && (
        <p className="target-role-description">{role.description}</p>
      )}

      {readinessLoading ? (
        <p className="target-role-loading">Analyzing skill requirements...</p>
      ) : readiness ? (
        <>
          {requirementCount > 0 ? (
            <>
              <div className="target-role-match-summary">
                <span>
                  <strong>{metCount}</strong> of {requirementCount} requirements
                  met
                </span>
                <span>{requirementCount - metCount} remaining</span>
              </div>

              <div
                className="progress-bar target-role-progress"
                role="progressbar"
                aria-label={`${role.title} requirements met`}
                aria-valuemin={0}
                aria-valuemax={requirementCount}
                aria-valuenow={metCount}
              >
                <div
                  className="progress-fill"
                  style={{
                    width: `${(metCount / requirementCount) * 100}%`,
                  }}
                />
              </div>
            </>
          ) : (
            <p className="target-role-no-requirements">
              Add skill requirements to assess your readiness for this role.
            </p>
          )}

          <div className="target-role-gap-section">
            <div className="target-role-gap-heading">
              <h4>Skill gap analysis</h4>
              {gaps.length > 0 && (
                <span className="target-role-gap-count">{gaps.length}</span>
              )}
            </div>

            {gaps.length > 0 ? (
              <ul className="target-role-gap-list">
                {gaps.slice(0, 3).map((gap) => (
                  <li key={gap.skillName}>
                    <span
                      className={`target-role-gap-indicator ${
                        gap.status === "Missing"
                          ? "is-missing"
                          : "is-below-level"
                      }`}
                      aria-hidden="true"
                    />

                    <span className="target-role-gap-name">
                      {gap.skillName}
                    </span>

                    <span
                      className={`gap-status ${
                        gap.status === "Missing"
                          ? "is-missing"
                          : "is-below-level"
                      }`}
                    >
                      {gap.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : requirementCount > 0 ? (
              <p className="target-role-no-gaps">
                All role requirements are met.
              </p>
            ) : null}

            {gaps.length > 3 && (
              <p className="more-gaps">+{gaps.length - 3} more skill gaps</p>
            )}
          </div>
        </>
      ) : (
        <p className="target-role-loading">Readiness data is unavailable.</p>
      )}

      <button
        type="button"
        className="btn-secondary target-role-details-button"
        onClick={() => onViewDetails(role)}
      >
        View Full Analysis
        <span aria-hidden="true">→</span>
      </button>

      <div className="target-role-card-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => onEdit(role)}
        >
          Edit Role
        </button>

        <button
          type="button"
          className="btn-danger-outline"
          onClick={() => onDelete(role)}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
}

export default TargetRoleCard;