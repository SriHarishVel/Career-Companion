function ResourceCard({ resource, onEdit, onDelete, onToggleFavorite }) {
  return (
    <div className="resource-card">
      <div className="resource-card-header">
        <div className="resource-badges">
          <span className="resource-type">{resource.type}</span>

          {resource.favorite && (
            <span className="favorite-badge">★ Favorite</span>
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
        <a href={resource.url} target="_blank" rel="noopener noreferrer">
          Open Resource
        </a>

        <button className="edit-btn" onClick={() => onEdit(resource._id)}>
          Edit
        </button>

        <button
          className="favorite-btn"
          onClick={() => onToggleFavorite(resource._id)}
        >
          {resource.favorite ? "Unfavorite" : "Favorite"}
        </button>

        <button className="delete-btn" onClick={() => onDelete(resource._id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default ResourceCard;
