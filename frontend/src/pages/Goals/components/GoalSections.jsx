import GoalCard from "./GoalCard";
import ConfirmModal from "../../../components/ConfirmModal";

function GoalSections({
    goals,
    primaryGoals,
    secondaryGoals,
    getChildGoals,
    getParentGoalTitle,
    handleProgress,
    editGoal,
    completedGoal,
    setCompletedGoal,
    showDeleteModal,
    confirmDeleteGoal,
    setShowDeleteModal,
    setSelectedGoalId
}) {

    function handleDelete(goalId) {
        setSelectedGoalId(goalId);
        setShowDeleteModal(true);
    }

    return (
        <>

            <div className="goal-summary">

                <span>
                    {goals.length}{" "}
                    {goals.length === 1
                        ? "goal"
                        : "goals"}
                </span>

                <span>
                    {primaryGoals.length} primary
                </span>

                <span>
                    {secondaryGoals.length} secondary
                </span>

            </div>

            {goals.length > 0 ? (
                <>

                    {primaryGoals.length > 0 && (
                        <section className="goal-section">

                            <h2 className="goal-section-title">
                                Primary Goals
                            </h2>

                            <div className="goals-grid">

                                {primaryGoals.map(goal => (

                                    <GoalCard
                                        key={goal._id}
                                        id={goal._id}
                                        title={goal.title}
                                        progress={goal.progress}
                                        category={goal.category}
                                        priority={goal.priority}
                                        goalType={goal.goalType}
                                        childGoals={
                                            getChildGoals(
                                                goal._id
                                            )
                                        }
                                        deadline={goal.deadline}
                                        completed={goal.completed}
                                        onProgress={null}
                                        onEdit={editGoal}
                                        onDelete={handleDelete}
                                    />

                                ))}

                            </div>

                        </section>
                    )}

                    {secondaryGoals.length > 0 && (
                        <section className="goal-section">

                            <h2 className="goal-section-title">
                                Secondary Goals
                            </h2>

                            <div className="goals-grid">

                                {secondaryGoals.map(goal => (

                                    <GoalCard
                                        key={goal._id}
                                        id={goal._id}
                                        title={goal.title}
                                        progress={goal.progress}
                                        category={goal.category}
                                        priority={goal.priority}
                                        goalType={goal.goalType}
                                        parentGoalTitle={
                                            getParentGoalTitle(
                                                goal.parentGoal?._id
                                            )
                                        }
                                        deadline={goal.deadline}
                                        completed={goal.completed}
                                        onProgress={handleProgress}
                                        onEdit={editGoal}
                                        onDelete={handleDelete}
                                    />

                                ))}

                            </div>

                        </section>
                    )}

                </>
            ) : (
                <div className="empty-state">

                    <h3>
                        No goals found
                    </h3>

                    <p>
                        Try adjusting your filters or
                        create your first goal above.
                    </p>

                </div>
            )}

            {completedGoal && (
                <div className="success-banner">

                    <span>
                        🎉 Congratulations! You completed{" "}
                        <strong>"{completedGoal}"</strong>.
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            setCompletedGoal(null)
                        }
                    >
                        Dismiss
                    </button>

                </div>
            )}

            <ConfirmModal
                isOpen={showDeleteModal}
                title="Delete Goal"
                message="Are you sure you want to delete this goal?"
                onConfirm={confirmDeleteGoal}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setSelectedGoalId(null);
                }}
            />

        </>
    );
}

export default GoalSections;