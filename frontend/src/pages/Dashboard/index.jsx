import { useEffect, useState } from "react";

import { getGoals } from "../../services/goalService";
import { getSkills } from "../../services/skillService";
import { getResources } from "../../services/resourceService";
import { getApplications } from "../../services/applicationService";
import SummaryCards from "./components/SummaryCards";
import CareerPipeline from "./components/CareerPipeline";
import ProgressOverview from "./components/ProgressOverview";
import RecentActivity from "./components/RecentActivity";
import UpcomingDeadlines from "./components/UpcomingDeadlines";
import "./index.css";

function Dashboard() {
    // Dashboard fetches data from the backend and prepares summary data for the UI.
    const [goals, setGoals] = useState([]);
    const [skills, setSkills] = useState([]);
    const [resources, setResources] = useState([]);
    const [applications, setApplications] = useState([]);
    
    useEffect(() => {

        async function fetchDashboard() {

            try {

                const [
                    goals,
                    skills,
                    resources,
                    applications
                ] = await Promise.all([
                    getGoals(),
                    getSkills(),
                    getResources(),
                    getApplications()
                ]);

                setGoals(goals);
                setSkills(skills);
                setResources(resources);
                setApplications(applications);

            } catch (error) {

                console.error(error);

            }

        }

        fetchDashboard();

    }, []);

    const applicationStatusCounts = {
        Applied: applications.filter(
            app => app.status === "Applied"
        ).length,

        "In Progress": applications.filter(
            app => app.status === "In Progress"
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
            updatedAt: goal.updatedAt
        })),

        ...skills.map(skill => ({
            type: "Skill",
            title: skill.name,
            updatedAt: skill.updatedAt
        })),

        ...resources.map(resource => ({
            type: "Resource",
            title: resource.title,
            updatedAt: resource.updatedAt
        })),

        ...applications.map(application => ({
            type: "Application",
            title: application.company,
            updatedAt: application.updatedAt
        }))
    ]
    .sort(
            (a, b) =>
                new Date(b.updatedAt) -
                new Date(a.updatedAt)
        )
    .slice(0, 5);

    const upcomingDeadlines = [...goals]
        .filter(goal => goal.deadline)
        .sort(
            (a, b) =>
                new Date(a.deadline) -
                new Date(b.deadline)
        )
        .slice(0, 5);
        
    return (
        <div className="container">
            <h1>Dashboard</h1>

            <SummaryCards
                goals={goals}
                skills={skills}
                resources={resources}
                applications={applications}
            />

            <CareerPipeline applicationStatusCounts={applicationStatusCounts} />
            
            <ProgressOverview
                averageGoalProgress={averageGoalProgress}
                averageSkillProgress={averageSkillProgress}
            />
            
            <RecentActivity recentItems={recentItems} />
            
            <UpcomingDeadlines upcomingDeadlines={upcomingDeadlines} />

        </div>
    );
}

export default Dashboard;
