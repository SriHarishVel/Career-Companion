function QuickAccess({ onNavigate }) {
    return (
        <div className="home-card">
            <h2>Quick Access</h2>

            <div className="quick-links">
                <button onClick={() => onNavigate("/goals")}>
                    Goals
                </button>

                <button onClick={() => onNavigate("/skills")}>
                    Skills
                </button>

                <button onClick={() => onNavigate("/resources")}>
                    Resources
                </button>

                <button onClick={() => onNavigate("/applications")}>
                    Applications
                </button>
            </div>
        </div>
    );
}

export default QuickAccess;