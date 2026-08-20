import { useState } from "react";

function CareerJourney({
  goals,
  skills,
  resources,
  applications,
  averageGoalProgress,
  averageSkillProgress,
}) {
  const [activeStage, setActiveStage] = useState("goals");

  const primaryGoals = goals.filter((goal) => goal.goalType === "Primary");

  const stages = [
    {
      id: "goals",
      title: "Goals",
      count: primaryGoals.length,
      description: "Your career objectives",
    },
    {
      id: "skills",
      title: "Skills",
      count: skills.length,
      description: "Skills you're developing",
    },
    {
      id: "resources",
      title: "Resources",
      count: resources.length,
      description: "Learning materials",
    },
    {
      id: "applications",
      title: "Applications",
      count: applications.length,
      description: "Career opportunities",
    },
  ];

  function getStageDetails() {
    switch (activeStage) {
      case "goals":
        return (
          <div className="journey-details">
            <div className="journey-detail-header">
              <div>
                <span>Goal Progress</span>
                <strong>{averageGoalProgress}%</strong>
              </div>
            </div>

            <div className="journey-progress-bar">
              <div
                className="journey-progress-fill"
                style={{
                  width: `${averageGoalProgress}%`,
                }}
              />
            </div>

            <div className="journey-items">
              {primaryGoals.slice(0, 3).map((goal) => (
                <div key={goal._id} className="journey-item">
                  <span>{goal.title}</span>

                  <strong>{goal.progress}%</strong>
                </div>
              ))}
            </div>
          </div>
        );

      case "skills":
        return (
          <div className="journey-details">
            <div className="journey-detail-header">
              <div>
                <span>Skill Progress</span>
                <strong>{averageSkillProgress}%</strong>
              </div>
            </div>

            <div className="journey-progress-bar">
              <div
                className="journey-progress-fill"
                style={{
                  width: `${averageSkillProgress}%`,
                }}
              />
            </div>

            <div className="journey-items">
              {skills.slice(0, 3).map((skill) => (
                <div key={skill._id} className="journey-item">
                  <span>{skill.name}</span>

                  <strong>{skill.progress}%</strong>
                </div>
              ))}
            </div>
          </div>
        );

      case "resources":
        return (
          <div className="journey-details">
            <div className="journey-items">
              {resources.slice(0, 4).map((resource) => (
                <div key={resource._id} className="journey-item">
                  <span>{resource.title}</span>

                  <strong>{resource.type}</strong>
                </div>
              ))}
            </div>
          </div>
        );

      case "applications":
        return (
          <div className="journey-details">
            <div className="journey-application-stats">
              <div>
                <span>Applied</span>
                <strong>
                  {
                    applications.filter((app) => app.status === "Applied")
                      .length
                  }
                </strong>
              </div>

              <div>
                <span>In Progress</span>
                <strong>
                  {
                    applications.filter((app) => app.status === "In Progress")
                      .length
                  }
                </strong>
              </div>

              <div>
                <span>Offers</span>
                <strong>
                  {applications.filter((app) => app.status === "Offer").length}
                </strong>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="dashboard-section career-journey">
      <div className="career-journey-header">
        <div>
          <h2>Career Journey</h2>

          <p>Explore your current career progress</p>
        </div>
      </div>

      <div className="journey-stages">
        {stages.map((stage, index) => (
          <div key={stage.id} className="journey-stage-wrapper">
            <button
              className={`journey-stage ${
                activeStage === stage.id ? "active" : ""
              }`}
              onClick={() => setActiveStage(stage.id)}
            >
              <span className="journey-stage-number">{index + 1}</span>

              <span className="journey-stage-content">
                <strong>{stage.title}</strong>

                <small>{stage.description}</small>
              </span>

              <span className="journey-stage-count">{stage.count}</span>
            </button>

            {index < stages.length - 1 && (
              <span className="journey-connector">→</span>
            )}
          </div>
        ))}
      </div>

      {getStageDetails()}
    </div>
  );
}

export default CareerJourney;
