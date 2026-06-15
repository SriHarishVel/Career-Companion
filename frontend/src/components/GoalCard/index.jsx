import "./index.css"

function GoalCard(props) {
    return (
        <div className="card">
            <h2>{props.title}</h2>

            <p>Progress: {props.progress}%</p>

            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${props.progress}%` }}
                ></div>
            </div>

            <button
                onClick={() => props.onProgress(props.id)}
            >
                Update Progress
            </button>

            <button
                onClick={() => props.onDelete(props.id)}
            >
                Delete
            </button>
        </div>
    );
}

export default GoalCard;