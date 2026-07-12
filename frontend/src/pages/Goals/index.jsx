import {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";
import GoalCard from "../../components/GoalCard";
import initialGoals from "../../data/goals";
import ConfirmModal from "../../components/ConfirmModal";
import { storageService } from "../../services/storageService";
import { journeyService } from "../../services/journeyService";
import "./index.css"

function syncPrimaryGoalProgress(goals) {

    return goals.map(goal => {

        if (goal.goalType !== "Primary") {
            return goal;
        }
         
        const childGoals = goals.filter(
            child => child.parentGoalId === goal.id
        );
    
        if (childGoals.length === 0) {
            return {
                ...goal,
                progress: 0,
                completed: false
            };
        }
        const averageProgress = Math.round(
            childGoals.reduce(
                (total, child) => total + child.progress,
                0
            ) / childGoals.length
        );

        return {
            ...goal,
            progress: averageProgress,
            completed: averageProgress === 100
        };
    });
}


function Goals() {
    const navigate = useNavigate();
    const location = useLocation();
    const journeyAction = location.state?.action;
    const journeyStep = journeyService.getNextStep();
    const { primaryGoal } = journeyService.getJourneyOverview();

    // Form, filter, and sorting state for the goals page.
    const [newGoal, setNewGoal] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [searchGoal, setSearchGoal] = useState("");
    const [sortOption, setSortOption] = useState("default");
    const [newDeadline, setNewDeadline] = useState("");
    const [newCategory, setNewCategory] = useState("Learning");
    const [newPriority, setNewPriority] = useState("Medium");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [goalTypeFilter, setGoalTypeFilter] = useState("All");
    const [newGoalType, setNewGoalType] = useState(() => {
        return journeyAction === "createSecondaryGoal"
            ? "Secondary"
            : "Primary";
    });
    const [parentGoalId, setParentGoalId] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedGoalId, setSelectedGoalId] = useState(null);
    const [goals, setGoals] = useState(() => {
        const savedGoals = storageService.getGoals();

            const goals = savedGoals.length > 0
                    ? savedGoals
                    : initialGoals;

            return syncPrimaryGoalProgress(goals);
        });
    const [completedGoal, setCompletedGoal] = useState(null);
    const [editingGoalId, setEditingGoalId] = useState(null);

    const goalFormRef = useRef(null);

    useEffect(() => {
        // Keep localStorage in sync whenever the goals list changes.
        storageService.saveGoals(goals);
    }, [goals]);

    function handleProgress(goalId) {
        // Increase progress in small steps and mark goals complete at 100%.
        setGoals(prevGoals => {

            const updatedGoals = prevGoals.map(goal => {
                if (goal.id === goalId) {

                    const newProgress = Math.min(
                        goal.progress + 10,
                        100
                    );

                    if (
                        newProgress === 100 &&
                        !goal.completed
                    ) {
                        setCompletedGoal(goal.title);
                    }

                    return {
                        ...goal,
                        progress: newProgress,
                        completed: newProgress === 100,
                        lastUpdated: Date.now()
                    };
                }

                return goal;
            });

            return syncPrimaryGoalProgress(updatedGoals);

        });
    }

    function goToNextStep() {

        const nextStep =
            journeyService.getNextStep();

        navigate(nextStep.page, {
            state: {
                fromJourney: true,
                action: nextStep.action
            }
        });

    }

    function handleCancelEdit() {

        setEditingGoalId(null);
        setNewGoal("");
        setNewDeadline("");
        setNewCategory("Learning");
        setNewPriority("Medium");
        setNewGoalType("Primary");
        setParentGoalId("");
        setErrorMsg("");

    }

    function confirmDeleteGoal() {

        const goalToDelete = goals.find(
            goal => goal.id === selectedGoalId
        );

        const childGoals = goals.filter(
            goal => goal.parentGoalId === selectedGoalId
        );

        if (
            goalToDelete?.goalType === "Primary" &&
            childGoals.length > 0
        ) {
            const confirmed = window.confirm(
                `This will also delete ${childGoals.length} secondary goal(s). Continue?`
            );

            if (!confirmed) {
                setShowDeleteModal(false);
                setSelectedGoalId(null);
                return;
            }
        }

        setGoals(prevGoals => {

            const updatedGoals = prevGoals.filter(goal => {

                if (goal.id === selectedGoalId) {
                    return false;
                }

                if (goal.parentGoalId === selectedGoalId) {
                    return false;
                }

                return true;
            });

            return syncPrimaryGoalProgress(updatedGoals);

        });

        setShowDeleteModal(false);
        setSelectedGoalId(null);
    }


    function addGoal() {
        // Stop empty goals from being added to the tracker.
        if (newGoal.trim().length < 3) {
            setErrorMsg("Goal title must be at least 3 characters.");
            return;
        }
        setErrorMsg("");

        if (
            newGoalType === "Secondary" &&
            !parentGoalId
        ) {
            setErrorMsg(
                "Please select a parent goal."
            );
            return;
        }

        if (
            newGoalType === "Secondary" &&
            primaryGoalOptions.length === 0
        ) {
            setErrorMsg(
                "Create a primary goal before adding secondary goals."
            );
            return;
        }

        if (journeyAction === "createPrimaryGoal") {
            goToNextStep();
        }

        if (journeyAction === "createSecondaryGoal") {
            goToNextStep();
        }

        const normalizedTitle = newGoal.trim().toLowerCase();

        const duplicateGoal = goals.some(goal => {

            if (goal.goalType !== newGoalType) {
                return false;
            }

            if (goal.goalType === "Primary") {
                return (
                    goal.title.toLowerCase() === normalizedTitle
                );
            }

            return (
                goal.title.toLowerCase() === normalizedTitle &&
                goal.parentGoalId === parentGoalId
            );
        });

        if (duplicateGoal) {
            setErrorMsg(
                `${newGoalType} goal already exists.`
            );
            return;
        }

        if (editingGoalId) {

            setGoals(prevGoals => {

                const updatedGoals = prevGoals.map(goal => {

                    if (goal.id !== editingGoalId) {
                        return goal;
                    }

                    return {
                        ...goal,
                        title: newGoal.trim(),
                        category: newCategory,
                        priority: newPriority,
                        deadline: newDeadline,
                        goalType: newGoalType,
                        parentGoalId:
                            newGoalType === "Secondary"
                                ? parentGoalId
                                : null,
                        lastUpdated: Date.now()
                    };

                });

                return syncPrimaryGoalProgress(updatedGoals);

            });

            setEditingGoalId(null);
            setNewGoal("");
            setNewDeadline("");
            setNewCategory("Learning");
            setNewPriority("Medium");
            setNewGoalType("Primary");
            setParentGoalId("");

            return;
        }

        // Add the new goal with the current category, priority, and deadline.
        setGoals(prevGoals => {
            const updatedGoals =[
                ...prevGoals,
                {
                    id: Date.now(),
                    title: newGoal.trim(),
                    category: newCategory,
                    priority: newPriority,
                    progress: 0,
                    goalType: newGoalType,
                    parentGoalId: newGoalType === "Secondary" ? parentGoalId : null,
                    completed: false,
                    deadline: newDeadline,
                    lastUpdated: Date.now()
                }
            ];
            return syncPrimaryGoalProgress(updatedGoals);
        });
        setNewGoal("");
        setNewDeadline("");
        setNewCategory("Learning");
        setNewPriority("Medium");
        setNewGoalType("Primary");
        setParentGoalId("");
    }

   function editGoal(goalId) {

        const goal = goals.find(
            goal => goal.id === goalId
        );

        if (!goal) {
            return;
        }

        setEditingGoalId(goal.id);

        setNewGoal(goal.title);
        setNewCategory(goal.category);
        setNewPriority(goal.priority);
        setNewDeadline(goal.deadline);
        setNewGoalType(goal.goalType);
        setParentGoalId(goal.parentGoalId ?? "");
        setErrorMsg("");
        
        goalFormRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

    function handleGoalTypeChange(event) {

        setErrorMsg("");

        const value = event.target.value;

        setNewGoalType(value);

        if (
            value === "Secondary" &&
            primaryGoalOptions.length === 1
        ) {
            setParentGoalId(primaryGoalOptions[0].id);
        } else {
            setParentGoalId("");
        }

    }

    // Build the visible list from the current search, category, and sort choices.
    const primaryGoals = goals.filter(goal => goal.goalType === "Primary");

    const secondaryGoals = goals.filter(goal => goal.goalType === "Secondary");

    const filteredGoals = [...goals]
        .filter(goal =>
            goal.title
                .toLowerCase()
                .includes(
                    searchGoal.toLowerCase()
                )
        )
        .filter(goal =>
        categoryFilter === "All"
            ? true
            : goal.category ===
              categoryFilter
        )
        .filter(goal =>
            priorityFilter === "All"
                ? true
                : goal.priority ===
                priorityFilter
        )
        .filter(goal => {
            if (
                statusFilter === "Active"
            ) {
                return !goal.completed;
            }

            if (
                statusFilter ===
                "Completed"
            ) {
                return goal.completed;
            }

            return true;
        })
        .filter(goal =>
            goalTypeFilter === "All"
                ? true
                : goal.goalType === goalTypeFilter
        )
        .sort((a, b) => {
            if (sortOption === "az") {
                return a.title.localeCompare(
                    b.title
                );
            }

            if (sortOption === "za") {
                return b.title.localeCompare(
                    a.title
                );
            }

            if (sortOption === "high") {
                return (
                    b.progress - a.progress
                );
            }

            if (sortOption === "low") {
                return (
                    a.progress - b.progress
                );
            }

            if (sortOption === "recent") {
                return (
                    b.lastUpdated -
                    a.lastUpdated
                );
            }
            const priorityOrder = {
                High: 3,
                Medium: 2,
                Low: 1
            };

            if (
                sortOption === "priorityHigh"
            ) {
                return (
                    priorityOrder[ b.priority ] - priorityOrder[ a.priority ]
                );
            }

            if (
                sortOption ===
                "priorityLow"
            ) {
                return (
                    priorityOrder[
                        a.priority
                    ] -
                    priorityOrder[
                        b.priority
                    ]
                );
            }

            return 0;
        });

    const filteredPrimaryGoals =
        filteredGoals.filter(
            goal =>
                goal.goalType ===
                "Primary"
        );

    const filteredSecondaryGoals =
        filteredGoals.filter(
            goal =>
                goal.goalType ===
                "Secondary"
        );
    
    const primaryGoalOptions =
        goals.filter(
            goal =>
                goal.goalType === "Primary"
        );

    function getParentGoalTitle(parentGoalId) {
        const parentGoal = goals.find(
            goal => goal.id === parentGoalId
        );

        return parentGoal
            ? parentGoal.title
            : null;
    }

    function getChildGoals(parentId) {
        return goals.filter(
            goal =>
                goal.parentGoalId === parentId
        );
    }

        return (
        <div className="container">
            {/* Page Title */}
            <h1>Goals</h1>

            <div className="journey-message">

                <p>
                    {journeyStep.description}
                </p>

                {primaryGoal && (
                    <p>
                        <strong>Current Primary Goal:</strong>{" "}
                        {primaryGoal.title}
                    </p>
                )}

            </div>

            {/* Filters GoalCard */}
            <div className="filters-GoalCard">
                <h3>Filters</h3>

                <div className="filters-toolbar">

                    <div className="filter-group">
                        <label>Search</label>

                        <input
                            type="search"
                            placeholder="Search Goals"
                            value={searchGoal}
                            onChange={(e) =>
                                setSearchGoal(
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="filter-group">
                        <label>Sort By</label>

                        <select
                            value={sortOption}
                            onChange={(e) =>
                                setSortOption(
                                    e.target.value
                                )
                            }
                        >
                            <option value="default">
                                Default
                            </option>

                            <option value="az">
                                A-Z
                            </option>

                            <option value="za">
                                Z-A
                            </option>

                            <option value="priorityHigh">
                                Priority High-Low
                            </option>

                            <option value="priorityLow">
                                Priority Low-High
                            </option>

                            <option value="high">
                                Highest Progress
                            </option>

                            <option value="low">
                                Lowest Progress
                            </option>

                            <option value="recent">
                                Recently Updated
                            </option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Category</label>

                        <select
                            value={categoryFilter}
                            onChange={(e) =>
                                setCategoryFilter(
                                    e.target.value
                                )
                            }
                        >
                            <option value="All">
                                All Categories
                            </option>

                            <option value="Learning">
                                Learning
                            </option>

                            <option value="Career">
                                Career
                            </option>

                            <option value="Personal">
                                Personal
                            </option>

                            <option value="Health">
                                Health
                            </option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Priority</label>

                        <select
                            value={priorityFilter}
                            onChange={(e) =>
                                setPriorityFilter(
                                    e.target.value
                                )
                            }
                        >
                            <option value="All">
                                All Priorities
                            </option>

                            <option value="High">
                                High
                            </option>

                            <option value="Medium">
                                Medium
                            </option>

                            <option value="Low">
                                Low
                            </option>
                        </select>
                    </div>
                    
                    <div className="filter-group">
                        <label>Goal Type</label>

                        <select
                            value={goalTypeFilter}
                            onChange={(e) =>
                                setGoalTypeFilter(
                                    e.target.value
                                )
                            }
                        >
                            <option value="All">
                                All Types
                            </option>

                            <option value="Primary">
                                Primary Goals
                            </option>

                            <option value="Secondary">
                                Secondary Goals
                            </option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Status</label>

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value
                                )
                            }
                        >
                            <option value="All">
                                All Goals
                            </option>

                            <option value="Active">
                                Active Goals
                            </option>

                            <option value="Completed">
                                Completed Goals
                            </option>
                        </select>
                    </div>

                </div>
            </div>
            
            {/* Add Goal GoalCard */}
            <div className="add-goal-GoalCard" ref={goalFormRef}>
               <h3>
                    {editingGoalId
                        ? "Edit Goal"
                        : journeyAction === "createPrimaryGoal"
                            ? "Create Primary Goal"
                            : journeyAction === "createSecondaryGoal"
                                ? "Create Secondary Goal"
                                : "Add Goal"}
                </h3>

                <input
                    type="text"
                    placeholder={
                        editingGoalId
                            ? "Edit Goal Title"
                            : "Goal Title"
                    }
                    value={newGoal}
                    onChange={(e) => {
                        setNewGoal(e.target.value);
                        setErrorMsg("");
                    }}
                />

                <div className="goal-options">

                    <div className="filter-group">
                        <label>Category</label>

                        <select
                            value={newCategory}
                            onChange={(e) =>
                                setNewCategory(
                                    e.target.value
                                )
                            }
                        >
                            <option value="Learning">
                                Learning
                            </option>

                            <option value="Career">
                                Career
                            </option>

                            <option value="Personal">
                                Personal
                            </option>

                            <option value="Health">
                                Health
                            </option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Priority</label>

                        <select
                            value={newPriority}
                            onChange={(e) =>
                                setNewPriority(
                                    e.target.value
                                )
                            }
                        >
                            <option value="High">
                                High
                            </option>

                            <option value="Medium">
                                Medium
                            </option>

                            <option value="Low">
                                Low
                            </option>
                        </select>
                    </div>

                    {!journeyAction && (
                    <div className="filter-group">
                        <label>Goal Type</label>

                        <select
                            value={newGoalType}
                            onChange={handleGoalTypeChange}
                        >
                            <option value="Primary">
                                Primary
                            </option>

                            <option
                                value="Secondary"
                                disabled={primaryGoalOptions.length === 0}
                            >
                                Secondary
                            </option>
                        </select>
                    </div>
                )}
                    
                    {primaryGoalOptions.length === 0 && (
                        <small className="helper-text">
                            Create a primary goal first to unlock secondary goals.
                        </small>
                    )}

                    {(
                        newGoalType === "Secondary" ||
                        journeyAction === "createSecondaryGoal"
                    ) && (
                        <div className="filter-group">
                            <label>Parent Goal</label>

                            <select
                                value={parentGoalId}
                                onChange={(e) =>
                                    setParentGoalId(
                                        Number(e.target.value)
                                    )
                                }
                            >
                                <option value="">
                                    Select Parent Goal
                                </option>

                                {primaryGoalOptions.map(goal => (
                                    <option
                                        key={goal.id}
                                        value={goal.id}
                                    >
                                        {goal.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="filter-group">
                        <label>Deadline</label>

                        <input
                            type="date"
                            value={newDeadline}
                            onChange={(e) =>
                                setNewDeadline(
                                    e.target.value
                                )
                            }
                        />
                    </div>

                </div>
                
                {errorMsg && (
                    <p className="error">
                        {errorMsg}
                    </p>
                )}

                <div className="goal-form-actions">

                    <button onClick={addGoal}>
                        {editingGoalId
                            ? "Update Goal"
                            : journeyAction === "createPrimaryGoal"
                                ? "Create Primary Goal"
                                : journeyAction === "createSecondaryGoal"
                                    ? "Create Secondary Goal"
                                    : "Add Goal"}
                    </button>

                    {editingGoalId && (
                        <button
                            className="cancel-btn"
                            onClick={handleCancelEdit}
                        >
                            Cancel Edit
                        </button>
                    )}

                </div>

                <p className="goal-counter">
                    Showing {filteredGoals.length} of {goals.length} goals
                </p>
                <p className="goal-counter">
                    Primary Goals: {primaryGoals.length}
                </p>

                <p className="goal-counter">
                    Secondary Goals: {secondaryGoals.length}
                </p>
            </div>
            
            {/* Goal Sections */}
            <div>
                {/* Goal GoalCards */}
                {filteredGoals.length > 0 ? (
                    <>
                        {filteredPrimaryGoals.length > 0 && (
                            <>
                                <h2 className="goal-section-title">
                                    Primary Goals
                                </h2>

                                <div className="goals-grid">
                                    {filteredPrimaryGoals.map(goal => (
                                        <GoalCard
                                            key={goal.id}
                                            id={goal.id}
                                            title={goal.title}
                                            progress={goal.progress}
                                            category={goal.category}
                                            onProgress={null}
                                            priority={goal.priority}
                                            goalType={goal.goalType}
                                            childGoals={getChildGoals(goal.id)}
                                            onDelete={(goalId) => {
                                                setSelectedGoalId(goalId);
                                                setShowDeleteModal(true);
                                            }}
                                            onEdit={editGoal}
                                            deadline={goal.deadline}
                                            completed={goal.completed}
                                        />
                                    ))}
                                </div>
                            </>
                        )}

                        {filteredSecondaryGoals.length > 0 && (
                            <>
                                <h2 className="goal-section-title">
                                    Secondary Goals
                                </h2>

                                <div className="goals-grid">
                                    {filteredSecondaryGoals.map(goal => (
                                        <GoalCard
                                            key={goal.id}
                                            id={goal.id}
                                            title={goal.title}
                                            progress={goal.progress}
                                            category={goal.category}
                                            onProgress={handleProgress}
                                            priority={goal.priority}
                                            goalType={goal.goalType}
                                            onDelete={(goalId) => {
                                                setSelectedGoalId(goalId);
                                                setShowDeleteModal(true);
                                            }}
                                            parentGoalTitle={
                                                getParentGoalTitle(
                                                    goal.parentGoalId
                                                )
                                            }
                                            onEdit={editGoal}
                                            deadline={goal.deadline}
                                            completed={goal.completed}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="empty-state">
                        <h3>No Goals found</h3>

                        <p>
                            Add a Goal or adjust
                            your filters.
                        </p>
                    </div>
                )}

                {completedGoal && (
                    <div className="success-banner">
                        🎉 Congratulations! You completed "{completedGoal}".
                        <button
                            onClick={() => setCompletedGoal(null)}
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                <ConfirmModal
                    isOpen={showDeleteModal}
                    title="Delete Goal"
                    message="Are you sure you want to delete this goal?"
                    onConfirm={confirmDeleteGoal}
                    onCancel={() => {
                        setShowDeleteModal(false);
                        setSelectedGoalId(null);
                    }}
                />
            </div>
</div>
    );   

}

export default Goals;
