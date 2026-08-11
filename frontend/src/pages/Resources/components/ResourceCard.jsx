function ResourceCard({
    resource,
    onEdit,
    onDelete,
    onToggleFavorite
}) {
    return (
        <div className="resource-card">

            <span className="resource-type">
                {resource.type}
            </span>

            {resource.favorite && (
                <span className="favorite-badge">
                    ★ Favorite
                </span>
            )}

            {resource.skill && (
                <p className="related-skill">
                    Skill: {resource.skill.name}
                </p>
            )}

            <h3>
                {resource.title}
            </h3>

            <div className="resource-actions">

                <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Open Resource
                </a>

                <button
                    className="edit-btn"
                    onClick={() => onEdit(resource._id)}
                >
                    Edit
                </button>

                <button
                    className="delete-btn"
                    onClick={() => onDelete(resource._id)}
                >
                    Delete
                </button>

                <button
                    className="favorite-btn"
                    onClick={() =>
                        onToggleFavorite(resource._id)
                    }
                >
                    {resource.favorite
                        ? "Unfavorite"
                        : "Favorite"}
                </button>

            </div>

        </div>
    );
}

export default ResourceCard;