import { useNavigate } from "react-router-dom";

function SkillResources({
  skillName,
  resources = [],
  completedResources = 0,
  resourceProgress = 0,
  onManageResources,
}) {
  const navigate = useNavigate();

  const safeResourceProgress = Math.min(
    Math.max(Number(resourceProgress) || 0, 0),
    100,
  );

  const handleResourceDetails = (resourceId) => {
    navigate(`/resources/${resourceId}`);
  };

  return (
    <section className="skill-resources-section">
      {/* Header */}
      <div className="skill-resources-header">
        <div className="skill-resources-heading">
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
            className="skill-resource-manage-btn"
            onClick={onManageResources}
          >
            Manage Resources
          </button>
        </div>
      </div>

      {/* Progress */}
      {resources.length > 0 && (
        <div className="resource-progress-summary">
          <div
            className="resource-progress-track"
            role="progressbar"
            aria-valuenow={safeResourceProgress}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label="Learning resource completion"
          >
            <div
              className="resource-progress-fill"
              style={{
                width: `${safeResourceProgress}%`,
              }}
            />
          </div>

          <span>{safeResourceProgress}% completed</span>
        </div>
      )}

      {/* Resources */}
      {resources.length > 0 ? (
        <div className="skill-resources-list">
          {resources.map((resource) => (
            <article
              className={`skill-resource-item ${
                resource.completed ? "completed" : ""
              }`}
              key={resource._id}
            >
              <button
                type="button"
                className="skill-resource-content-button"
                onClick={() => handleResourceDetails(resource._id)}
                aria-label={`View details for ${resource.title}`}
              >
                <span className="resource-status" aria-hidden="true">
                  {resource.completed ? "✓" : "○"}
                </span>

                <span className="resource-content">
                  <span className="resource-title">{resource.title}</span>

                  {resource.description && (
                    <span className="resource-description">
                      {resource.description}
                    </span>
                  )}

                  <span className="resource-type">
                    {resource.type || "Resource"}
                  </span>
                </span>
              </button>

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
                  onClick={(event) => event.stopPropagation()}
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

          <p>
            Add learning resources to start building your knowledge of this
            skill.
          </p>

          <button
            type="button"
            className="skill-resource-empty-btn"
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
