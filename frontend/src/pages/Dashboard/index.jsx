import { useEffect, useState } from "react";

import { getGoals } from "../../services/goalService";
import { getSkills } from "../../services/skillService";
import { getResources } from "../../services/resourceService";
import { getApplications } from "../../services/applicationService";

import LoadingState from "../../components/LoadingState";

import CareerJourney from "./components/CareerJourney";
import RecentActivity from "./components/RecentActivity";
import UpcomingDeadlines from "./components/UpcomingDeadlines";

import "./index.css";

function Dashboard() {
  const [goals, setGoals] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resources, setResources] = useState([]);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        setErrorMsg("");

        const [goalData, skillData, resourceData, applicationData] =
          await Promise.all([
            getGoals(),
            getSkills(),
            getResources(),
            getApplications(),
          ]);

        setGoals(Array.isArray(goalData) ? goalData : []);
        setSkills(Array.isArray(skillData) ? skillData : []);
        setResources(Array.isArray(resourceData) ? resourceData : []);
        setApplications(Array.isArray(applicationData) ? applicationData : []);
      } catch (error) {
        console.error("Failed to load dashboard:", error);

        setErrorMsg(
          error.response?.data?.message ||
            "Unable to load your dashboard. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  const primaryGoals = goals.filter((goal) => goal.goalType === "Primary");

  const averageGoalProgress =
    primaryGoals.length > 0
      ? Math.round(
          primaryGoals.reduce(
            (sum, goal) => sum + (Number(goal.progress) || 0),
            0,
          ) / primaryGoals.length,
        )
      : 0;

  const averageSkillProgress =
    skills.length > 0
      ? Math.round(
          skills.reduce(
            (sum, skill) => sum + (Number(skill.progress) || 0),
            0,
          ) / skills.length,
        )
      : 0;

  const recentItems = [
    ...goals.map((goal) => ({
      id: `goal-${goal._id}`,
      type: "Goal",
      title: goal.title,
      updatedAt: goal.updatedAt,
    })),

    ...skills.map((skill) => ({
      id: `skill-${skill._id}`,
      type: "Skill",
      title: skill.name,
      updatedAt: skill.updatedAt,
    })),

    ...resources.map((resource) => ({
      id: `resource-${resource._id}`,
      type: "Resource",
      title: resource.title,
      updatedAt: resource.updatedAt,
    })),

    ...applications.map((application) => ({
      id: `application-${application._id}`,
      type: "Application",
      title: `${application.role} at ${application.company}`,
      updatedAt: application.updatedAt,
    })),
  ]
    .filter((item) => item.updatedAt)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  const upcomingDeadlines = [...goals]
    .filter((goal) => goal.deadline && !goal.completed)
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

  if (errorMsg) {
    return (
      <div className="container">
        <h1>Dashboard</h1>

        <div className="dashboard-section">
          <p>{errorMsg}</p>

          <button type="button" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
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

      <RecentActivity recentItems={recentItems} />

      <UpcomingDeadlines upcomingDeadlines={upcomingDeadlines} />
    </div>
  );
}

export default Dashboard;
