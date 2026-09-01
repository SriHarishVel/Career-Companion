import { useNavigate } from "react-router-dom";

function ResourceCard({ resource, onToggleFavorite }) {
  const navigate = useNavigate();

  function handleCardClick() {
    navigate(`/resources/${resource._id}`);
  }

  return (
    <article
      className={`resource-card ${
        resource.completed ? "resource-card-completed" : ""
      }`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Favorite */}

      <button
        type="button"
        className={`favorite-star ${resource.favorite ? "active" : ""}`}
        onClick={(event) => {
          event.stopPropagation();
          onToggleFavorite(resource._id);
        }}
        aria-label={
          resource.favorite ? "Unfavorite resource" : "Favorite resource"
        }
      >
        {resource.favorite ? "★" : "☆"}
      </button>

      {/* Header */}

      <div className="resource-card-header">
        <div className="resource-badges">
          <span className="resource-type">{resource.type || "Resource"}</span>

          {resource.completed && (
            <span className="resource-completed-badge">✓ Completed</span>
          )}
        </div>

        <h3>{resource.title}</h3>
      </div>

      {/* Related Skill */}

      {resource.skill && (
        <div className="related-skill">
          <span className="related-skill-label">Related Skill</span>

          <span className="related-skill-title">{resource.skill.name}</span>
        </div>
      )}

      {/* Actions */}

      <div className="resource-actions">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="open-resource-btn"
          onClick={(event) => event.stopPropagation()}
        >
          Open Resource
        </a>
      </div>
    </article>
  );
}

export default ResourceCard;
