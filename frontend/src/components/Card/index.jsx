import { useState } from "react";
import "./index.css"

function Card({
    id,
    title,
    progress,
    category,
    onProgress,
    priority,
    onDelete,
    onEdit,
    deadline
}){
    const [isEditing, setIsEditing] = useState(false);

    const [editedTitle, setEditedTitle] = useState(title);

    let daysLeft = null;

    if (deadline) {
        // Convert the deadline into a simple days-left message.
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
        <div className="card">
            {/* Title input while editing, otherwise show the title */}
            {isEditing ? (
                <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) =>
                        setEditedTitle(e.target.value)
                    }
                />
            ) : (
                <h2>{title}</h2>
                )
            }

            {/* Goal category */}
            {
                category && (
                    <p>
                        Category: {category}
                    </p>
                )
            }

            {/* Goal priority */}
            {
                priority && (
                    <p>
                        Priority: {priority}
                    </p>
                )
            }

            {/* Goal deadline and status */}
            {
                deadline && (
                    <>
                        <p>
                            Deadline: {deadline}
                        </p>

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

            {/* Progress text and bar */}
            <p>Progress: {progress}%</p>

            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <button
                onClick={() => onProgress(id)}
            >
                Update Progress
            </button>

            {/* Edit or save the card title */}
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
                    onClick={() =>
                        setIsEditing(true)
                    }
                >
                    Edit
                </button>
            )}

            {/* Delete this card */}
            <button
                onClick={() => onDelete(id)}
            >
                Delete
            </button>

        </div>
    );
}

export default Card;
