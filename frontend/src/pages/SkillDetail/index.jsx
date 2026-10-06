import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const [errorMsg, setErrorMsg] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const skillQuery = useQuery({
    queryKey: ["skills", skillId],
    queryFn: () => getSkill(skillId),
    enabled: Boolean(skillId),
  });

  const resourcesQuery = useQuery({
    queryKey: ["resources", { skill: skillId }],
    queryFn: () =>
      getResources({
        skill: skillId,
      }),
    enabled: Boolean(skillId),
  });

  const goalsQuery = useQuery({
    queryKey: ["goals", "secondary"],
    queryFn: () =>
      getGoals({
        goalType: "Secondary",
      }),
  });

  const updateSkillMutation = useMutation({
    mutationFn: ({ id, data }) => updateSkill(id, data),

    onSuccess: (updatedSkill) => {
      if (!updatedSkill?._id) {
        return;
      }

      queryClient.setQueryData(["skills", updatedSkill._id], updatedSkill);

      queryClient.invalidateQueries({
        queryKey: ["skills"],
      });
    },

    onError: (error) => {
      console.error("Failed to update skill:", error);
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: (id) => deleteSkill(id),

    onSuccess: (_, deletedSkillId) => {
      queryClient.removeQueries({
        queryKey: ["skills", deletedSkillId],
      });

      queryClient.invalidateQueries({
        queryKey: ["skills"],
      });

      queryClient.invalidateQueries({
        queryKey: ["resources"],
      });

      navigate("/skills");
    },

    onError: (error) => {
      console.error("Failed to delete skill:", error);
    },
  });

  const skill = skillQuery.data;
  const resources = useMemo(
    () => resourcesQuery.data || [],
    [resourcesQuery.data],
  );
  const goals = useMemo(() => goalsQuery.data || [], [goalsQuery.data]);

  const loading =
    skillQuery.isLoading || resourcesQuery.isLoading || goalsQuery.isLoading;

  const queryError =
    skillQuery.error || resourcesQuery.error || goalsQuery.error;

  const updatingRequirement = updateSkillMutation.isPending;
  const deleting = deleteSkillMutation.isPending;

  const handleSkillUpdated = (updatedSkill) => {
    if (!updatedSkill?._id) {
      return;
    }

    queryClient.setQueryData(["skills", updatedSkill._id], updatedSkill);

    queryClient.invalidateQueries({
      queryKey: ["skills"],
    });

    setErrorMsg("");
  };

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
      setErrorMsg("");

      const updatedSkill = await updateSkillMutation.mutateAsync({
        id: skill._id,
        data: {
          learningAreas,
          practicalRequirements,
        },
      });

      handleSkillUpdated(updatedSkill);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Unable to update the requirement.",
      );
    }
  };

  const handleAddLearningArea = async (name) => {
    if (!skill || updatingRequirement) {
      return;
    }

    const learningAreas = [...(skill.learningAreas || [])];

    learningAreas.push({
      name,
      completed: false,
    });

    try {
      setErrorMsg("");

      const updatedSkill = await updateSkillMutation.mutateAsync({
        id: skill._id,
        data: {
          learningAreas,
          practicalRequirements: skill.practicalRequirements || [],
        },
      });

      handleSkillUpdated(updatedSkill);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Unable to add the learning area.",
      );

      throw error;
    }
  };

  const handleAddPracticalRequirement = async (title) => {
    if (!skill || updatingRequirement) {
      return;
    }

    const practicalRequirements = [...(skill.practicalRequirements || [])];

    practicalRequirements.push({
      title,
      completed: false,
    });

    try {
      setErrorMsg("");

      const updatedSkill = await updateSkillMutation.mutateAsync({
        id: skill._id,
        data: {
          learningAreas: skill.learningAreas || [],
          practicalRequirements,
        },
      });

      handleSkillUpdated(updatedSkill);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message ||
          "Unable to add the practical requirement.",
      );

      throw error;
    }
  };

  const handleResourcesUpdated = async () => {
    try {
      setErrorMsg("");

      await queryClient.invalidateQueries({
        queryKey: ["resources", { skill: skillId }],
      });
    } catch (error) {
      console.error("Failed to refresh resources:", error);

      setErrorMsg(
        error.response?.data?.message ||
          "Resources could not be refreshed. Please try again.",
      );
    }
  };

  const handleDelete = async () => {
    if (!skill || deleting) {
      return;
    }

    try {
      setErrorMsg("");

      await deleteSkillMutation.mutateAsync(skill._id);

      setShowDeleteModal(false);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Failed to delete skill.");

      setShowDeleteModal(false);
    }
  };

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

  if (!skillId) {
    return null;
  }

  if (loading) {
    return (
      <div className="container skill-detail-page">
        <LoadingState message="Loading skill..." />
      </div>
    );
  }

  if (queryError || !skill) {
    const message =
      queryError?.response?.data?.message ||
      "Unable to load this skill. Please try again.";

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

          <p>{message}</p>

          <button
            type="button"
            className="skill-action-secondary"
            onClick={() =>
              queryClient.invalidateQueries({
                queryKey: ["skills", skillId],
              })
            }
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const completedResources = resources.filter(
    (resource) => resource.completed,
  ).length;

  const resourceProgress = resources.length
    ? Math.round((completedResources / resources.length) * 100)
    : 0;

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

      {errorMsg && (
        <div className="skill-detail-error-message" role="alert">
          {errorMsg}
        </div>
      )}

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
          onAddLearningArea={handleAddLearningArea}
          onAddPracticalRequirement={handleAddPracticalRequirement}
        />

        <SkillActions
          skill={skill}
          resources={resources}
          goals={goals}
          onSkillUpdated={handleSkillUpdated}
          onAddResource={handleManageResources}
          onDelete={() => setShowDeleteModal(true)}
          deleting={deleting}
          onResourceAdded={handleResourcesUpdated}
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