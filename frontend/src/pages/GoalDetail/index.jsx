import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getGoal, getGoals, deleteGoal } from "../../services/goalService";

import { getSkills } from "../../services/skillService";
import { getApplications } from "../../services/applicationService";

import LoadingState from "../../components/LoadingState";
import ConfirmModal from "../../components/ConfirmModal";

import GoalOverview from "./components/GoalOverview";
import GoalSupporting from "./components/GoalSupporting";
import GoalActions from "./components/GoalActions";

import "./index.css";

function GoalDetail() {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: goal,
    isLoading: goalLoading,
    error: goalError,
  } = useQuery({
    queryKey: ["goals", goalId],
    queryFn: () => getGoal(goalId),
    enabled: Boolean(goalId),
  });

  const {
    data: allGoals = [],
    isLoading: goalsLoading,
    error: goalsError,
  } = useQuery({
    queryKey: ["goals", "all"],
    queryFn: getGoals,
  });

  const {
    data: allSkills = [],
    isLoading: skillsLoading,
    error: skillsError,
  } = useQuery({
    queryKey: ["skills", "all"],
    queryFn: getSkills,
  });

  const {
    data: relatedApplications = [],
    isLoading: applicationsLoading,
    error: applicationsError,
  } = useQuery({
    queryKey: ["applications", { primaryGoal: goalId }],
    queryFn: () => getApplications({ primaryGoal: goalId }),
    enabled: Boolean(goalId),
  });

  const deleteGoalMutation = useMutation({
    mutationFn: () => deleteGoal(goal._id),

    onSuccess: async () => {
      queryClient.removeQueries({
        queryKey: ["goals", goalId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["goals"],
      });

      navigate("/goals");
    },

    onError: (error) => {
      console.error("Failed to delete goal:", error);
    },
  });

  const loading =
    goalLoading || goalsLoading || skillsLoading || applicationsLoading;

  const error = goalError || goalsError || skillsError || applicationsError;

  const primaryGoals = useMemo(() => {
    return allGoals.filter(
      (item) => item.goalType === "Primary" && item._id !== goalId,
    );
  }, [allGoals, goalId]);

  const supportingGoals = useMemo(() => {
    if (!goal || goal.goalType !== "Primary") {
      return [];
    }

    return allGoals.filter((item) => {
      if (item.goalType !== "Secondary") {
        return false;
      }

      const parentId =
        typeof item.parentGoal === "object"
          ? item.parentGoal?._id
          : item.parentGoal;

      return parentId === goal._id;
    });
  }, [allGoals, goal]);

  const parentGoal = useMemo(() => {
    if (!goal || goal.goalType !== "Secondary") {
      return null;
    }

    if (goal.parentGoal && typeof goal.parentGoal === "object") {
      return goal.parentGoal;
    }

    return allGoals.find((item) => item._id === goal.parentGoal) || null;
  }, [allGoals, goal]);

  const relatedSkills = useMemo(() => {
    if (!goal || goal.goalType !== "Secondary") {
      return [];
    }

    return allSkills.filter((skill) => {
      const secondaryGoalId =
        typeof skill.secondaryGoal === "object"
          ? skill.secondaryGoal?._id
          : skill.secondaryGoal;

      return secondaryGoalId === goal._id;
    });
  }, [allSkills, goal]);

  const progress = Math.max(0, Math.min(100, Number(goal?.progress) || 0));

  const formattedDeadline = useMemo(() => {
    if (!goal?.deadline) {
      return "No deadline";
    }

    return new Date(goal.deadline).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, [goal?.deadline]);

  const formattedCreatedAt = useMemo(() => {
    if (!goal?.createdAt) {
      return "";
    }

    return new Date(goal.createdAt).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, [goal?.createdAt]);

  const daysLeft = useMemo(() => {
    if (!goal?.deadline) {
      return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(goal.deadline);
    deadline.setHours(0, 0, 0, 0);

    return Math.ceil(
      (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
  }, [goal?.deadline]);

  const deadlineStatus =
    daysLeft === null
      ? ""
      : daysLeft < 0
        ? "overdue"
        : daysLeft <= 7
          ? "urgent"
          : "on-track";

  function handleGoalUpdated(updatedGoal) {
    if (!updatedGoal) {
      return;
    }

    queryClient.setQueryData(["goals", goalId], updatedGoal);

    queryClient.setQueryData(["goals", "all"], (currentGoals = []) =>
      currentGoals.map((item) =>
        item._id === updatedGoal._id ? updatedGoal : item,
      ),
    );
  }

  function handleDelete() {
    if (!goal || deleteGoalMutation.isPending) {
      return;
    }

    deleteGoalMutation.mutate();
  }

  function handleBackToGoals() {
    navigate("/goals");
  }

  if (!goalId) {
    return (
      <div className="container goal-detail-page">
        <button
          type="button"
          className="goal-detail-back-btn"
          onClick={handleBackToGoals}
        >
          Back to Goals
        </button>

        <div className="goal-detail-error">
          <h1>Unable to load goal</h1>

          <p>Invalid goal.</p>

          <button
            type="button"
            className="goal-action-secondary"
            onClick={handleBackToGoals}
          >
            Back to Goals
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container goal-detail-page">
        <LoadingState message="Loading goal..." />
      </div>
    );
  }

  if (error || !goal) {
    const errorMsg =
      error?.response?.data?.message ||
      "Unable to load this goal. Please try again.";

    return (
      <div className="container goal-detail-page">
        <button
          type="button"
          className="goal-detail-back-btn"
          onClick={handleBackToGoals}
        >
          Back to Goals
        </button>

        <div className="goal-detail-error">
          <h1>Unable to load goal</h1>

          <p>{errorMsg}</p>

          <button
            type="button"
            className="goal-action-secondary"
            onClick={() =>
              queryClient.invalidateQueries({
                queryKey: ["goals", goalId],
              })
            }
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container goal-detail-page">
      <div className="goal-detail-topbar">
        <button
          type="button"
          className="goal-detail-back-btn"
          onClick={handleBackToGoals}
        >
          <span className="back-chevron" aria-hidden="true">
            ‹
          </span>

          <span>Goals</span>
        </button>
      </div>

      <main className="goal-detail-content">
        <GoalOverview
          goal={goal}
          progress={progress}
          formattedDeadline={formattedDeadline}
          formattedCreatedAt={formattedCreatedAt}
          daysLeft={daysLeft}
          deadlineStatus={deadlineStatus}
          parentGoal={parentGoal}
        />

        <GoalSupporting
          supportingGoals={supportingGoals}
          relatedSkills={relatedSkills}
          relatedApplications={relatedApplications}
          goalType={goal.goalType}
        />

        <GoalActions
          goal={goal}
          primaryGoals={primaryGoals}
          onGoalUpdated={handleGoalUpdated}
          onDelete={handleDelete}
          deleting={deleteGoalMutation.isPending}
        />
      </main>

      <ConfirmModal
        isOpen={deleteGoalMutation.isPending}
        title="Delete Goal?"
        message={`Are you sure you want to delete "${goal.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => {}}
      />
    </div>
  );
}

export default GoalDetail;