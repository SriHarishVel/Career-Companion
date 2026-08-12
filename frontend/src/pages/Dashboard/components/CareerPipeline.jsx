function CareerPipeline({ applicationStatusCounts }) {
    return (
        <div className="dashboard-section">
            <h2>Career Pipeline</h2>

            <div className="pipeline-grid">
                <div className="pipeline-card">
                    <h3>Applied</h3>
                    <p>{applicationStatusCounts.Applied}</p>
                </div>

                <div className="pipeline-card">
                    <h3>In Progress</h3>
                    <p>{applicationStatusCounts["In Progress"]}</p>
                </div>

                <div className="pipeline-card">
                    <h3>Offer</h3>
                    <p>{applicationStatusCounts.Offer}</p>
                </div>

                <div className="pipeline-card">
                    <h3>Rejected</h3>
                    <p>{applicationStatusCounts.Rejected}</p>
                </div>
            </div>
        </div>
    );
}

export default CareerPipeline;