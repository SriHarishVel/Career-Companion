    import {useState, useEffect} from "react";
    import { useLocation, useNavigate } from "react-router-dom";
    import { useRef } from "react";
    import JourneyBanner from "./components/JourneyBanner";
    import GoalSections from "./components/GoalSections";
    import GoalFilters from "./components/GoalFilters";
    import GoalForm from "./components/GoalForm";
    import JourneyMessage from "./components/JourneyMessage";
    import { journeyService } from "../../services/journeyService";
    import {
        getGoals,
        createGoal,
        updateGoal,
        deleteGoal
    } from "../../services/goalService";
    import "./index.css"

    function syncPrimaryGoalProgress(goals) {

        return goals.map(goal => {

            if (goal.goalType !== "Primary") {
                return goal;
            }
            
            const childGoals = goals.filter(
                child => child.parentGoal?._id === goal._id
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
        const [goals, setGoals] = useState([]);
        const [completedGoal, setCompletedGoal] = useState(null);
        const [editingGoalId, setEditingGoalId] = useState(null);
        const [journeyStep, setJourneyStep] = useState(null);
        const [primaryGoal, setPrimaryGoal] = useState(null);

        const goalFormRef = useRef(null);

        useEffect(() => {

            async function fetchGoals() {

                try {

                    const [
                        goals,
                        journeyOverview,
                        nextStep
                    ] = await Promise.all([
                        getGoals({
                            search: searchGoal || undefined,

                            category:
                                categoryFilter === "All"
                                    ? undefined
                                    : categoryFilter,

                            priority:
                                priorityFilter === "All"
                                    ? undefined
                                    : priorityFilter,

                            goalType:
                                goalTypeFilter === "All"
                                    ? undefined
                                    : goalTypeFilter,

                            status:
                                statusFilter === "All"
                                    ? undefined
                                    : statusFilter,

                            sort:
                                sortOption === "default"
                                    ? undefined
                                    : sortOption,
                        }),

                        journeyService.getJourneyOverview(),
                        journeyService.getNextStep()
                    ]);

                    setGoals(syncPrimaryGoalProgress(goals));

                    setPrimaryGoal(journeyOverview.primaryGoal);

                    if (isGuidedSetup) {
                        setJourneyStep(nextStep);
                    } else {
                        setJourneyStep(null);
                    }

                } catch (error) {

                    console.error(
                        "Failed to load goals:",
                        error
                    );

                }

            }

            fetchGoals();

        }, [
            searchGoal,
            categoryFilter,
            priorityFilter,
            goalTypeFilter,
            statusFilter,
            sortOption
        ]);

        async function handleProgress(goalId) {

            try {
                const goal = goals.find(
                    goal => goal._id === goalId
                );

                if (!goal) {
                    return;
                }

                const newProgress = Math.min(
                    goal.progress + 10,
                    100
                );

                await updateGoal(goalId, {
                    progress: newProgress,
                    completed: newProgress === 100
                });

                if (
                    newProgress === 100 &&
                    !goal.completed
                ) {
                    setCompletedGoal(goal.title);
                }

                const updatedGoals = await getGoals();

                setGoals(
                    syncPrimaryGoalProgress(updatedGoals)
                );

            } catch (error) {
                console.error(error);
            }
        }

        function goToNextStep() {

            if (!journeyStep) {
                return;
            }

            navigate(journeyStep.page, {
                state: {
                    fromJourney: true,
                    action: journeyStep.action
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

        async function confirmDeleteGoal() {

            const goalToDelete = goals.find(
                goal => goal._id === selectedGoalId
            );

            const childGoals = goals.filter(
                goal => goal.parentGoal?._id === selectedGoalId
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

            try {

                await deleteGoal(selectedGoalId);

                const updatedGoals = await getGoals();

                setGoals(
                    syncPrimaryGoalProgress(updatedGoals)
                );

            } catch (error) {
                console.error(error);
            }

            setShowDeleteModal(false);
            setSelectedGoalId(null);
        }


        async function addGoal() {
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
                    goal.parentGoal?._id === parentGoalId
                );
            });

            if (duplicateGoal) {
                setErrorMsg(
                    `${newGoalType} goal already exists.`
                );
                return;
            }

            if (editingGoalId) {

                try {

                    await updateGoal(editingGoalId, {
                        title: newGoal.trim(),
                        category: newCategory,
                        priority: newPriority,
                        deadline: newDeadline,
                        goalType: newGoalType,
                        parentGoal:
                            newGoalType === "Secondary"
                                ? parentGoalId
                                : null
                    });

                    const goals = await getGoals();

                    setGoals(
                        syncPrimaryGoalProgress(goals)
                    );

                } catch (error) {
                    console.error(error);
                }

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
            try{
                await createGoal({
                    title: newGoal.trim(),
                    category: newCategory,
                    priority: newPriority,
                    goalType: newGoalType,
                    parentGoal:
                        newGoalType === "Secondary"
                            ? parentGoalId
                            : null,
                    progress: 0,
                    completed: false,
                    deadline: newDeadline
                });
                const goals = await getGoals();
                setGoals(
                    syncPrimaryGoalProgress(goals)
                );
            } catch (error) {
                console.error(error);
            }

            setNewGoal("");
            setNewDeadline("");
            setNewCategory("Learning");
            setNewPriority("Medium");
            setNewGoalType("Primary");
            setParentGoalId("");
        }

function editGoal(goalId) {

        const goal = goals.find(
            goal => goal._id === goalId
        );

        if (!goal) {
            return;
        }

        setEditingGoalId(goal._id);
        setNewGoal(goal.title);
        setNewCategory(goal.category);
        setNewPriority(goal.priority);
        setNewDeadline(goal.deadline);
        setNewGoalType(goal.goalType);
        setParentGoalId(goal.parentGoal?._id ?? "");
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
            setParentGoalId(primaryGoalOptions[0]._id);
        } else {
            setParentGoalId("");
        }

    }

        // Build the visible list from the current search, category, and sort choices.
        const primaryGoals = goals.filter(goal => goal.goalType === "Primary");

        const secondaryGoals = goals.filter(goal => goal.goalType === "Secondary");
        
        const primaryGoalOptions =
            goals.filter(
                goal =>
                    goal.goalType === "Primary"
            );

        function getParentGoalTitle(parentGoalId) {
            const parentGoal = goals.find(
                goal => goal._id === parentGoalId
            );

            return parentGoal
                ? parentGoal.title
                : null;
        }

        function getChildGoals(parentId) {
            return goals.filter(
                goal =>
                    goal.parentGoal?._id === parentId
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
                    goals={goals}
                    primaryGoals={primaryGoals}
                    secondaryGoals={secondaryGoals}
                />
                
                {/* Goal Sections */}
                {!isGuidedSetup && (
                    <GoalSections
                        goals={goals}
                        primaryGoals={primaryGoals}
                        secondaryGoals={secondaryGoals}
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