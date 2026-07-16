import {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";
import initialGoals from "../../data/goals";
import JourneyBanner from "./components/JourneyBanner";
import GoalSections from "./components/GoalSections";
import GoalFilters from "./components/GoalFilters";
import GoalForm from "./components/GoalForm";
import JourneyMessage from "./components/JourneyMessage";
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
    const isGuidedSetup =
        journeyAction === "createPrimaryGoal" ||
        journeyAction === "createSecondaryGoal";

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
            
            if (isGuidedSetup) {
                goToNextStep();
            }

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

            <JourneyMessage
                journeyStep={journeyStep}
                primaryGoal={primaryGoal}
            />

            {/* Filters GoalCard */}
            {!isGuidedSetup && (
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
            )}


            <JourneyBanner
                isGuidedSetup={isGuidedSetup}
                journeyStep={journeyStep}
                secondaryGoals={secondaryGoals}
            />

            {/* Add Goal GoalCard */}
            <GoalForm
                goalFormRef={goalFormRef}
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
                addGoal={addGoal}
                navigate={navigate}
                handleCancelEdit={handleCancelEdit}
                filteredGoals={filteredGoals}
                goals={goals}
                primaryGoals={primaryGoals}
                secondaryGoals={secondaryGoals}
            />
            
            {/* Goal Sections */}
            {!isGuidedSetup && (
                <GoalSections
                    filteredGoals={filteredGoals}
                    filteredPrimaryGoals={filteredPrimaryGoals}
                    filteredSecondaryGoals={filteredSecondaryGoals}
                    getChildGoals={getChildGoals}
                    getParentGoalTitle={getParentGoalTitle}
                    handleProgress={handleProgress}
                    editGoal={editGoal}
                    completedGoal={completedGoal}
                    setCompletedGoal={setCompletedGoal}
                    showDeleteModal={showDeleteModal}
                    confirmDeleteGoal={confirmDeleteGoal}
                    setShowDeleteModal={setShowDeleteModal}
                    setSelectedGoalId={setSelectedGoalId}
                />
            )}
        </div>
    );   

}

export default Goals;