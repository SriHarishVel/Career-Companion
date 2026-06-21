import { useState } from "react";
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
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);

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

    return (
        <div
            className={`card ${
                completed
                    ? "completed-card"
                    : ""
            }`}
        >
            {isEditing ? (
                <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) =>
                        setEditedTitle(
                            e.target.value
                        )
                    }
                />
            ) : (
                <div className="card-header">
                    <h2>{title}</h2>

                    {completed && (
                        <span className="completed-badge">
                            ✓ Completed
                        </span>
                    )}
                </div>
            )}

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

            {childGoals.length > 0 && (
                <div className="child-goals">
                    <div className="child-goals-label">
                        Supporting Goals
                    </div>

                    {childGoals.map(goal => (
                        <div
                            key={goal.id}
                            className="child-goal-item"
                        >
                            • {goal.title}
                        </div>
                    ))}
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

            {deadline && (
                <>
                    <p>
                        Deadline:
                        {" "}
                        {deadline}
                    </p>

                    <p>
                        {daysLeft > 0
                            ? `${daysLeft} days left`
                            : daysLeft === 0
                            ? "Due today"
                            : "Overdue"}
                    </p>
                </>
            )}

            {!completed && (
                <p>
                    Progress:
                    {" "}
                    {progress}%
                </p>
            )}

            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{
                        width:
                            `${progress}%`
                    }}
                />
            </div>

            <div className="card-actions">
                <button
                    onClick={() =>
                        onProgress(id)
                    }
                    disabled={completed}
                >
                    {completed
                        ? "Completed"
                        : "Update Progress"}
                </button>

                {isEditing ? (
                    <>
                        <button
                            onClick={() => {
                                onEdit(
                                    id,
                                    editedTitle
                                );

                                setIsEditing(
                                    false
                                );
                            }}
                        >
                            Save
                        </button>

                        <button
                            className="cancel-btn"
                            onClick={() => {
                                setEditedTitle(
                                    title
                                );

                                setIsEditing(
                                    false
                                );
                            }}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        className="edit-btn"
                        onClick={() =>
                            setIsEditing(
                                true
                            )
                        }
                    >
                        Edit
                    </button>
                )}

                <button
                    className="delete-btn"
                    onClick={() =>
                        onDelete(id)
                    }
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default GoalCard;