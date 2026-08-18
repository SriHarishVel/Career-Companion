import { useEffect, useState } from "react";

import { getGoals } from "../../services/goalService";
import { getSkills } from "../../services/skillService";
import { getResources } from "../../services/resourceService";
import { getApplications } from "../../services/applicationService";

import LoadingState from "../../components/LoadingState";

import CareerJourney from "./components/CareerJourney";
import ProgressOverview from "./components/ProgressOverview";
import RecentActivity from "./components/RecentActivity";
import UpcomingDeadlines from "./components/UpcomingDeadlines";

import "./index.css";

function Dashboard() {
  // Dashboard data

  const [goals, setGoals] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resources, setResources] = useState([]);
  const [applications, setApplications] = useState([]);

  // Request state

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);

        const [goals, skills, resources, applications] = await Promise.all([
          getGoals(),
          getSkills(),
          getResources(),
          getApplications(),
        ]);

        setGoals(goals);
        setSkills(skills);
        setResources(resources);
        setApplications(applications);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  const averageGoalProgress =
    goals.length > 0
      ? Math.round(
          goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length,
        )
      : 0;

  const averageSkillProgress =
    skills.length > 0
      ? Math.round(
          skills.reduce((sum, skill) => sum + skill.progress, 0) /
            skills.length,
        )
      : 0;

  const recentItems = [
    ...goals.map((goal) => ({
      type: "Goal",
      title: goal.title,
      updatedAt: goal.updatedAt,
    })),

    ...skills.map((skill) => ({
      type: "Skill",
      title: skill.name,
      updatedAt: skill.updatedAt,
    })),

    ...resources.map((resource) => ({
      type: "Resource",
      title: resource.title,
      updatedAt: resource.updatedAt,
    })),

    ...applications.map((application) => ({
      type: "Application",
      title: application.company,
      updatedAt: application.updatedAt,
    })),
  ]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  const upcomingDeadlines = [...goals]
    .filter((goal) => goal.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="container">
        <h1>Dashboard</h1>

        <LoadingState message="Preparing your dashboard..." />
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Dashboard</h1>

      <CareerJourney
        goals={goals}
        skills={skills}
        resources={resources}
        applications={applications}
        averageGoalProgress={averageGoalProgress}
        averageSkillProgress={averageSkillProgress}
      />

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
