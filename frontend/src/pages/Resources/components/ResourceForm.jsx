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
  return (
    <div className="add-resource-card">
      <div className="resource-form-header">
        <div>
          <h3>{editingResourceId ? "Edit Resource" : "Add a Resource"}</h3>

          <p>
            {editingResourceId
              ? "Update your resource details."
              : "Save a useful learning resource for your career journey."}
          </p>
        </div>
      </div>

      <div className="resource-form-fields">
        <div className="filter-group">
          <label>Resource Type</label>

          <select value={newType} onChange={(e) => setNewType(e.target.value)}>
            <option value="Documentation">Documentation</option>

            <option value="Course">Course</option>

            <option value="Video">Video</option>

            <option value="Article">Article</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Resource Title</label>

          <input
            type="text"
            placeholder="e.g. React Documentation"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Resource URL</label>

          <input
            type="url"
            placeholder="https://..."
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>
            Related Skill
            <span className="optional-label">Optional</span>
          </label>

          <select value={skillId} onChange={(e) => setSkillId(e.target.value)}>
            <option value="">No Related Skill</option>

            {skills.map((skill) => (
              <option key={skill._id} value={skill._id}>
                {skill.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {errorMsg && <p className="error">{errorMsg}</p>}

      <div className="resource-form-actions">
        <button onClick={addResource}>
          {editingResourceId ? "Update Resource" : "Add Resource"}
        </button>
      </div>
    </div>
  );
}

export default ResourceForm;
