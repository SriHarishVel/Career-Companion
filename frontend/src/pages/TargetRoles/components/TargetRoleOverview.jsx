function TargetRoleOverview({
  roleCount,
  averageReadiness,
  totalMetRequirements,
  totalRequirements,
  totalSkillGaps,
  isLoading,
}) {
  return (
    <section
      className="career-readiness-overview"
      aria-label="Career readiness overview"
    >
      <div className="readiness-overview-heading">
        <div>
          <h2>Your overview</h2>
        </div>

        <span className="roles-count">
          {roleCount} {roleCount === 1 ? "role" : "roles"}
        </span>
      </div>

      <div className="readiness-metrics">
        <article className="readiness-metric readiness-metric-primary">
          <span className="readiness-metric-label">Average readiness</span>

          <strong>
            {isLoading
              ? "—"
              : averageReadiness == null
                ? "N/A"
                : `${averageReadiness}%`}
          </strong>

          <span className="readiness-metric-note">Across assessed roles</span>
        </article>

        <article className="readiness-metric">
          <span className="readiness-metric-label">Skills matched</span>

          <strong>
            {isLoading ? "—" : `${totalMetRequirements}/${totalRequirements}`}
          </strong>

          <span className="readiness-metric-note">
            Requirements currently met
          </span>
        </article>

        <article className="readiness-metric">
          <span className="readiness-metric-label">Skill gaps</span>

          <strong>{isLoading ? "—" : totalSkillGaps}</strong>

          <span className="readiness-metric-note">Requirements to improve</span>
        </article>
      </div>
    </section>
  );
}

export default TargetRoleOverview;
