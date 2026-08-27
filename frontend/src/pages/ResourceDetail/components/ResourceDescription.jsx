function ResourceDescription({ description }) {
  return (
    <section className="resource-description">
      <div className="resource-section-header">
        <span className="resource-description-label">Description / Notes</span>

        <h2>Resource Notes</h2>
      </div>

      {description?.trim() ? (
        <div className="resource-description-content">
          <p>{description}</p>
        </div>
      ) : (
        <div className="resource-no-description">
          <span className="resource-description-label">
            Description / Notes
          </span>

          <p>Add notes or a description when editing this resource.</p>
        </div>
      )}
    </section>
  );
}

export default ResourceDescription;
