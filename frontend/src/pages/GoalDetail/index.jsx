import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getGoals, updateGoal, deleteGoal } from "../../services/goalService";

import LoadingState from "../../components/LoadingState";

import "./index.css";

function GoalDetail() {
  const { goalId } = useParams();
  const navigate = useNavigate();

  const [goal, setGoal] = useState(null);
  const [allGoals, setAllGoals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [showEditForm, setShowEditForm] = useState(false);

  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("Learning");
  const [editPriority, setEditPriority] = useState("Medium");
  const [editGoalType, setEditGoalType] = useState("Primary");
  const [editDeadline, setEditDeadline] = useState("");
  const [editParentGoal, setEditParentGoal] = useState("");

  /*
   * Load all goals.
   *
   * The existing Goals page already uses getGoals()
   * and works with the returned goal list, so GoalDetail
   * follows the same pattern.
   */
  useEffect(() => {
    async function loadGoals() {
      try {
        setLoading(true);
        setError("");

        const goals = await getGoals();

        setAllGoals(goals);

        const selectedGoal = goals.find((item) => item._id === goalId);

        if (!selectedGoal) {
          setGoal(null);
          setError("This goal could not be found.");
          return;
        }

        setGoal(selectedGoal);
      } catch (error) {
        console.error("Failed to load goal:", error);

        setError("Unable to load this goal. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadGoals();
  }, [goalId]);

  /*
   * Primary goals available for secondary-goal selection.
   *
   * The current goal is excluded so a goal cannot become
   * its own parent.
   */
  const primaryGoals = allGoals.filter(
    (item) => item.goalType === "Primary" && item._id !== goalId,
  );

  /*
   * Open edit modal.
   */
  function openEditForm() {
    if (!goal) {
      return;
    }

    setEditTitle(goal.title || "");

    setEditCategory(goal.category || "Learning");

    setEditPriority(goal.priority || "Medium");

    setEditGoalType(goal.goalType || "Primary");

    setEditDeadline(goal.deadline ? goal.deadline.slice(0, 10) : "");

    setEditParentGoal(goal.parentGoal?._id || goal.parentGoal || "");

    setError("");

    setShowEditForm(true);
  }

  /*
   * Close edit modal.
   */
  function closeEditForm() {
    setShowEditForm(false);
    setError("");
  }

  /*
   * Change goal type.
   *
   * When switching to Primary, parent is removed.
   *
   * When switching to Secondary, the user must
   * choose a primary goal.
   */
  function handleGoalTypeChange(event) {
    const value = event.target.value;

    setEditGoalType(value);
    setError("");

    if (value === "Primary") {
      setEditParentGoal("");
    }
  }

  /*
   * Update progress by the same 10% increment used
   * on the existing Goals page.
   */
  async function handleProgress() {
    if (!goal || goal.completed || updatingProgress) {
      return;
    }

    try {
      setUpdatingProgress(true);
      setError("");

      const currentProgress = Number(goal.progress) || 0;

      const newProgress = Math.min(currentProgress + 10, 100);

      await updateGoal(goalId, {
        progress: newProgress,
        completed: newProgress === 100,
      });

      /*
       * Reload all goals so relationships and
       * primary-goal progress stay synchronized.
       */
      const updatedGoals = await getGoals();

      setAllGoals(updatedGoals);

      const updatedGoal = updatedGoals.find((item) => item._id === goalId);

      setGoal(updatedGoal || null);
    } catch (error) {
      console.error("Failed to update progress:", error);

      setError("Unable to update progress. Please try again.");
    } finally {
      setUpdatingProgress(false);
    }
  }

  /*
   * Save edited goal.
   */
  async function handleSaveEdit(event) {
    event.preventDefault();

    const trimmedTitle = editTitle.trim();

    if (trimmedTitle.length < 3) {
      setError("Goal title must be at least 3 characters.");

      return;
    }

    if (editGoalType === "Secondary" && !editParentGoal) {
      setError("Please select a parent goal.");

      return;
    }

    if (editGoalType === "Secondary" && primaryGoals.length === 0) {
      setError("Create a primary goal before using a secondary goal.");

      return;
    }

    /*
     * Prevent duplicate goals using the same
     * rules as the Goals page.
     */
    const normalizedTitle = trimmedTitle.toLowerCase();

    const duplicateGoal = allGoals.some((item) => {
      if (item._id === goalId) {
        return false;
      }

      if (item.goalType !== editGoalType) {
        return false;
      }

      if (editGoalType === "Primary") {
        return item.title.toLowerCase() === normalizedTitle;
      }

      return (
        item.title.toLowerCase() === normalizedTitle &&
        item.parentGoal?._id === editParentGoal
      );
    });

    if (duplicateGoal) {
      setError(`${editGoalType} goal already exists.`);

      return;
    }

    try {
      setError("");

      await updateGoal(goalId, {
        title: trimmedTitle,

        category: editCategory,

        priority: editPriority,

        deadline: editDeadline,

        goalType: editGoalType,

        parentGoal: editGoalType === "Secondary" ? editParentGoal : null,
      });

      /*
       * Reload so the detail page has the
       * latest populated parent relationship.
       */
      const updatedGoals = await getGoals();

      setAllGoals(updatedGoals);

      const updatedGoal = updatedGoals.find((item) => item._id === goalId);

      setGoal(updatedGoal || null);

      setShowEditForm(false);
    } catch (error) {
      console.error("Failed to update goal:", error);

      setError("Unable to update this goal. Please try again.");
    }
  }

  /*
   * Delete goal.
   *
   * Primary goals may have secondary goals,
   * so warn before deleting.
   */
  async function handleDelete() {
    if (!goal || deleting) {
      return;
    }

    const childGoals = allGoals.filter(
      (item) => item.parentGoal?._id === goalId,
    );

    if (goal.goalType === "Primary" && childGoals.length > 0) {
      const confirmed = window.confirm(
        `This will also delete ${childGoals.length} secondary goal(s). Continue?`,
      );

      if (!confirmed) {
        return;
      }
    } else {
      const confirmed = window.confirm(
        `Are you sure you want to delete "${goal.title}"?`,
      );

      if (!confirmed) {
        return;
      }
    }

    try {
      setDeleting(true);
      setError("");

      await deleteGoal(goalId);

      navigate("/goals");
    } catch (error) {
      console.error("Failed to delete goal:", error);

      setError("Unable to delete this goal. Please try again.");

      setDeleting(false);
    }
  }

  /*
   * Loading
   */
  if (loading) {
    return (
      <div className="container goal-detail-container">
        <LoadingState message="Loading goal..." />
      </div>
    );
  }

  /*
   * Not found
   */
  if (!goal) {
    return (
      <div className="container goal-detail-container">
        <div className="goal-detail-error">
          <span>GOAL</span>

          <h1>Goal not found</h1>

          <p>{error || "This goal could not be found."}</p>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/goals")}
          >
            ← Back to goals
          </button>
        </div>
      </div>
    );
  }

  const progress = Number(goal.progress) || 0;

  /*
   * Deadline calculations
   */
  let daysLeft = null;

  if (goal.deadline) {
    const today = new Date();

    const deadlineDate = new Date(goal.deadline);

    daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
  }

  const deadlineStatus =
    daysLeft === null
      ? ""
      : daysLeft < 0
        ? "overdue"
        : daysLeft === 0
          ? "today"
          : "upcoming";

  const formattedDeadline = goal.deadline
    ? new Date(goal.deadline).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No deadline set";

  const formattedCreatedAt = goal.createdAt
    ? new Date(goal.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  /*
   * Parent goal.
   *
   * Support both populated objects and raw IDs.
   */
  const parentGoal =
    goal.parentGoal && typeof goal.parentGoal === "object"
      ? goal.parentGoal
      : allGoals.find((item) => item._id === goal.parentGoal);

  /*
   * Supporting goals are derived from the
   * complete goal list.
   */
  const supportingGoals = allGoals.filter((item) => {
    if (!item.parentGoal) {
      return false;
    }

    const parentId =
      typeof item.parentGoal === "object"
        ? item.parentGoal._id
        : item.parentGoal;

    return parentId === goalId;
  });

  return (
    <div className="container goal-detail-container">
      {/* Top Navigation */}

      <div className="goal-detail-topbar">
        <button
          type="button"
          className="goal-back-link"
          onClick={() => navigate("/goals")}
        >
          <span>←</span>
          Back to goals
        </button>

        <span className="goal-detail-id">{goal.goalType || "GOAL"}</span>
      </div>

      {/* Hero */}

      <header className="goal-detail-hero">
        <div className="goal-detail-hero-main">
          <div className="goal-detail-meta">
            <span className="goal-detail-eyebrow">
              {goal.goalType || "Career goal"}
            </span>

            {goal.category && (
              <span className="goal-detail-category">{goal.category}</span>
            )}
          </div>

          <h1>{goal.title}</h1>

          {goal.description && (
            <p className="goal-detail-description">{goal.description}</p>
          )}

          <div className="goal-detail-badges">
            {goal.priority && (
              <span
                className={`goal-detail-priority ${goal.priority.toLowerCase()}`}
              >
                {goal.priority} priority
              </span>
            )}

            {goal.completed && (
              <span className="goal-detail-completed">✓ Completed</span>
            )}
          </div>
        </div>

        {/* Progress Ring */}

        <div
          className="goal-detail-progress-ring"
          style={{
            "--goal-progress": `${progress}%`,
          }}
        >
          <div className="goal-detail-progress-number">
            <strong>{progress}%</strong>

            <span>complete</span>
          </div>
        </div>
      </header>

      {/* Error */}

      {error && <div className="goal-detail-error-message">{error}</div>}

      {/* Main Content */}

      <main className="goal-detail-content">
        {/* Goal Information */}

        <section className="goal-detail-info-grid">
          <div className="goal-detail-section">
            <span className="goal-section-eyebrow">Deadline</span>

            <h2>{formattedDeadline}</h2>

            {daysLeft !== null && (
              <span className={`goal-deadline-status ${deadlineStatus}`}>
                {daysLeft > 0
                  ? `${daysLeft} days remaining`
                  : daysLeft === 0
                    ? "Due today"
                    : `${Math.abs(daysLeft)} days overdue`}
              </span>
            )}
          </div>

          <div className="goal-detail-section">
            <span className="goal-section-eyebrow">Goal type</span>

            <h2>{goal.goalType || "Career goal"}</h2>

            <p>
              {goal.goalType === "Secondary"
                ? "Supporting career objective"
                : "Primary career objective"}
            </p>
          </div>

          {formattedCreatedAt && (
            <div className="goal-detail-section">
              <span className="goal-section-eyebrow">Created</span>

              <h2>{formattedCreatedAt}</h2>

              <p>Part of your career journey.</p>
            </div>
          )}
        </section>

        {/* Parent Goal */}

        {parentGoal && (
          <section className="goal-detail-section goal-parent-section">
            <div>
              <span className="goal-section-eyebrow">Primary goal</span>

              <h2>{parentGoal.title}</h2>
            </div>

            <button
              type="button"
              className="goal-parent-arrow"
              onClick={() => navigate(`/goals/${parentGoal._id}`)}
              aria-label="Open primary goal"
            >
              →
            </button>
          </section>
        )}

        {/* Supporting Goals */}

        {supportingGoals.length > 0 && (
          <section className="goal-detail-section supporting-goals-section">
            <div className="goal-section-heading">
              <div>
                <span className="goal-section-eyebrow">Supporting goals</span>

                <h2>Goals that support this journey</h2>
              </div>

              <span className="goal-count">{supportingGoals.length}</span>
            </div>

            <div className="goal-supporting-list">
              {supportingGoals.map((supportingGoal) => {
                const supportingProgress = Number(supportingGoal.progress) || 0;

                return (
                  <button
                    key={supportingGoal._id}
                    type="button"
                    className="goal-supporting-item"
                    onClick={() => navigate(`/goals/${supportingGoal._id}`)}
                  >
                    <div className="goal-supporting-main">
                      <div className="goal-supporting-title-row">
                        <strong>{supportingGoal.title}</strong>

                        {supportingGoal.completed && (
                          <span className="goal-supporting-completed">✓</span>
                        )}
                      </div>

                      <div className="goal-supporting-progress">
                        <div className="goal-supporting-progress-track">
                          <div
                            className="goal-supporting-progress-fill"
                            style={{
                              width: `${supportingProgress}%`,
                            }}
                          />
                        </div>

                        <span>{supportingProgress}%</span>
                      </div>
                    </div>

                    <span className="goal-supporting-arrow" aria-hidden="true">
                      →
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Manage Goal */}

        <div className="goal-detail-actions">
          <button
            type="button"
            className="goal-action-primary"
            onClick={handleProgress}
            disabled={updatingProgress || goal.completed}
          >
            {updatingProgress
              ? "Updating..."
              : goal.completed
                ? "Completed"
                : "Update Progress"}
          </button>

          <button
            type="button"
            className="goal-action-secondary"
            onClick={openEditForm}
          >
            Edit Goal
          </button>

          <button
            type="button"
            className="goal-action-danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete Goal"}
          </button>
        </div>
      </main>

      {/* Edit Goal Modal */}

      {showEditForm && (
        <div
          className="goal-edit-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeEditForm();
            }
          }}
        >
          <div
            className="goal-edit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="goal-edit-title"
          >
            {/* Modal Header */}

            <div className="goal-edit-modal-header">
              <div>
                <span className="goal-section-eyebrow">Edit goal</span>

                <h2 id="goal-edit-title">Update your goal</h2>

                <p>Change the details of this goal.</p>
              </div>

              <button
                type="button"
                className="goal-edit-close"
                onClick={closeEditForm}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Modal Form */}

            <form className="goal-edit-form" onSubmit={handleSaveEdit}>
              {/* Title */}

              <div className="goal-edit-field goal-edit-field-full">
                <label htmlFor="edit-goal-title">Goal title</label>

                <input
                  id="edit-goal-title"
                  type="text"
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                  autoFocus
                />
              </div>

              {/* Two-column fields */}

              <div className="goal-edit-grid">
                {/* Category */}

                <div className="goal-edit-field">
                  <label htmlFor="edit-category">Category</label>

                  <select
                    id="edit-category"
                    value={editCategory}
                    onChange={(event) => setEditCategory(event.target.value)}
                  >
                    <option value="Learning">Learning</option>

                    <option value="Career">Career</option>

                    <option value="Skills">Skills</option>

                    <option value="Experience">Experience</option>

                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Priority */}

                <div className="goal-edit-field">
                  <label htmlFor="edit-priority">Priority</label>

                  <select
                    id="edit-priority"
                    value={editPriority}
                    onChange={(event) => setEditPriority(event.target.value)}
                  >
                    <option value="Low">Low</option>

                    <option value="Medium">Medium</option>

                    <option value="High">High</option>
                  </select>
                </div>

                {/* Goal Type */}

                <div className="goal-edit-field">
                  <label htmlFor="edit-goal-type">Goal type</label>

                  <select
                    id="edit-goal-type"
                    value={editGoalType}
                    onChange={handleGoalTypeChange}
                  >
                    <option value="Primary">Primary</option>

                    <option value="Secondary">Secondary</option>
                  </select>
                </div>

                {/* Deadline */}

                <div className="goal-edit-field">
                  <label htmlFor="edit-deadline">Deadline</label>

                  <input
                    id="edit-deadline"
                    type="date"
                    value={editDeadline}
                    onChange={(event) => setEditDeadline(event.target.value)}
                  />
                </div>
              </div>

              {/* Parent Goal */}

              {editGoalType === "Secondary" && (
                <div className="goal-edit-field">
                  <label htmlFor="edit-parent-goal">Parent goal</label>

                  <select
                    id="edit-parent-goal"
                    value={editParentGoal}
                    onChange={(event) => setEditParentGoal(event.target.value)}
                    required
                  >
                    <option value="">Select a primary goal</option>

                    {primaryGoals.map((primaryGoal) => (
                      <option key={primaryGoal._id} value={primaryGoal._id}>
                        {primaryGoal.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Modal Footer */}

              <div className="goal-edit-modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeEditForm}
                >
                  Cancel
                </button>

                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GoalDetail;
