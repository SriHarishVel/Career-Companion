import { useState } from "react";
import "./index.css"

function Card({
    id,
    title,
    progress,
    category,
    level,
    goalType,
    onProgress,
    priority,
    onDelete,
    onEdit,
    deadline,
    completed,
    parentGoalTitle
}){
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);

    // Goals can pass a deadline; skills leave this empty.
    let daysLeft = null;

    if (deadline) {
        const today = new Date();

        const deadlineDate =
            new Date(deadline);

        const difference =
            deadlineDate - today;

        daysLeft = Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );
    }

    return (
        
        <div className={`card ${
                completed
                    ? "completed-card"
                    : "" }`}
        >
            {/* Switch between title editing and the normal card header. */}
            {isEditing ? (
                <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) =>
                        setEditedTitle(e.target.value)
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
                )
                
            }
            <div className="badges-row">
                {/* Optional labels let the same card support goals and skills. */}
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

                {level && (
                    <span className={`level-badge ${level.toLowerCase()}`}>
                        {level}
                    </span>
                )}

                {priority && (
                    <span className={`priority-badge ${priority.toLowerCase()}`}>
                        {priority}
                    </span>
                )}
            </div>

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
            {
                deadline && (
                    // Show deadline details only for goal cards.
                    <>
                        <p> Deadline: {deadline} </p>

                        <p>
                            {daysLeft > 0
                                ? `${daysLeft} days left`
                                : daysLeft === 0
                                ? "Due today"
                                : "Overdue"}
                        </p>
                    </>
                )
            }

            {
                completed && (
                    <p> Completed </p>
                )
            }

           {!completed &&<p>Progress: {progress}%</p>}

            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <div className="card-actions">
                {/* Progress is disabled once a goal has reached completion. */}
                <button
                    onClick={() => onProgress(id)}
                    disabled={completed}
                >
                    {completed
                        ? "Completed"
                        : "Update Progress"}
                </button>

                {/* Inline editing keeps card updates on the current page. */}
                {isEditing ? (
                    <>
                        <button
                            onClick={() => {
                                onEdit(id, editedTitle);
                                setIsEditing(false);
                            }}
                        >
                            Save
                        </button>

                        <button
                        className="cancel-btn"
                            onClick={() => {
                                setEditedTitle(title);
                                setIsEditing(false);
                            }}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                    className="edit-btn"
                        onClick={() =>
                            setIsEditing(true)
                        }
                    >
                        Edit
                    </button>
                )}
                <button
                className="delete-btn"
                    onClick={() => onDelete(id)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default Card;
