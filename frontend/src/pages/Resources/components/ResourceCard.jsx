import { useNavigate } from "react-router-dom";

function ResourceCard({ resource, onToggleFavorite }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/resources/${resource._id}`);
  };

  return (
    <article
      className="resource-card"
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

      <div className="resource-card-header">
        <div className="resource-badges">
          <span className="resource-type">{resource.type || "Resource"}</span>
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
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => event.stopPropagation()}
        >
          Open Resource
        </a>
      </div>
    </article>
  );
}

export default ResourceCard;
