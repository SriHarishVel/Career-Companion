import FormDialog from "../../../components/FormDialog";

function ResourceForm({
  isOpen,
  onClose,
  editingResourceId,
  newType,
  setNewType,
  newTitle,
  setNewTitle,
  newUrl,
  setNewUrl,
  source,
  setSource,
  file,
  setFile,
  skillId,
  setSkillId,
  skills,
  errorMsg,
  addResource,
}) {
  const isEditing = Boolean(editingResourceId);

  function handleSourceChange(event) {
    const selectedSource = event.target.value;

    setSource(selectedSource);

    if (selectedSource === "upload") {
      setNewUrl("");
    } else {
      setFile(null);
    }
  }

  function handleFileChange(event) {
    const selectedFile = event.target.files[0] || null;

    setFile(selectedFile);
  }

  return (
    <FormDialog
      isOpen={isOpen}
      title={isEditing ? "Edit Resource" : "Add a Resource"}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>

          <button type="button" className="btn-primary" onClick={addResource}>
            {isEditing ? "Update Resource" : "Add Resource"}
          </button>
        </>
      }
    >
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
            <option value="Audio">Audio</option>
            <option value="Article">Article</option>
            <option value="Book">Book</option>
            <option value="Practice">Practice</option>
            <option value="PDF">PDF</option>
            <option value="Image">Image</option>
            <option value="Other">Other</option>
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
          <label htmlFor="resource-source">Resource Source</label>

          <select
            id="resource-source"
            value={source}
            onChange={handleSourceChange}
          >
            <option value="external">External URL</option>
            <option value="upload">Upload File</option>
          </select>
        </div>

        {source === "external" ? (
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
        ) : (
          <div className="filter-group">
            <label htmlFor="resource-file">Upload File</label>

            <input id="resource-file" type="file" onChange={handleFileChange} />

            {file && (
              <span className="resource-file-name">Selected: {file.name}</span>
            )}
          </div>
        )}

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
    </FormDialog>
  );
}

export default ResourceForm;