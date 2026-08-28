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
import SkillRequirements from "./components/SkillRequirements";
import SkillActions from "./components/SkillActions";

import ConfirmModal from "../../components/ConfirmModal";

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
  const [updatingRequirement, setUpdatingRequirement] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  /* REQUIREMENT UPDATE */

  const handleRequirementUpdate = async (type, index) => {
    if (!skill || updatingRequirement) {
      return;
    }

    const learningAreas = [...(skill.learningAreas || [])];

    const practicalRequirements = [...(skill.practicalRequirements || [])];

    if (type === "learning") {
      if (!learningAreas[index]) {
        return;
      }

      learningAreas[index] = {
        ...learningAreas[index],
        completed: !learningAreas[index].completed,
      };
    }

    if (type === "practical") {
      if (!practicalRequirements[index]) {
        return;
      }

      practicalRequirements[index] = {
        ...practicalRequirements[index],
        completed: !practicalRequirements[index].completed,
      };
    }

    try {
      setUpdatingRequirement(true);
      setErrorMsg("");

      const updatedSkill = await updateSkill(skill._id, {
        learningAreas,
        practicalRequirements,
      });

      setSkill(updatedSkill);
    } catch (error) {
      console.error("Failed to update requirement:", error);

      setErrorMsg(
        error.response?.data?.message || "Unable to update the requirement.",
      );
    } finally {
      setUpdatingRequirement(false);
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

  /* DELETE */

  const handleDelete = async () => {
    if (!skill || deleting) {
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
      setShowDeleteModal(false);
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

  /* REQUIREMENT PROGRESS */

  const learningAreas = skill.learningAreas || [];

  const practicalRequirements = skill.practicalRequirements || [];

  const completedLearningAreas = learningAreas.filter(
    (area) => area.completed,
  ).length;

  const completedPracticalRequirements = practicalRequirements.filter(
    (requirement) => requirement.completed,
  ).length;

  const learningProgress = learningAreas.length
    ? Math.round((completedLearningAreas / learningAreas.length) * 100)
    : 0;

  const practicalProgress = practicalRequirements.length
    ? Math.round(
        (completedPracticalRequirements / practicalRequirements.length) * 100,
      )
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

        <SkillRequirements
          learningAreas={learningAreas}
          practicalRequirements={practicalRequirements}
          completedLearningAreas={completedLearningAreas}
          completedPracticalRequirements={completedPracticalRequirements}
          learningProgress={learningProgress}
          practicalProgress={practicalProgress}
          updatingRequirement={updatingRequirement}
          onToggleLearningArea={(index) =>
            handleRequirementUpdate("learning", index)
          }
          onTogglePracticalRequirement={(index) =>
            handleRequirementUpdate("practical", index)
          }
        />

        <SkillActions
          skill={skill}
          resources={resources}
          goals={goals}
          onSkillUpdated={handleSkillUpdated}
          onDelete={() => setShowDeleteModal(true)}
          deleting={deleting}
          onResourceAdded={handleResourceAdded}
        />
      </main>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Skill"
        message={`Are you sure you want to delete "${skill.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}

export default SkillDetail;
