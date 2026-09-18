function ResourceOverview({ resource, onToggleFavorite, onToggleCompleted }) {
  const { title, favorite, completed, items = [] } = resource;

  return (
    <section className="resource-overview">
      <div className="resource-overview-header">
        <div className="resource-overview-title">
          <div className="resource-detail-badges">
            <span className="resource-detail-type">Resource</span>

            {completed && (
              <span className="resource-detail-completed-badge">Finished</span>
            )}
          </div>

          <h1>{title}</h1>
        </div>

        <button
          type="button"
          className={`resource-detail-favorite-star ${
            favorite ? "active" : ""
          }`}
          onClick={onToggleFavorite}
          aria-label={favorite ? "Unfavorite resource" : "Favorite resource"}
          title={favorite ? "Unfavorite" : "Favorite"}
        >
          {favorite ? "★" : "☆"}
        </button>
      </div>

      <div className="resource-overview-summary">
        <span>
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="resource-overview-actions">
        <button
          type="button"
          className={completed ? "btn-success" : "btn-secondary"}
          onClick={onToggleCompleted}
        >
          {completed ? "Mark as Unfinished" : "Mark as Finished"}
        </button>
      </div>
    </section>
  );
}

export default ResourceOverview;
