import {useState, useEffect} from "react";
import Card from "../../components/Card";
import initialGoals from "../../data/goals";
import SearchSortBar from "../../components/SearchSortBar";
import "./index.css"

function Goals() {
    const [newGoal, setNewGoal] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [searchGoal, setSearchGoal] = useState("");
    const [sortOption, setSortOption] = useState("default");
    const [newDeadline, setNewDeadline] = useState("");
    const [newCategory, setNewCategory] = useState("Learning");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [newPriority, setNewPriority] = useState("Medium");
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
        setGoals(prevGoals => prevGoals.map(goal => {
            if (goal.id === goalId) {
                return {
                ...goal,
                progress: Math.min(goal.progress + 10, 100),
                lastUpdated: Date.now()
            };
            }
            return goal;
        }));
    }

    function deleteGoal(goalId) {
        setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
    }


    function addGoal() {
        if (newGoal.trim() === "") {
            setErrorMsg("Goal cannot be empty.");
            return;
        }
        setErrorMsg("");
        setGoals(prevGoals => [
            ...prevGoals,
            {
                id: Date.now(),
                title: newGoal.trim(),
                category: newCategory,
                priority: newPriority,
                progress: 0,
                deadline: newDeadline,
                lastUpdated: Date.now()
            }
        ]);
        setNewGoal("");
        setNewDeadline("");
        setNewCategory("Learning");
        setNewPriority("Medium");
    }

    function editGoal(goalId, updatedTitle) {
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

    return (
        <div className="container">
        {/* Search and sort controls */}
        <SearchSortBar
                searchValue={searchGoal}
                onSearchChange={
                    setSearchGoal
                }
                sortValue={sortOption}
                onSortChange={
                    setSortOption
                }
                searchPlaceholder="Search Goals"
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
        </SearchSortBar>

        {/* Filter goals by category */}
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
        {/* Filter goals by priority */}
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
        {/* New goal title */}
        <input 
            type="text" 
            placeholder="Add Goal" 
            value={newGoal} 
            onChange={(e) => { 
                setNewGoal(e.target.value); setErrorMsg(""); 
            }} 
        />

        {/* New goal category */}
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

        {/* New goal priority */}
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

        {/* Optional deadline for the new goal */}
        <input
            type="date"
            value={newDeadline}
            onChange={(e) =>
                setNewDeadline(
                    e.target.value
                )
            }
        />

        {errorMsg && <p>{errorMsg}</p>}

        <button onClick={addGoal}>Add Goal</button>
        
            {/* Goal cards */}
            {filteredGoals.map((goal) => (
                <Card
                    key={goal.id}
                    id={goal.id}
                    title={goal.title}
                    progress={goal.progress}
                    category={goal.category}
                    onProgress={handleProgress}
                    priority={goal.priority}
                    onDelete={deleteGoal}
                    onEdit={editGoal}
                    deadline={goal.deadline}
                />
            ))}

        </div>
    );   

}

export default Goals;
