function ResourceForm({
  editingResourceId,
  newType,
  setNewType,
  newTitle,
  setNewTitle,
  newUrl,
  setNewUrl,
  skillId,
  setSkillId,
  skills,
  errorMsg,
  addResource,
}) {
  const isEditing = Boolean(editingResourceId);

  return (
    <section className="add-resource-card">
      <div className="resource-form-header">
        <div>
          <span className="resource-section-label">
            {isEditing ? "Edit Resource" : "New Resource"}
          </span>

          <h3>{isEditing ? "Update Resource" : "Add a Resource"}</h3>

          <p>
            {isEditing
              ? "Update your resource details."
              : "Save a useful learning resource for your career journey."}
          </p>
        </div>
      </div>

      <div className="resource-form-fields">
        <div className="filter-group">
          <label htmlFor="resource-type">Resource Type</label>

          <select
            id="resource-type"
            value={newType}
            onChange={(event) => setNewType(event.target.value)}
          >
            <option value="Documentation">Documentation</option>
            <option value="Course">Course</option>
            <option value="Video">Video</option>
            <option value="Article">Article</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="resource-title">Resource Title</label>

          <input
            id="resource-title"
            type="text"
            placeholder="e.g. React Documentation"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="resource-url">Resource URL</label>

          <input
            id="resource-url"
            type="url"
            placeholder="https://..."
            value={newUrl}
            onChange={(event) => setNewUrl(event.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="resource-skill">
            Related Skill
            <span className="optional-label">Optional</span>
          </label>

          <select
            id="resource-skill"
            value={skillId}
            onChange={(event) => setSkillId(event.target.value)}
          >
            <option value="">No Related Skill</option>

            {skills.map((skill) => (
              <option key={skill._id} value={skill._id}>
                {skill.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {errorMsg && (
        <p className="error" role="alert">
          {errorMsg}
        </p>
      )}

      <div className="resource-form-actions">
        <button type="button" onClick={addResource}>
          {isEditing ? "Update Resource" : "Add Resource"}
        </button>
      </div>
    </section>
  );
}

export default ResourceForm;
