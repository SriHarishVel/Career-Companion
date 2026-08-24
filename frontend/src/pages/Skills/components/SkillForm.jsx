function SkillForm({
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
}) {
  return (
    <div className="skill-form-content">
      <div className="skill-form-fields">
        <div className="filter-group">
          <label htmlFor="skill-name">Skill Name</label>

          <input
            id="skill-name"
            type="text"
            placeholder="e.g. React"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="skill-category">Category</label>

          <select
            id="skill-category"
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
          <label htmlFor="skill-goal">
            Related Goal
            <span className="optional-label">Optional</span>
          </label>

          <select
            id="skill-goal"
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
          <label htmlFor="skill-resource">
            Learning Resource
            <span className="optional-label">Optional</span>
          </label>

          <input
            id="skill-resource"
            type="url"
            placeholder="https://..."
            value={newResource}
            onChange={(e) => setNewResource(e.target.value)}
          />
        </div>
      </div>

      {errorMsg && <p className="error">{errorMsg}</p>}
    </div>
  );
}

export default SkillForm;
