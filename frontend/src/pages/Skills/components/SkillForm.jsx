function SkillForm({
  editingSkillId,
  newSkill,
  setNewSkill,
  newCategory,
  setNewCategory,
  secondaryGoalId,
  setSecondaryGoalId,
  secondaryGoalOptions,
  newResource,
  setNewResource,
  errorMsg,
  addSkill,
  handleCancelEdit,
  skillFormRef,
}) {
  return (
    <div className="add-skill-card" ref={skillFormRef}>
      <div className="skill-form-header">
        <div>
          <h3>{editingSkillId ? "Edit Skill" : "Add a Skill"}</h3>

          <p>
            {editingSkillId
              ? "Update your skill details."
              : "Add a skill you want to develop."}
          </p>
        </div>
      </div>

      <div className="skill-form-fields">
        <div className="filter-group">
          <label>Skill Name</label>

          <input
            type="text"
            placeholder="e.g. React"
            value={newSkill}
            onChange={(e) => {
              setNewSkill(e.target.value);
            }}
          />
        </div>

        <div className="filter-group">
          <label>Category</label>

          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          >
            <option value="Programming">Programming</option>

            <option value="Database">Database</option>

            <option value="Framework">Framework</option>

            <option value="Tools">Tools</option>

            <option value="Soft Skills">Soft Skills</option>

            <option value="Other">Other</option>
          </select>
        </div>

        <div className="filter-group">
          <label>
            Related Goal
            <span className="optional-label">Optional</span>
          </label>

          <select
            value={secondaryGoalId}
            onChange={(e) => setSecondaryGoalId(e.target.value)}
          >
            <option value="">No Related Goal</option>

            {secondaryGoalOptions.map((goal) => (
              <option key={goal._id} value={goal._id}>
                {goal.title}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>
            Learning Resource
            <span className="optional-label">Optional</span>
          </label>

          <input
            type="url"
            placeholder="https://..."
            value={newResource}
            onChange={(e) => setNewResource(e.target.value)}
          />
        </div>
      </div>

      {errorMsg && <p className="error">{errorMsg}</p>}

      <div className="skill-form-actions">
        <button onClick={addSkill}>
          {editingSkillId ? "Update Skill" : "Add Skill"}
        </button>

        {editingSkillId && (
          <button className="cancel-btn" onClick={handleCancelEdit}>
            Cancel Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default SkillForm;
