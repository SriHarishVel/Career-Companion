import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import GoalFilters from "./components/GoalFilters";
import GoalForm from "./components/GoalForm";
import GoalSections from "./components/GoalSections";
import JourneySetup from "./components/JourneySetup";

import LoadingState from "../../components/LoadingState";
import useQueryParams from "../../hooks/useQueryParams";

import { getGoals, createGoal, updateGoal } from "../../services/goalService";

import "./index.css";

function Goals() {
  const location = useLocation();

  const { getParam, setParams, clearParams } = useQueryParams();

  const journeyStep = location.state?.journeyStep || null;
  const isGuidedSetup = Boolean(journeyStep);

  const initialFilters = {
    search: getParam("search") || "",
    sort: getParam("sort") || "default",
    category: getParam("category") || "All",
    priority: getParam("priority") || "All",
    goalType: getParam("goalType") || "All",
    status: getParam("status") || "All",
  };

  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const [goals, setGoals] = useState([]);

  const [newGoal, setNewGoal] = useState("");
  const [newCategory, setNewCategory] = useState("Learning");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newGoalType, setNewGoalType] = useState("Primary");
  const [parentGoalId, setParentGoalId] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  const [editingGoalId, setEditingGoalId] = useState(null);
  const [showGoalForm, setShowGoalForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchGoals() {
      try {
        setLoading(true);
        setErrorMsg("");

        const data = await getGoals({
          search: appliedFilters.search || undefined,
          category:
            appliedFilters.category === "All"
              ? undefined
              : appliedFilters.category,
          priority:
            appliedFilters.priority === "All"
              ? undefined
              : appliedFilters.priority,
          goalType:
            appliedFilters.goalType === "All"
              ? undefined
              : appliedFilters.goalType,
          status:
            appliedFilters.status === "All" ? undefined : appliedFilters.status,
          sort:
            appliedFilters.sort === "default" ? undefined : appliedFilters.sort,
        });

        if (!cancelled) {
          setGoals(data);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load goals:", error);

          setErrorMsg(
            error.response?.data?.message ||
              "Unable to load your goals. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchGoals();

    return () => {
      cancelled = true;
    };
  }, [appliedFilters]);

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

  function handleSearchChange(value) {
    setFilters((current) => ({
      ...current,
      search: value,
    }));
  }

  function handleSortChange(value) {
    setFilters((current) => ({
      ...current,
      sort: value,
    }));
  }

  function handleCategoryChange(value) {
    setFilters((current) => ({
      ...current,
      category: value,
    }));
  }

  function handlePriorityChange(value) {
    setFilters((current) => ({
      ...current,
      priority: value,
    }));
  }

  function handleGoalTypeFilterChange(value) {
    setFilters((current) => ({
      ...current,
      goalType: value,
    }));
  }

  function handleStatusChange(value) {
    setFilters((current) => ({
      ...current,
      status: value,
    }));
  }

  function applyFilters() {
    setAppliedFilters({ ...filters });

    setParams({
      search: filters.search || "",
      sort: filters.sort === "default" ? "" : filters.sort,
      category: filters.category === "All" ? "" : filters.category,
      priority: filters.priority === "All" ? "" : filters.priority,
      goalType: filters.goalType === "All" ? "" : filters.goalType,
      status: filters.status === "All" ? "" : filters.status,
    });
  }

  function clearFilters() {
    const clearedFilters = {
      search: "",
      sort: "default",
      category: "All",
      priority: "All",
      goalType: "All",
      status: "All",
    };

    setFilters(clearedFilters);
    setAppliedFilters(clearedFilters);

    clearParams([
      "search",
      "sort",
      "category",
      "priority",
      "goalType",
      "status",
    ]);
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
      search: appliedFilters.search || undefined,
      category:
        appliedFilters.category === "All" ? undefined : appliedFilters.category,
      priority:
        appliedFilters.priority === "All" ? undefined : appliedFilters.priority,
      goalType:
        appliedFilters.goalType === "All" ? undefined : appliedFilters.goalType,
      status:
        appliedFilters.status === "All" ? undefined : appliedFilters.status,
      sort: appliedFilters.sort === "default" ? undefined : appliedFilters.sort,
    });

    setGoals(data);
  }

  async function saveGoal() {
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

      setErrorMsg(
        error.response?.data?.message ||
          "Unable to save the goal. Please try again.",
      );
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
      <div className="container goals-page">
        <h1>Goals</h1>

        <LoadingState message="Loading your goals..." />
      </div>
    );
  }

  return (
    <div className="container goals-page">
      <h1>Goals</h1>

      <JourneySetup
        isGuidedSetup={isGuidedSetup}
        journeyStep={journeyStep}
        secondaryGoals={secondaryGoals}
        primaryGoal={primaryGoals[0]}
      />

      <div className="goal-page-actions">
        <button type="button" className="add-goal-btn" onClick={openAddGoal}>
          + Add Goal
        </button>
      </div>

      <GoalFilters
        searchGoal={filters.search}
        setSearchGoal={handleSearchChange}
        sortOption={filters.sort}
        setSortOption={handleSortChange}
        categoryFilter={filters.category}
        setCategoryFilter={handleCategoryChange}
        priorityFilter={filters.priority}
        setPriorityFilter={handlePriorityChange}
        goalTypeFilter={filters.goalType}
        setGoalTypeFilter={handleGoalTypeFilterChange}
        statusFilter={filters.status}
        setStatusFilter={handleStatusChange}
        onClearFilters={clearFilters}
        onApplyFilters={applyFilters}
      />

      {errorMsg && !showGoalForm && (
        <p className="error" role="alert">
          {errorMsg}
        </p>
      )}

      <GoalSections
        goals={goals}
        primaryGoals={primaryGoals}
        secondaryGoals={secondaryGoals}
        getChildGoals={getChildGoals}
        getParentGoalTitle={getParentGoalTitle}
      />

      <GoalForm
        isOpen={showGoalForm}
        onClose={closeGoalForm}
        title={dialogTitle}
        onSubmit={saveGoal}
        submitLabel={dialogSaveText}
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
    </div>
  );
}

export default Goals;