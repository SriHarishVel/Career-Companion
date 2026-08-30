import { useState } from "react";
import { updateGoal } from "../../../services/goalService";

import FormDialog from "../../../components/FormDialog";

function GoalActions({
  goal,
  primaryGoals = [],
  onGoalUpdated,
  onDelete,
  deleting,
}) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [editForm, setEditForm] = useState({
    title: goal.title || "",
    category: goal.category || "",
    priority: goal.priority || "",
    goalType: goal.goalType || "Primary",
    parentGoal: goal.parentGoal?._id || goal.parentGoal || "",
    deadline: goal.deadline
      ? new Date(goal.deadline).toISOString().split("T")[0]
      : "",
  });

  const formId = `edit-goal-form-${goal._id}`;

  const handleOpenEdit = () => {
    setEditForm({
      title: goal.title || "",
      category: goal.category || "",
      priority: goal.priority || "",
      goalType: goal.goalType || "Primary",
      parentGoal: goal.parentGoal?._id || goal.parentGoal || "",
      deadline: goal.deadline
        ? new Date(goal.deadline).toISOString().split("T")[0]
        : "",
    });

    setError("");
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    if (saving) {
      return;
    }

    setError("");
    setShowEditModal(false);
  };

  const handleChange = (field, value) => {
    setEditForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  const handleGoalTypeChange = (event) => {
    const value = event.target.value;

    setEditForm((previous) => ({
      ...previous,
      goalType: value,
      parentGoal: value === "Primary" ? "" : previous.parentGoal,
    }));

    setError("");
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!editForm.title.trim()) {
      setError("Goal title is required.");
      return;
    }

    if (editForm.goalType === "Secondary" && !editForm.parentGoal) {
      setError("Secondary goals must have a primary goal.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const updatedGoal = await updateGoal(goal._id, {
        title: editForm.title.trim(),
        category: editForm.category,
        priority: editForm.priority,
        goalType: editForm.goalType,
        parentGoal:
          editForm.goalType === "Secondary" ? editForm.parentGoal : null,
        deadline: editForm.deadline || null,
      });

      if (onGoalUpdated) {
        await onGoalUpdated(updatedGoal);
      }

      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update goal:", error);

      setError(error.response?.data?.message || "Failed to update goal.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <section className="goal-detail-actions">
        <button
          type="button"
          className="goal-action-secondary"
          onClick={handleOpenEdit}
        >
          Edit Goal
        </button>

        <button
          type="button"
          className="goal-action-danger"
          onClick={onDelete}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete Goal"}
        </button>
      </section>

      <FormDialog
        isOpen={showEditModal}
        title={`Edit ${goal.title}`}
        onClose={handleCloseEdit}
        footer={
          <>
            <button
              type="button"
              className="goal-action-secondary"
              onClick={handleCloseEdit}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              form={formId}
              className="goal-action-primary"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </>
        }
      >
        <form id={formId} className="goal-edit-form" onSubmit={handleSave}>
          <div className="goal-edit-field">
            <label htmlFor="edit-goal-title">Goal Title</label>

            <input
              id="edit-goal-title"
              type="text"
              value={editForm.title}
              onChange={(event) => handleChange("title", event.target.value)}
              required
            />
          </div>

          <div className="goal-edit-grid">
            <div className="goal-edit-field">
              <label htmlFor="edit-goal-category">Category</label>

              <select
                id="edit-goal-category"
                value={editForm.category}
                onChange={(event) =>
                  handleChange("category", event.target.value)
                }
              >
                <option value="">Select category</option>
                <option value="Learning">Learning</option>
                <option value="Career">Career</option>
                <option value="Health">Health</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div className="goal-edit-field">
              <label htmlFor="edit-goal-priority">Priority</label>

              <select
                id="edit-goal-priority"
                value={editForm.priority}
                onChange={(event) =>
                  handleChange("priority", event.target.value)
                }
              >
                <option value="">Select priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="goal-edit-field">
              <label htmlFor="edit-goal-type">Goal Type</label>

              <select
                id="edit-goal-type"
                value={editForm.goalType}
                onChange={handleGoalTypeChange}
              >
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
              </select>
            </div>

            <div className="goal-edit-field">
              <label htmlFor="edit-goal-deadline">Deadline</label>

              <input
                id="edit-goal-deadline"
                type="date"
                value={editForm.deadline}
                onChange={(event) =>
                  handleChange("deadline", event.target.value)
                }
              />
            </div>
          </div>

          {editForm.goalType === "Secondary" && (
            <div className="goal-edit-field">
              <label htmlFor="edit-parent-goal">Parent Goal</label>

              <select
                id="edit-parent-goal"
                value={editForm.parentGoal}
                onChange={(event) =>
                  handleChange("parentGoal", event.target.value)
                }
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

          {error && (
            <div className="goal-edit-form-error" role="alert">
              {error}
            </div>
          )}
        </form>
      </FormDialog>
    </>
  );
}

export default GoalActions;
