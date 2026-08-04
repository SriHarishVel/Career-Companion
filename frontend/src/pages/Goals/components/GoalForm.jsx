import { useEffect } from "react";

function GoalForm({
    goalFormRef,
    editingGoalId,
    journeyStep,
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
    addGoal,
    navigate,
    handleCancelEdit,
    filteredGoals,
    goals,
    primaryGoals,
    secondaryGoals
}) {

    useEffect(() => {
        if (
            (newGoalType === "Secondary" ||
                journeyStep.action === "createSecondaryGoal") &&
            primaryGoalOptions.length === 1
        ) {
            setParentGoalId(primaryGoalOptions[0]._id);
        }
    }, [
        newGoalType,
        journeyStep.action,
        primaryGoalOptions,
        setParentGoalId,
    ]);

    return (
        <div className="add-goal-GoalCard" ref={goalFormRef}>
            <h3>
                {editingGoalId
                    ? "Edit Goal"
                    : journeyStep.action === "createPrimaryGoal"
                        ? "Create Primary Goal"
                        : journeyStep.action === "createSecondaryGoal"
                            ? "Create Secondary Goal"
                            : "Add Goal"}
            </h3>

            <input
                type="text"
                placeholder={
                    editingGoalId
                        ? "Edit Goal Title"
                        : "Goal Title"
                }
                value={newGoal}
                onChange={(e) => {
                    setNewGoal(e.target.value);
                    setErrorMsg("");
                }}
            />

            <div className="goal-options">

                <div className="filter-group">

                    <label>Category</label>

                    <select
                        value={newCategory}
                        onChange={(e) =>
                            setNewCategory(e.target.value)
                        }
                    >
                        <option value="Learning">
                            Learning
                        </option>

                        <option value="Career">
                            Career
                        </option>

                        <option value="Personal">
                            Personal
                        </option>

                        <option value="Health">
                            Health
                        </option>
                    </select>

                </div>

                <div className="filter-group">

                    <label>Priority</label>

                    <select
                        value={newPriority}
                        onChange={(e) =>
                            setNewPriority(e.target.value)
                        }
                    >
                        <option value="High">
                            High
                        </option>

                        <option value="Medium">
                            Medium
                        </option>

                        <option value="Low">
                            Low
                        </option>
                    </select>

                </div>

                {!isGuidedSetup && (
                    <div className="filter-group">

                        <label>Goal Type</label>

                        <select
                            value={newGoalType}
                            onChange={handleGoalTypeChange}
                        >
                            <option value="Primary">
                                Primary
                            </option>

                            <option
                                value="Secondary"
                                disabled={
                                    primaryGoalOptions.length === 0
                                }
                            >
                                Secondary
                            </option>
                        </select>

                    </div>
                )}

                {primaryGoalOptions.length === 0 && (
                    <small className="helper-text">
                        Create a primary goal first to unlock secondary goals.
                    </small>
                )}

                {(newGoalType === "Secondary" ||
                    journeyStep.action === "createSecondaryGoal") && (

                    primaryGoalOptions.length === 1 ? (

                        <div className="filter-group">

                            <label>Parent Goal</label>

                            <input
                                type="text"
                                value={primaryGoalOptions[0].title}
                                readOnly
                            />

                        </div>

                    ) : (

                        <div className="filter-group">

                            <label>Parent Goal</label>

                            <select
                                value={parentGoalId}
                                onChange={(e) =>
                                    setParentGoalId(e.target.value)
                                }
                            >
                                <option value="">
                                    Select Parent Goal
                                </option>

                                {primaryGoalOptions.map(goal => (
                                    <option
                                        key={goal._id}
                                        value={goal._id}
                                    >
                                        {goal.title}
                                    </option>
                                ))}

                            </select>

                        </div>

                    )
                )}

                <div className="filter-group">

                    <label>Deadline</label>

                    <input
                        type="date"
                        value={newDeadline}
                        onChange={(e) =>
                            setNewDeadline(e.target.value)
                        }
                    />

                </div>

            </div>

            {errorMsg && (
                <p className="error">
                    {errorMsg}
                </p>
            )}

            <div className="goal-form-actions">

                <button onClick={addGoal}>
                    {editingGoalId
                        ? "Update Goal"
                        : journeyStep.action === "createPrimaryGoal"
                            ? "Create Primary Goal"
                            : journeyStep.action === "createSecondaryGoal"
                                ? "Create Secondary Goal"
                                : "Add Goal"}
                </button>

                {isGuidedSetup &&
                    journeyStep.action === "createSecondaryGoal" && (
                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={() => navigate("/home")}
                        >
                            Finish Setup
                        </button>
                    )}

                {editingGoalId && (
                    <button
                        className="cancel-btn"
                        onClick={handleCancelEdit}
                    >
                        Cancel Edit
                    </button>
                )}

            </div>

            <p className="goal-counter">
                Showing {filteredGoals.length} of {goals.length} goals
            </p>

            <p className="goal-counter">
                Primary Goals: {primaryGoals.length}
            </p>

            <p className="goal-counter">
                Secondary Goals: {secondaryGoals.length}
            </p>

        </div>
    );
}

export default GoalForm;