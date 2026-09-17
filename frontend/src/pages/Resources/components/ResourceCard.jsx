import { useNavigate } from "react-router-dom";

import { API_BASE_URL } from "../../../api/axios";

function ResourceCard({ resource, onToggleFavorite }) {
  const navigate = useNavigate();

  function handleCardClick() {
    navigate(`/resources/${resource._id}`);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick();
    }
  }

  function getResourceUrl() {
    if (resource.source === "upload" && resource.file?.filename) {
      return `${API_BASE_URL}/uploads/resources/${resource.file.filename}`;
    }

    return resource.url;
  }

  const resourceUrl = getResourceUrl();

  return (
    <article
      className={`card resource-card ${
        resource.completed ? "card-success" : ""
      }`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
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

      <div className="card-header resource-card-header">
        <div className="resource-badges">
          <span className="resource-type">{resource.type || "Resource"}</span>

          {resource.completed && (
            <span className="resource-completed-badge">✓ Completed</span>
          )}
        </div>

        <h3>{resource.title}</h3>
      </div>

      {resource.skill && (
        <div className="related-skill">
          <span className="related-skill-label">Related Skill</span>
          <span className="related-skill-title">{resource.skill.name}</span>
        </div>
      )}

      <div className="resource-actions">
        {resourceUrl && (
          <a
            href={resourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="open-resource-btn"
            onClick={(event) => event.stopPropagation()}
          >
            Open Resource
          </a>
        )}
      </div>
    </article>
  );
}

export default ResourceCard;