import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} from "../../services/goalService";

import LoadingState from "../../components/LoadingState";

import GoalOverview from "./components/GoalOverview";
import GoalSupporting from "./components/GoalSupporting";
import GoalActions from "./components/GoalActions";

import "./index.css";

function GoalDetail() {
  const { goalId } = useParams();
  const navigate = useNavigate();

  const [goal, setGoal] = useState(null);
  const [allGoals, setAllGoals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadGoalDetail() {
      try {
        setLoading(true);
        setErrorMsg("");

        const [goalData, goalsData] = await Promise.all([
          getGoal(goalId),
          getGoals(),
        ]);

        setGoal(goalData);
        setAllGoals(goalsData);
      } catch (error) {
        console.error("Failed to load goal details:", error);

        setErrorMsg(
          error.response?.data?.message ||
            "Unable to load this goal. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }

    if (goalId) {
      loadGoalDetail();
    }
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
      const parentId = item.parentGoal?._id || item.parentGoal;

      return item.goalType === "Secondary" && parentId === goal._id;
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

  const progress = Number(goal?.progress) || 0;

  const formattedDeadline = useMemo(() => {
    if (!goal?.deadline) {
      return "No deadline";
    }

    return new Date(goal.deadline).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, [goal]);

  const formattedCreatedAt = useMemo(() => {
    if (!goal?.createdAt) {
      return "";
    }

    return new Date(goal.createdAt).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, [goal]);

  const daysLeft = useMemo(() => {
    if (!goal?.deadline) {
      return null;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const deadline = new Date(goal.deadline);

    deadline.setHours(0, 0, 0, 0);

    return Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  }, [goal]);

  const deadlineStatus =
    daysLeft === null
      ? ""
      : daysLeft < 0
        ? "overdue"
        : daysLeft <= 7
          ? "urgent"
          : "on-track";

  const handleProgressUpdated = async () => {
    if (!goal || goal.completed || progress >= 100) {
      return;
    }

    const newProgress = Math.min(progress + 10, 100);

    try {
      setErrorMsg("");

      const updatedGoal = await updateGoal(goal._id, {
        progress: newProgress,
        completed: newProgress >= 100,
      });

      setGoal(updatedGoal);
    } catch (error) {
      console.error("Failed to update goal progress:", error);

      setErrorMsg(
        error.response?.data?.message || "Failed to update goal progress.",
      );
    }
  };

  const handleGoalUpdated = (updatedGoal) => {
    setGoal(updatedGoal);

    setAllGoals((previous) =>
      previous.map((item) =>
        item._id === updatedGoal._id ? updatedGoal : item,
      ),
    );
  };

  const handleDelete = async () => {
    if (!goal || deleting) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${goal.title}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setErrorMsg("");

      await deleteGoal(goal._id);

      navigate("/goals");
    } catch (error) {
      console.error("Failed to delete goal:", error);

      setErrorMsg(error.response?.data?.message || "Failed to delete goal.");

      setDeleting(false);
    }
  };

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
          onClick={() => navigate("/goals")}
        >
          Back to Goals
        </button>

        <div className="goal-detail-error">
          <h1>Unable to load goal</h1>

          <p>{errorMsg}</p>

          <button
            type="button"
            className="goal-action-secondary"
            onClick={() => navigate("/goals")}
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
          className="goal-detail-back-btn"
          onClick={() => navigate("/goals")}
        >
          <span className="back-chevron">‹</span>
          <span>Goals</span>
        </button>
      </div>

      {errorMsg && <div className="goal-detail-error-message">{errorMsg}</div>}

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

        <GoalSupporting supportingGoals={supportingGoals} />

        <GoalActions
          goal={goal}
          primaryGoals={primaryGoals}
          onProgressUpdated={handleProgressUpdated}
          onGoalUpdated={handleGoalUpdated}
          onDelete={handleDelete}
          deleting={deleting}
        />
      </main>
    </div>
  );
}

export default GoalDetail;
