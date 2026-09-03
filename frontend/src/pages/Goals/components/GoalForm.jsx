import FormDialog from "../../../components/FormDialog";

function GoalForm({
  isOpen,
  onClose,
  title = "Add Goal",
  onSubmit,
  submitLabel = "Add Goal",
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
    <FormDialog
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            className="form-dialog-cancel"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="form-dialog-submit"
            onClick={onSubmit}
          >
            {submitLabel}
          </button>
        </>
      }
    >
      <div className="goal-form-content">
        <div className="goal-field goal-title-field">
          <label htmlFor="goal-title">Goal Title</label>

          <input
            id="goal-title"
            type="text"
            placeholder="e.g. Become a full-stack developer"
            value={newGoal}
            onChange={(event) => {
              setNewGoal(event.target.value);
              setErrorMsg("");
            }}
          />
        </div>

        <div className="goal-options">
          <div className="goal-field">
            <label htmlFor="goal-category">Category</label>

            <select
              id="goal-category"
              value={newCategory}
              onChange={(event) => setNewCategory(event.target.value)}
            >
              <option value="Learning">Learning</option>
              <option value="Career">Career</option>
              <option value="Personal">Personal</option>
              <option value="Health">Health</option>
            </select>
          </div>

          <div className="goal-field">
            <label htmlFor="goal-priority">Priority</label>

            <select
              id="goal-priority"
              value={newPriority}
              onChange={(event) => setNewPriority(event.target.value)}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {!isGuidedSetup && (
            <div className="goal-field">
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
            <div className="goal-field">
              <label htmlFor="parent-goal">Parent Goal</label>

              <select
                id="parent-goal"
                value={parentGoalId}
                onChange={(event) => setParentGoalId(event.target.value)}
              >
                <option value="">Select parent goal</option>

                {primaryGoalOptions.map((goal) => (
                  <option key={goal._id} value={goal._id}>
                    {goal.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="goal-field">
            <label htmlFor="goal-deadline">Deadline</label>

            <input
              id="goal-deadline"
              type="date"
              value={newDeadline}
              onChange={(event) => setNewDeadline(event.target.value)}
            />
          </div>
        </div>

        {primaryGoalOptions.length === 0 && (
          <p className="helper-text">
            Create a primary goal first to unlock secondary goals.
          </p>
        )}

        {errorMsg && (
          <p className="error" role="alert">
            {errorMsg}
          </p>
        )}
      </div>
    </FormDialog>
  );
}

export default GoalForm;
