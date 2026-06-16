import { useState } from "react";
import "./index.css"

function Card({
    id,
    title,
    progress,
    onProgress,
    onDelete,
    onEdit
}){
    const [isEditing, setIsEditing] = useState(false);

    const [editedTitle, setEditedTitle] = useState(title);
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
                <h2>{title}</h2>
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