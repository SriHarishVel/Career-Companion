function SkillResources({
  skillName,
  resources,
  completedResources,
  resourceProgress,
  onManageResources,
}) {
  return (
    <section className="skill-resources-section">
      <div className="skill-resources-header">
        <div>
          <span className="section-label">Learning Resources</span>

          <h2>Resources for {skillName}</h2>

          <p>Materials connected to this skill.</p>
        </div>

        <div className="skill-resources-header-actions">
          <div className="resource-summary">
            <strong>
              {completedResources}/{resources.length}
            </strong>

            <span>completed</span>
          </div>

          <button
            type="button"
            className="skill-resource-action"
            onClick={onManageResources}
          >
            Manage Resources
          </button>
        </div>
      </div>

      {resources.length > 0 && (
        <div className="resource-progress-summary">
          <div className="resource-progress-track">
            <div
              className="resource-progress-fill"
              style={{
                width: `${resourceProgress}%`,
              }}
            />
          </div>

          <span>{resourceProgress}% of tracked resources completed</span>
        </div>
      )}

      {resources.length > 0 ? (
        <div className="skill-resources-list">
          {resources.map((resource) => (
            <article
              className={`skill-resource-item ${
                resource.completed ? "completed" : ""
              }`}
              key={resource._id}
            >
              <div className="resource-status">
                {resource.completed ? "✓" : "○"}
              </div>

              <div className="resource-content">
                <h3>{resource.title}</h3>

                {resource.description && <p>{resource.description}</p>}

                <span>{resource.type || "Resource"}</span>
              </div>

              {resource.url && (
                <a
                  className="resource-open-btn"
                  href={
                    resource.url.startsWith("http://") ||
                    resource.url.startsWith("https://")
                      ? resource.url
                      : `https://${resource.url}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open
                </a>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="skill-resources-empty">
          <h3>No resources yet</h3>

          <p>Add learning resources for this skill from the Resources page.</p>

          <button
            type="button"
            className="skill-resource-action"
            onClick={onManageResources}
          >
            Add Resources
          </button>
        </div>
      )}
    </section>
  );
}

export default SkillResources;
