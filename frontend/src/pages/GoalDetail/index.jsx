import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getGoal, getGoals, deleteGoal } from "../../services/goalService";

import { getSkills } from "../../services/skillService";

import LoadingState from "../../components/LoadingState";
import ConfirmModal from "../../components/ConfirmModal";

import GoalOverview from "./components/GoalOverview";
import GoalSupporting from "./components/GoalSupporting";
import GoalActions from "./components/GoalActions";

import "./index.css";

function GoalDetail() {
  const { goalId } = useParams();
  const navigate = useNavigate();

  const [goal, setGoal] = useState(null);
  const [allGoals, setAllGoals] = useState([]);
  const [allSkills, setAllSkills] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    async function loadGoalDetail() {
      if (!goalId) {
        setLoading(false);
        setErrorMsg("Invalid goal.");
        return;
      }

      try {
        setLoading(true);
        setErrorMsg("");

        const [goalData, goalsData, skillsData] = await Promise.all([
          getGoal(goalId),
          getGoals(),
          getSkills(),
        ]);

        setGoal(goalData);
        setAllGoals(goalsData);
        setAllSkills(skillsData);
      } catch (error) {
        console.error("Failed to load goal details:", error);

        setGoal(null);
        setAllGoals([]);
        setAllSkills([]);

        setErrorMsg(
          error.response?.data?.message ||
            "Unable to load this goal. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadGoalDetail();
  }, [goalId]);

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
    setGoal(updatedGoal);

    setAllGoals((previousGoals) =>
      previousGoals.map((item) =>
        item._id === updatedGoal._id ? updatedGoal : item,
      ),
    );

    setErrorMsg("");
  }

  function handleDelete() {
    if (!goal || deleting) {
      return;
    }

    setShowDeleteModal(true);
  }

  function handleCancelDelete() {
    if (deleting) {
      return;
    }

    setShowDeleteModal(false);
  }

  async function handleConfirmDelete() {
    if (!goal || deleting) {
      return;
    }

    try {
      setDeleting(true);
      setErrorMsg("");

      await deleteGoal(goal._id);

      setShowDeleteModal(false);

      navigate("/goals");
    } catch (error) {
      console.error("Failed to delete goal:", error);

      setErrorMsg(error.response?.data?.message || "Failed to delete goal.");

      setDeleting(false);
      setShowDeleteModal(false);
    }
  }

  function handleBackToGoals() {
    navigate("/goals");
  }

  if (loading) {
    return (
      <div className="container goal-detail-page">
        <LoadingState message="Loading goal..." />
      </div>
    );
  }

  if (errorMsg && !goal) {
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
            onClick={handleBackToGoals}
          >
            Back to Goals
          </button>
        </div>
      </div>
    );
  }

  if (!goal) {
    return null;
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

      {errorMsg && (
        <div className="goal-detail-error-message" role="alert">
          {errorMsg}
        </div>
      )}

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
          goalType={goal.goalType}
        />

        <GoalActions
          goal={goal}
          primaryGoals={primaryGoals}
          onGoalUpdated={handleGoalUpdated}
          onDelete={handleDelete}
          deleting={deleting}
        />
      </main>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Goal?"
        message={`Are you sure you want to delete "${goal.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default GoalDetail;
