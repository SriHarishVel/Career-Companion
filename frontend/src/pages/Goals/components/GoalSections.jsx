import GoalCard from "./GoalCard";

function GoalSections({
  goals,
  primaryGoals,
  secondaryGoals,
  getChildGoals,
  getParentGoalTitle,
}) {
  return (
    <>
      <div className="goal-summary">
        <span>
          {goals.length} {goals.length === 1 ? "goal" : "goals"}
        </span>

        <span>{primaryGoals.length} primary</span>

        <span>{secondaryGoals.length} secondary</span>
      </div>

      {goals.length > 0 ? (
        <>
          {primaryGoals.length > 0 && (
            <section className="goal-section">
              <h2 className="goal-section-title">Primary Goals</h2>

              <div className="goals-grid">
                {primaryGoals.map((goal) => (
                  <GoalCard
                    key={goal._id}
                    id={goal._id}
                    title={goal.title}
                    progress={goal.progress}
                    category={goal.category}
                    priority={goal.priority}
                    goalType={goal.goalType}
                    childGoals={getChildGoals(goal._id)}
                    deadline={goal.deadline}
                    completed={goal.completed}
                  />
                ))}
              </div>
            </section>
          )}

          {secondaryGoals.length > 0 && (
            <section className="goal-section">
              <h2 className="goal-section-title">Secondary Goals</h2>

              <div className="goals-grid">
                {secondaryGoals.map((goal) => (
                  <GoalCard
                    key={goal._id}
                    id={goal._id}
                    title={goal.title}
                    progress={goal.progress}
                    category={goal.category}
                    priority={goal.priority}
                    goalType={goal.goalType}
                    parentGoalTitle={getParentGoalTitle(goal.parentGoal?._id)}
                    deadline={goal.deadline}
                    completed={goal.completed}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <div className="empty-state">
          <h3>No goals found</h3>

          <p>Try adjusting your filters or create your first goal above.</p>
        </div>
      )}
    </>
  );
}

export default GoalSections;
