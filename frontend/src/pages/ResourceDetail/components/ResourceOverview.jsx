import { API_BASE_URL } from "../../../api/axios";

function ResourceOverview({
  title,
  type,
  url,
  source,
  file,
  favorite,
  completed,
  onOpenResource,
  onToggleFavorite,
  onToggleCompleted,
}) {
  const resourceUrl =
    source === "upload" && file?.filename
      ? `${API_BASE_URL}/uploads/resources/${file.filename}`
      : url;

  return (
    <section className="resource-overview">
      <div className="resource-overview-header">
        <div className="resource-overview-title">
          <div className="resource-detail-badges">
            <span className="resource-detail-type">{type || "Resource"}</span>

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

      {source === "upload" && file ? (
        <div className="resource-url">
          <span className="resource-url-label">Uploaded File</span>

          <span>{file.originalName}</span>
        </div>
      ) : (
        url && (
          <div className="resource-url">
            <span className="resource-url-label">Resource URL</span>

            <a href={url} target="_blank" rel="noopener noreferrer">
              {url}
            </a>
          </div>
        )
      )}

      <div className="resource-overview-actions">
        {resourceUrl && (
          <button
            type="button"
            className="btn-primary"
            onClick={onOpenResource}
          >
            Open Resource
          </button>
        )}

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
