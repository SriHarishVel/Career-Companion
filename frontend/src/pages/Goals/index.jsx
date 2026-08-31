import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import GoalFilters from "./components/GoalFilters";
import GoalForm from "./components/GoalForm";
import GoalSections from "./components/GoalSections";
import JourneyBanner from "./components/JourneyBanner";
import JourneyMessage from "./components/JourneyMessage";

import FormDialog from "../../components/FormDialog";
import LoadingState from "../../components/LoadingState";

import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../../services/goalService";

import "./index.css";

function Goals() {
  const location = useLocation();

  const journeyStep = location.state?.journeyStep || null;
  const isGuidedSetup = Boolean(journeyStep);

  const [goals, setGoals] = useState([]);

  const [searchGoal, setSearchGoal] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [goalTypeFilter, setGoalTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [newGoal, setNewGoal] = useState("");
  const [newCategory, setNewCategory] = useState("Learning");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newGoalType, setNewGoalType] = useState("Primary");
  const [parentGoalId, setParentGoalId] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  const [editingGoalId, setEditingGoalId] = useState(null);
  const [showGoalForm, setShowGoalForm] = useState(false);

  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchGoals() {
      try {
        setLoading(true);

        const data = await getGoals({
          search: searchGoal,
          category: categoryFilter === "All" ? undefined : categoryFilter,
          priority: priorityFilter === "All" ? undefined : priorityFilter,
          goalType: goalTypeFilter === "All" ? undefined : goalTypeFilter,
          status: statusFilter === "All" ? undefined : statusFilter,
          sort: sortOption === "default" ? undefined : sortOption,
        });

        setGoals(data);
      } catch (error) {
        console.error("Failed to load goals:", error);

        setErrorMsg("Unable to load your goals. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchGoals();
  }, [
    searchGoal,
    sortOption,
    categoryFilter,
    priorityFilter,
    goalTypeFilter,
    statusFilter,
  ]);

  const primaryGoals = goals.filter((goal) => goal.goalType === "Primary");

  const secondaryGoals = goals.filter((goal) => goal.goalType === "Secondary");

  const primaryGoalOptions = goals.filter(
    (goal) => goal.goalType === "Primary",
  );

  function getChildGoals(primaryGoalId) {
    return secondaryGoals.filter(
      (goal) => goal.parentGoal?._id === primaryGoalId,
    );
  }

  function getParentGoalTitle(parentId) {
    const parent = primaryGoals.find((goal) => goal._id === parentId);

    return parent ? parent.title : "";
  }

  function resetGoalForm() {
    setNewGoal("");
    setNewCategory("Learning");
    setNewPriority("Medium");
    setNewGoalType("Primary");
    setParentGoalId("");
    setNewDeadline("");
    setErrorMsg("");
    setEditingGoalId(null);
  }

  function openAddGoal() {
    resetGoalForm();

    if (journeyStep?.action === "createPrimaryGoal") {
      setNewGoalType("Primary");
    }

    if (journeyStep?.action === "createSecondaryGoal") {
      setNewGoalType("Secondary");

      if (primaryGoalOptions.length === 1) {
        setParentGoalId(primaryGoalOptions[0]._id);
      }
    }

    setShowGoalForm(true);
  }

  function closeGoalForm() {
    resetGoalForm();
    setShowGoalForm(false);
  }

  function editGoal(goal) {
    setEditingGoalId(goal._id);

    setNewGoal(goal.title);
    setNewCategory(goal.category);
    setNewPriority(goal.priority);
    setNewGoalType(goal.goalType);
    setParentGoalId(goal.parentGoal?._id || "");

    setNewDeadline(
      goal.deadline ? new Date(goal.deadline).toISOString().split("T")[0] : "",
    );

    setErrorMsg("");
    setShowGoalForm(true);
  }

  function handleGoalTypeChange(event) {
    const value = event.target.value;

    setNewGoalType(value);

    if (value === "Primary") {
      setParentGoalId("");
    }

    if (value === "Secondary" && primaryGoalOptions.length === 1) {
      setParentGoalId(primaryGoalOptions[0]._id);
    }
  }

  async function refreshGoals() {
    const data = await getGoals({
      search: searchGoal,
      category: categoryFilter === "All" ? undefined : categoryFilter,
      priority: priorityFilter === "All" ? undefined : priorityFilter,
      goalType: goalTypeFilter === "All" ? undefined : goalTypeFilter,
      status: statusFilter === "All" ? undefined : statusFilter,
      sort: sortOption === "default" ? undefined : sortOption,
    });

    setGoals(data);
  }

  async function addGoal() {
    if (!newGoal.trim()) {
      setErrorMsg("Goal title cannot be empty.");
      return;
    }

    if (newGoalType === "Secondary" && !parentGoalId) {
      setErrorMsg("Please select a parent goal.");
      return;
    }

    try {
      setErrorMsg("");

      const goalData = {
        title: newGoal.trim(),
        category: newCategory,
        priority: newPriority,
        goalType: newGoalType,
        parentGoal: newGoalType === "Secondary" ? parentGoalId : null,
        deadline: newDeadline || null,
      };

      if (editingGoalId) {
        await updateGoal(editingGoalId, goalData);
      } else {
        await createGoal(goalData);
      }

      await refreshGoals();

      closeGoalForm();
    } catch (error) {
      console.error("Failed to save goal:", error);

      setErrorMsg("Unable to save the goal. Please try again.");
    }
  }

  async function confirmDeleteGoal() {
    if (!selectedGoalId) {
      return;
    }

    try {
      await deleteGoal(selectedGoalId);

      await refreshGoals();
    } catch (error) {
      console.error("Failed to delete goal:", error);

      setErrorMsg("Unable to delete the goal. Please try again.");
    } finally {
      setShowDeleteModal(false);
      setSelectedGoalId(null);
    }
  }

  const dialogTitle = editingGoalId
    ? "Edit Goal"
    : journeyStep?.action === "createPrimaryGoal"
      ? "Create Primary Goal"
      : journeyStep?.action === "createSecondaryGoal"
        ? "Create Secondary Goal"
        : "Add Goal";

  const dialogSaveText = editingGoalId
    ? "Update Goal"
    : journeyStep?.action === "createPrimaryGoal"
      ? "Create Primary Goal"
      : journeyStep?.action === "createSecondaryGoal"
        ? "Create Secondary Goal"
        : "Add Goal";

  if (loading) {
    return (
      <div className="container">
        <h1>Goals</h1>

        <LoadingState message="Loading your goals..." />
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Goals</h1>

      <JourneyBanner
        isGuidedSetup={isGuidedSetup}
        journeyStep={journeyStep}
        secondaryGoals={secondaryGoals}
      />

      <JourneyMessage journeyStep={journeyStep} primaryGoal={primaryGoals[0]} />

      <div className="goal-page-actions">
        <button type="button" className="add-goal-btn" onClick={openAddGoal}>
          + Add Goal
        </button>
      </div>

      <GoalFilters
        searchGoal={searchGoal}
        setSearchGoal={setSearchGoal}
        sortOption={sortOption}
        setSortOption={setSortOption}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        goalTypeFilter={goalTypeFilter}
        setGoalTypeFilter={setGoalTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {errorMsg && !showGoalForm && <p className="error">{errorMsg}</p>}

      <GoalSections
        goals={goals}
        primaryGoals={primaryGoals}
        secondaryGoals={secondaryGoals}
        getChildGoals={getChildGoals}
        getParentGoalTitle={getParentGoalTitle}
        editGoal={editGoal}
        showDeleteModal={showDeleteModal}
        confirmDeleteGoal={confirmDeleteGoal}
        setShowDeleteModal={setShowDeleteModal}
        setSelectedGoalId={setSelectedGoalId}
      />

      <FormDialog
        isOpen={showGoalForm}
        title={dialogTitle}
        onClose={closeGoalForm}
        footer={
          <>
            <button
              type="button"
              className="cancel-btn"
              onClick={closeGoalForm}
            >
              Cancel
            </button>

            <button type="button" className="save-btn" onClick={addGoal}>
              {dialogSaveText}
            </button>
          </>
        }
      >
        <GoalForm
          editingGoalId={editingGoalId}
          journeyStep={journeyStep}
          newGoal={newGoal}
          setNewGoal={setNewGoal}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          newPriority={newPriority}
          setNewPriority={setNewPriority}
          isGuidedSetup={isGuidedSetup}
          newGoalType={newGoalType}
          handleGoalTypeChange={handleGoalTypeChange}
          primaryGoalOptions={primaryGoalOptions}
          parentGoalId={parentGoalId}
          setParentGoalId={setParentGoalId}
          newDeadline={newDeadline}
          setNewDeadline={setNewDeadline}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
        />
      </FormDialog>
    </div>
  );
}

export default Goals;
