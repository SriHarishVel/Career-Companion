import {useState, useEffect} from "react";
import Card from "../../components/Card";
import initialGoals from "../../data/goals";
import ConfirmModal from "../../components/ConfirmModal";
import "./index.css"

function Goals() {
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
    const [newGoalType, setNewGoalType] = useState("Primary");
    const [parentGoalId, setParentGoalId] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedGoalId, setSelectedGoalId] = useState(null);
    const [goals, setGoals] = useState(() => {
        // Load saved goals first so user changes stay after refresh.
        const savedGoals = localStorage.getItem("goals");

        if (savedGoals) {
            return JSON.parse(savedGoals);
        }

        return initialGoals;
    });

    useEffect(() => {
        // Keep localStorage in sync whenever the goals list changes.
        localStorage.setItem("goals", JSON.stringify(goals));
    }, [goals]);

    function handleProgress(goalId) {
        // Increase progress in small steps and mark goals complete at 100%.
        setGoals(prevGoals => prevGoals.map(goal => {
            if (goal.id === goalId) {
                const newProgress =
                    Math.min(
                        goal.progress + 10,
                        100
                    );

                return {
                    ...goal,
                    progress: newProgress,
                    completed:
                        newProgress === 100,
                    lastUpdated: Date.now()
                };
            }
            return goal;
        }));
    }

    function confirmDeleteGoal() {
        setGoals(prevGoals =>
            prevGoals.filter(
                goal =>
                    goal.id !==
                    selectedGoalId
            )
        );

        setShowDeleteModal(false);
        setSelectedGoalId(null);
    }


    function addGoal() {
        // Stop empty goals from being added to the tracker.
        if (newGoal.trim() === "") {
            setErrorMsg("Goal cannot be empty.");
            return;
        }
        setErrorMsg("");

        // Add the new goal with the current category, priority, and deadline.
        setGoals(prevGoals => [
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
        ]);
        setNewGoal("");
        setNewDeadline("");
        setNewCategory("Learning");
        setNewPriority("Medium");
        setNewGoalType("Primary");
        setParentGoalId("");
    }

    function editGoal(goalId, updatedTitle) {
        // Ignore blank edits so existing goal names are not erased.
        if (updatedTitle.trim() === "") {
            return;
        }

        setGoals(prevGoals  =>
            prevGoals.map(goal => {
                if (goal.id === goalId) {
                    return {
                        ...goal,
                        title: updatedTitle.trim(),
                        lastUpdated: Date.now()
                    };
                }

                return goal;
            })
        );
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

        return (
        <div className="container">
            {/* Page Title */}
            <h1>Goals</h1>

            {/* Filters Card */}
            <div className="filters-card">
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
            
            {/* Add Goal Card */}
            <div className="add-goal-card">
                <h3>Add Goal</h3>

                <input
                    type="text"
                    placeholder="Goal Title"
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

                    <div className="filter-group">
                        <label>Goal Type</label>

                        <select
                            value={newGoalType}
                            onChange={(e) =>
                                setNewGoalType(
                                    e.target.value
                                )
                            }
                        >
                            <option value="Primary">
                                Primary
                            </option>

                            <option value="Secondary">
                                Secondary
                            </option>
                        </select>
                    </div>
                    
                    {newGoalType === "Secondary" && (
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

                <button onClick={addGoal}>
                    Add Goal
                </button>

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
                {/* Goal cards */}
                {filteredGoals.length > 0 ? (
                    <>
                        {filteredPrimaryGoals.length > 0 && (
                            <>
                                <h2 className="goal-section-title">
                                    Primary Goals
                                </h2>

                                <div className="goals-grid">
                                    {filteredPrimaryGoals.map(goal => (
                                        <Card
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
                                        <Card
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
