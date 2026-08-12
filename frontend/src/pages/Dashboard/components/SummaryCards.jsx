function SummaryCards({
    goals,
    skills,
    resources,
    applications
}) {
    <div className="dashboard-grid">
        <div className="summary-card">
            <h2>Goals</h2>
            <p>{goals.length}</p>
        </div>

        <div className="summary-card">
            <h2>Skills</h2>
            <p>{skills.length}</p>
        </div>

        <div className="summary-card">
            <h2>Resources</h2>
            <p>{resources.length}</p>
        </div>

        <div className="summary-card">
            <h2>Applications</h2>
            <p>{applications.length}</p>
        </div>
    </div>
}

export default SummaryCards;