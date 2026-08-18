import "./index.css";

function LoadingState({ message = "Loading..." }) {
    return (
        <div className="loading-state">
            <div className="loading-brand">
                Career Companion
            </div>

            <div className="loading-bar">
                <div className="loading-bar-progress" />
            </div>

            <p>{message}</p>
        </div>
    );
}

export default LoadingState;