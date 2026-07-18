import { storageService } from "../../services/storageService";
import "./index.css";

function Dashboard() {
    // Dashboard reads the saved page data and calculates quick summaries from it.
    const goals = storageService.getGoals();
    const skills = storageService.getSkills();
    const resources = storageService.getResources();
    const applications = storageService.getApplications();
    
    const applicationStatusCounts = {
        Applied: applications.filter(
            app => app.status === "Applied"
        ).length,

        Interview: applications.filter(
            app => app.status === "Interview"
        ).length,

        Offer: applications.filter(
            app => app.status === "Offer"
        ).length,

        Rejected: applications.filter(
            app => app.status === "Rejected"
        ).length
    };

    const averageGoalProgress =
        goals.length > 0
            ? Math.round(
                goals.reduce(
                    (sum, goal) => sum + goal.progress,
                    0
                ) / goals.length
            )
            : 0;

    const averageSkillProgress =
        skills.length > 0
            ? Math.round(
                skills.reduce(
                    (sum, skill) =>
                        sum + skill.progress,
                    0
                ) / skills.length
            )
            : 0;
    
    const recentItems = [
        ...goals.map(goal => ({
            type: "Goal",
            title: goal.title,
            lastUpdated: goal.lastUpdated
        })),

        ...skills.map(skill => ({
            type: "Skill",
            title: skill.title,
            lastUpdated: skill.lastUpdated
        })),

        ...resources.map(resource => ({
            type: "Resource",
            title: resource.title,
            lastUpdated: resource.lastUpdated
        })),

        ...applications.map(application => ({
            type: "Application",
            title: application.company,
            lastUpdated: application.lastUpdated
        }))
    ]
    .sort((a, b) => b.lastUpdated - a.lastUpdated)
    .slice(0, 5);

    return (
        <div className="container">
            <h1>Dashboard</h1>

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

            <div className="dashboard-section">
                <h2>Career Pipeline</h2>

                <div className="pipeline-grid">

                    <div className="pipeline-card">
                        <h3>Applied</h3>
                        <p>{applicationStatusCounts.Applied}</p>
                    </div>

                    <div className="pipeline-card">
                        <h3>Interview</h3>
                        <p>{applicationStatusCounts.Interview}</p>
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
            <div className="dashboard-section">
                <h2>Progress Overview</h2>

                <div className="progress-item">
                    <p>Average Goal Progress</p>

                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{
                                width: `${averageGoalProgress}%`
                            }}
                        ></div>
                    </div>

                    <span>{averageGoalProgress}%</span>
                </div>

                <div className="progress-item">
                    <p>Average Skill Progress</p>

                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{
                                width: `${averageSkillProgress}%`
                            }}
                        ></div>
                    </div>

                    <span>{averageSkillProgress}%</span>

                </div>
            </div>
            
            <div className="dashboard-section">
                <h2>Recent Activity</h2>

                <div className="activity-grid">
                    {recentItems.length > 0 ? (
                        recentItems.map((item, index) => (
                            <div
                                key={index}
                                className="activity-card"
                            >
                                <span className="activity-type">
                                    {item.type}
                                </span>

                                <h3>{item.title}</h3>
                            </div>
                        ))
                    ) : (
                        <p>No recent activity.</p>
                    )}
                </div>
            </div>

        </div>
    );
}

export default Dashboard;
