import "./index.css";

function GoalCard({
    id,
    title,
    progress,
    category,
    goalType,
    priority,
    deadline,
    completed,
    parentGoalTitle,
    childGoals = [],
    onProgress,
    onDelete,
    onEdit
}) {

    let daysLeft = null;

    if (deadline) {
        const today = new Date();
        const deadlineDate = new Date(deadline);

        const difference =
            deadlineDate - today;

        daysLeft = Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );
    }

    const deadlineStatus =
        daysLeft < 0
            ? "overdue"
            : daysLeft === 0
                ? "today"
                : "upcoming";

    return (
        <article
            className={`card ${
                completed
                    ? "completed-card"
                    : ""
            }`}
        >

            <div className="card-header">

                <div className="card-title-row">

                    <h2>{title}</h2>

                    {completed && (
                        <span className="completed-badge">
                            ✓ Completed
                        </span>
                    )}

                </div>

                <div className="badges-row">

                    {category && (
                        <span className="category-badge">
                            {category}
                        </span>
                    )}

                    {goalType && (
                        <span
                            className={`goal-type-badge ${goalType.toLowerCase()}`}
                        >
                            {goalType}
                        </span>
                    )}

                    {priority && (
                        <span
                            className={`priority-badge ${priority.toLowerCase()}`}
                        >
                            {priority}
                        </span>
                    )}

                </div>

            </div>


            {childGoals.length > 0 && (
                <div className="child-goals">

                    <div className="child-goals-label">
                        Supporting Goals
                    </div>

                    <div className="child-goals-list">

                        {childGoals.map(goal => (
                            <div
                                key={goal._id}
                                className="child-goal-item"
                            >
                                <span>•</span>
                                {goal.title}
                            </div>
                        ))}

                    </div>

                </div>
            )}


            {parentGoalTitle && (
                <div className="parent-goal-card">

                    <div className="parent-goal-label">
                        Primary Goal
                    </div>

                    <div className="parent-goal-title">
                        {parentGoalTitle}
                    </div>

                </div>
            )}


            <div className="goal-progress-section">

                <div className="progress-header">

                    <span>Progress</span>

                    <strong>
                        {progress}%
                    </strong>

                </div>

                <div className="progress-bar">

                    <div
                        className="progress-fill"
                        style={{
                            width: `${progress}%`
                        }}
                    />

                </div>

            </div>


            {deadline && (
                <div className="deadline-info">

                    <div>
                        <span className="deadline-label">
                            Deadline
                        </span>

                        <strong>
                            {new Date(
                                deadline
                            ).toLocaleDateString(
                                "en-GB",
                                {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                }
                            )}
                        </strong>
                    </div>

                    <span
                        className={`deadline-status ${deadlineStatus}`}
                    >
                        {daysLeft > 0
                            ? `${daysLeft} days left`
                            : daysLeft === 0
                                ? "Due today"
                                : "Overdue"}
                    </span>

                </div>
            )}


            <div className="card-actions">

                {onProgress && (
                    <button
                        type="button"
                        onClick={() => onProgress(id)}
                        disabled={completed}
                    >
                        Update Progress
                    </button>
                )}

                <button
                    type="button"
                    className="edit-btn"
                    onClick={() => onEdit(id)}
                >
                    Edit
                </button>

                <button
                    type="button"
                    className="delete-btn"
                    onClick={() => onDelete(id)}
                >
                    Delete
                </button>

            </div>

        </article>
    );
}

export default GoalCard;