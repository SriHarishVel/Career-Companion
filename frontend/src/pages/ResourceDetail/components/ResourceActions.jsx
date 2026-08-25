function ResourceActions({ onOpenResource, onEdit, onDelete, deleting }) {
  return (
    <section className="resource-detail-actions">
      <button
        type="button"
        className="resource-action-primary"
        onClick={onOpenResource}
      >
        Open Resource
      </button>

      <button
        type="button"
        className="resource-action-secondary"
        onClick={onEdit}
      >
        Edit Resource
      </button>

      <button
        type="button"
        className="resource-action-danger"
        onClick={onDelete}
        disabled={deleting}
      >
        {deleting ? "Deleting..." : "Delete Resource"}
      </button>
    </section>
  );
}

export default ResourceActions;
