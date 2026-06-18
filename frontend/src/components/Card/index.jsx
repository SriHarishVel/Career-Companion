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
    deadline,
    completed
}){
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);

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
        
        <div className="card">
            {isEditing ? (
                <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) =>
                        setEditedTitle(e.target.value)
                    }
                />
            ) : (
                <>
                    <h2>{title}</h2>
                </>
                )
                
            }
            {
                category && (
                    <p>
                        Category: {category}
                    </p>
                )
            }

            {
                priority && (
                    <p>Priority: {priority}</p>
                )
            }

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

            {
                completed && (
                    <p>
                        Completed
                    </p>
                )
            }

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
            <button
                onClick={() => onDelete(id)}
            >
                Delete
            </button>

        </div>
    );
}

export default Card;