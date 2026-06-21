import { useState } from "react";
import "./index.css";

function SkillCard({
    id,
    title,
    progress,
    category,
    level,
    relatedGoalTitle,
    onProgress,
    onDelete,
    onEdit
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);

    return (
        <div className="skill-card">

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
                <div className="skill-card-header">
                    <h2>{title}</h2>
                </div>
            )}

            <div className="badges-row">

                {category && (
                    <span className="category-badge">
                        {category}
                    </span>
                )}

                {level && (
                    <span
                        className={`level-badge ${level.toLowerCase()}`}
                    >
                        {level}
                    </span>
                )}

            </div>

            {relatedGoalTitle && (
                <div className="related-goal-card">

                    <div className="related-goal-label">
                        Related Goal
                    </div>

                    <div className="related-goal-title">
                        {relatedGoalTitle}
                    </div>

                </div>
            )}

            <p>
                Progress: {progress}%
            </p>

            <div className="progress-bar">

                <div
                    className="progress-fill"
                    style={{
                        width: `${progress}%`
                    }}
                />

            </div>

            <div className="skill-card-actions">

                <button
                    onClick={() =>
                        onProgress(id)
                    }
                >
                    Update Progress
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

export default SkillCard;