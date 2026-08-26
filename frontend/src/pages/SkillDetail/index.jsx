import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getSkill,
  updateSkill,
  deleteSkill,
} from "../../services/skillService";

import { getResources } from "../../services/resourceService";
import { getGoals } from "../../services/goalService";

import LoadingState from "../../components/LoadingState";

import SkillOverview from "./components/SkillOverview";
import SkillResources from "./components/SkillResources";
import SkillActions from "./components/SkillActions";

import "./index.css";

function SkillDetail() {
  const { skillId } = useParams();
  const navigate = useNavigate();

  /* DATA */

  const [skill, setSkill] = useState(null);
  const [resources, setResources] = useState([]);
  const [goals, setGoals] = useState([]);

  /* PAGE STATE */

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [deleting, setDeleting] = useState(false);

  /* LOAD DETAIL */

  useEffect(() => {
    async function loadSkillDetail() {
      try {
        setLoading(true);
        setErrorMsg("");

        const [skillData, resourceData, goalData] = await Promise.all([
          getSkill(skillId),

          getResources({
            skill: skillId,
          }),

          getGoals({
            goalType: "Secondary",
          }),
        ]);

        setSkill(skillData);
        setResources(resourceData);
        setGoals(goalData);
      } catch (error) {
        console.error("Failed to load skill details:", error);

        setErrorMsg(
          error.response?.data?.message ||
            "Unable to load this skill. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }

    if (skillId) {
      loadSkillDetail();
    }
  }, [skillId]);

  /* REFRESH SKILL */

  const handleSkillUpdated = async (updatedSkill) => {
    try {
      setErrorMsg("");

      const freshSkill = await getSkill(updatedSkill._id);

      setSkill(freshSkill || updatedSkill);
    } catch (error) {
      console.error("Failed to refresh skill:", error);

      setSkill(updatedSkill);
    }
  };

  /* REFRESH RESOURCES */

  const handleResourceAdded = async () => {
    try {
      setErrorMsg("");

      const updatedResources = await getResources({
        skill: skillId,
      });

      setResources(updatedResources);
    } catch (error) {
      console.error("Failed to refresh resources:", error);

      setErrorMsg(
        error.response?.data?.message ||
          "Resource was added, but the resource list could not be refreshed.",
      );
    }
  };

  /* PROGRESS */

  const handleUpdateProgress = async () => {
    if (!skill) {
      return;
    }

    const currentProgress = Number(skill.progress) || 0;

    if (currentProgress >= 100) {
      return;
    }

    const newProgress = Math.min(currentProgress + 10, 100);

    try {
      setErrorMsg("");

      const updatedSkill = await updateSkill(skill._id, {
        progress: newProgress,
      });

      setSkill(updatedSkill);
    } catch (error) {
      console.error("Failed to update skill progress:", error);

      setErrorMsg(
        error.response?.data?.message || "Failed to update skill progress.",
      );
    }
  };

  /* DELETE */

  const handleDelete = async () => {
    if (!skill || deleting) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${skill.name}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setErrorMsg("");

      await deleteSkill(skill._id);

      navigate("/skills");
    } catch (error) {
      console.error("Failed to delete skill:", error);

      setErrorMsg(error.response?.data?.message || "Failed to delete skill.");

      setDeleting(false);
    }
  };

  /* MANAGE RESOURCES */

  const handleManageResources = () => {
    if (!skill) {
      return;
    }

    navigate("/resources", {
      state: {
        skillId: skill._id,
      },
    });
  };

  /* LOADING */

  if (loading) {
    return (
      <div className="container skill-detail-page">
        <LoadingState message="Loading skill..." />
      </div>
    );
  }

  /* ERROR */

  if (errorMsg && !skill) {
    return (
      <div className="container skill-detail-page">
        <div className="skill-detail-topbar">
          <button
            type="button"
            className="skill-detail-back-btn"
            onClick={() => navigate("/skills")}
          >
            <span className="back-chevron">‹</span>

            <span>Skills</span>
          </button>
        </div>

        <div className="skill-detail-error">
          <h1>Unable to load skill</h1>

          <p>{errorMsg}</p>

          <button
            type="button"
            className="skill-action-secondary"
            onClick={() => navigate("/skills")}
          >
            Back to Skills
          </button>
        </div>
      </div>
    );
  }

  if (!skill) {
    return null;
  }

  /* RESOURCE PROGRESS */

  const completedResources = resources.filter(
    (resource) => resource.completed,
  ).length;

  const resourceProgress = resources.length
    ? Math.round((completedResources / resources.length) * 100)
    : 0;

  /* PAGE */

  return (
    <div className="container skill-detail-page">
      {/* TOP NAVIGATION */}

      <div className="skill-detail-topbar">
        <button
          type="button"
          className="skill-detail-back-btn"
          onClick={() => navigate("/skills")}
        >
          <span className="back-chevron">‹</span>

          <span>Skills</span>
        </button>
      </div>

      {/* ERROR */}

      {errorMsg && (
        <div className="skill-detail-error-message" role="alert">
          {errorMsg}
        </div>
      )}

      {/* CONTENT */}

      <main className="skill-detail-content">
        <SkillOverview skill={skill} />

        <SkillResources
          skillName={skill.name}
          resources={resources}
          completedResources={completedResources}
          resourceProgress={resourceProgress}
          onManageResources={handleManageResources}
        />

        <SkillActions
          skill={skill}
          resources={resources}
          goals={goals}
          onSkillUpdated={handleSkillUpdated}
          onUpdateProgress={handleUpdateProgress}
          onDelete={handleDelete}
          deleting={deleting}
          onResourceAdded={handleResourceAdded}
        />
      </main>
    </div>
  );
}

export default SkillDetail;
