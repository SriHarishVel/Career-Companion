function GoalForm({
  newGoal,
  setNewGoal,
  newCategory,
  setNewCategory,
  newPriority,
  setNewPriority,
  isGuidedSetup,
  newGoalType,
  handleGoalTypeChange,
  primaryGoalOptions,
  parentGoalId,
  setParentGoalId,
  newDeadline,
  setNewDeadline,
  errorMsg,
  setErrorMsg,
}) {
  const requiresParentGoal = newGoalType === "Secondary";

  return (
    <div className="goal-form-content">
      <div className="filter-group">
        <label htmlFor="goal-title">Goal Title</label>

        <input
          id="goal-title"
          type="text"
          placeholder="Enter your goal"
          value={newGoal}
          onChange={(e) => {
            setNewGoal(e.target.value);
            setErrorMsg("");
          }}
        />
      </div>

      <div className="goal-options">
        <div className="filter-group">
          <label htmlFor="goal-category">Category</label>

          <select
            id="goal-category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          >
            <option value="Learning">Learning</option>
            <option value="Career">Career</option>
            <option value="Personal">Personal</option>
            <option value="Health">Health</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="goal-priority">Priority</label>

          <select
            id="goal-priority"
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {!isGuidedSetup && (
          <div className="filter-group">
            <label htmlFor="goal-type">Goal Type</label>

            <select
              id="goal-type"
              value={newGoalType}
              onChange={handleGoalTypeChange}
            >
              <option value="Primary">Primary</option>

              <option
                value="Secondary"
                disabled={primaryGoalOptions.length === 0}
              >
                Secondary
              </option>
            </select>
          </div>
        )}

        {requiresParentGoal && (
          <div className="filter-group">
            <label htmlFor="parent-goal">Parent Goal</label>

            <select
              id="parent-goal"
              value={parentGoalId}
              onChange={(e) => setParentGoalId(e.target.value)}
            >
              <option value="">Select Parent Goal</option>

              {primaryGoalOptions.map((goal) => (
                <option key={goal._id} value={goal._id}>
                  {goal.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="filter-group">
          <label htmlFor="goal-deadline">Deadline</label>

          <input
            id="goal-deadline"
            type="date"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
          />
        </div>
      </div>

      {primaryGoalOptions.length === 0 && (
        <p className="helper-text">
          Create a primary goal first to unlock secondary goals.
        </p>
      )}

      {errorMsg && <p className="error">{errorMsg}</p>}
    </div>
  );
}

export default GoalForm;
