import GoalCard from "../../../components/GoalCard";
import ConfirmModal from "../../../components/ConfirmModal";

function GoalSections({
    filteredGoals,
    filteredPrimaryGoals,
    filteredSecondaryGoals,
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

    return (
        <>
            {filteredGoals.length > 0 ? (
                <>
                    {filteredPrimaryGoals.length > 0 && (
                        <>
                            <h2 className="goal-section-title">
                                Primary Goals
                            </h2>

                            <div className="goals-grid">
                                {filteredPrimaryGoals.map(goal => (
                                    <GoalCard
                                        key={goal._id}
                                        id={goal._id}
                                        title={goal.title}
                                        progress={goal.progress}
                                        category={goal.category}
                                        onProgress={null}
                                        priority={goal.priority}
                                        goalType={goal.goalType}
                                        childGoals={getChildGoals(goal._id)}
                                        onDelete={(goalId) => {
                                            setSelectedGoalId(goalId);
                                            setShowDeleteModal(true);
                                        }}
                                        onEdit={editGoal}
                                        deadline={goal.deadline}
                                        completed={goal.completed}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {filteredSecondaryGoals.length > 0 && (
                        <>
                            <h2 className="goal-section-title">
                                Secondary Goals
                            </h2>

                            <div className="goals-grid">
                                {filteredSecondaryGoals.map(goal => (
                                    <GoalCard
                                        key={goal._id}
                                        id={goal._id}
                                        title={goal.title}
                                        progress={goal.progress}
                                        category={goal.category}
                                        onProgress={handleProgress}
                                        priority={goal.priority}
                                        goalType={goal.goalType}
                                        onDelete={(goalId) => {
                                            setSelectedGoalId(goalId);
                                            setShowDeleteModal(true);
                                        }}
                                        parentGoalTitle={
                                            getParentGoalTitle(
                                                goal.parentGoal?._id
                                            )
                                        }
                                        onEdit={editGoal}
                                        deadline={goal.deadline}
                                        completed={goal.completed}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </>
            ) : (
                <div className="empty-state">
                    <h3>No Goals found</h3>

                    <p>
                        Add a Goal or adjust
                        your filters.
                    </p>
                </div>
            )}

            {completedGoal && (
                <div className="success-banner">
                    🎉 Congratulations! You completed "{completedGoal}".
                    <button
                        onClick={() => setCompletedGoal(null)}
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