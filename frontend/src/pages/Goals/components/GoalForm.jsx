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
    handleCancelEdit
}) {

    useEffect(() => {

        if (
            (newGoalType === "Secondary" ||
                journeyStep?.action === "createSecondaryGoal") &&
            primaryGoalOptions.length === 1
        ) {
            setParentGoalId(
                primaryGoalOptions[0]._id
            );
        }

    }, [
        newGoalType,
        journeyStep?.action,
        primaryGoalOptions,
        setParentGoalId
    ]);

    const isCreatingPrimary =
        journeyStep?.action === "createPrimaryGoal";

    const isCreatingSecondary =
        journeyStep?.action === "createSecondaryGoal";

    const formTitle = editingGoalId
        ? "Edit Goal"
        : isCreatingPrimary
            ? "Create Primary Goal"
            : isCreatingSecondary
                ? "Create Secondary Goal"
                : "Add Goal";

    const submitLabel = editingGoalId
        ? "Update Goal"
        : isCreatingPrimary
            ? "Create Primary Goal"
            : isCreatingSecondary
                ? "Create Secondary Goal"
                : "Add Goal";

    const requiresParentGoal =
        newGoalType === "Secondary" ||
        isCreatingSecondary;

    return (
        <div
            className="add-goal-card"
            ref={goalFormRef}
        >

            <div className="goal-form-header">

                <div>
                    <h3>{formTitle}</h3>

                    {!editingGoalId && !isGuidedSetup && (
                        <p className="goal-form-description">
                            Add a goal and define how you want to track it.
                        </p>
                    )}
                </div>

            </div>

            <div className="filter-group">

                <label htmlFor="goal-title">
                    Goal Title
                </label>

                <input
                    id="goal-title"
                    type="text"
                    placeholder={
                        editingGoalId
                            ? "Edit goal title"
                            : "Enter your goal"
                    }
                    value={newGoal}
                    onChange={(e) => {
                        setNewGoal(e.target.value);
                        setErrorMsg("");
                    }}
                />

            </div>

            <div className="goal-options">

                <div className="filter-group">

                    <label htmlFor="goal-category">
                        Category
                    </label>

                    <select
                        id="goal-category"
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

                    <label htmlFor="goal-priority">
                        Priority
                    </label>

                    <select
                        id="goal-priority"
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

                        <label htmlFor="goal-type">
                            Goal Type
                        </label>

                        <select
                            id="goal-type"
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

                {requiresParentGoal && (
                    primaryGoalOptions.length === 1 ? (

                        <div className="filter-group">

                            <label htmlFor="parent-goal">
                                Parent Goal
                            </label>

                            <input
                                id="parent-goal"
                                type="text"
                                value={
                                    primaryGoalOptions[0].title
                                }
                                readOnly
                            />

                        </div>

                    ) : (

                        <div className="filter-group">

                            <label htmlFor="parent-goal">
                                Parent Goal
                            </label>

                            <select
                                id="parent-goal"
                                value={parentGoalId}
                                onChange={(e) =>
                                    setParentGoalId(
                                        e.target.value
                                    )
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

                    <label htmlFor="goal-deadline">
                        Deadline
                    </label>

                    <input
                        id="goal-deadline"
                        type="date"
                        value={newDeadline}
                        onChange={(e) =>
                            setNewDeadline(e.target.value)
                        }
                    />

                </div>

            </div>

            {primaryGoalOptions.length === 0 && (
                <p className="helper-text">
                    Create a primary goal first to unlock secondary goals.
                </p>
            )}

            {errorMsg && (
                <p className="error">
                    {errorMsg}
                </p>
            )}

            <div className="goal-form-actions">

                <button
                    type="button"
                    onClick={addGoal}
                >
                    {submitLabel}
                </button>

                {isGuidedSetup &&
                    isCreatingSecondary && (
                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={() => navigate("/")}
                        >
                            Finish Setup
                        </button>
                    )}

                {editingGoalId && (
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={handleCancelEdit}
                    >
                        Cancel Edit
                    </button>
                )}

            </div>

        </div>
    );
}

export default GoalForm;