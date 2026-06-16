import {useState, useEffect} from "react";
import Card from "../../components/Card";
import initialGoals from "../../data/goals";
import "./index.css"

function Goals() {
    const [newGoal, setNewGoal] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [searchGoal, setSearchGoal] = useState("");
    const [sortOption, setSortOption] = useState("default");
    const [goals, setGoals] = useState(() => {
        const savedGoals = localStorage.getItem("goals");

        if (savedGoals) {
            return JSON.parse(savedGoals);
        }

        return initialGoals;
    });

    useEffect(() => {
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
                progress: 0,
                lastUpdated: Date.now()
            }
        ]);
        setNewGoal("");
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
    const filteredGoals = [...goals]
        .filter(goal =>
            goal.title
                .toLowerCase()
                .includes(
                    searchGoal.toLowerCase()
                )
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

            return 0;
        });

    return (
        <div className="container">
        <input 
            type="Search"
            placeholder="Search Goals"
            value={searchGoal}
            onChange={(e)=>
                setSearchGoal(e.target.value)
            }
        />
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

        <input 
            type="text" 
            placeholder="Add Goal" 
            value={newGoal} 
            onChange={(e) => { 
                setNewGoal(e.target.value); setErrorMsg(""); 
            }} 
        />

        {errorMsg && <p>{errorMsg}</p>}

        <button onClick={addGoal}>Add Goal</button>
        
            {filteredGoals.map((goal) => (
                <Card
                    key={goal.id}
                    id={goal.id}
                    title={goal.title}
                    progress={goal.progress}
                    onProgress={handleProgress}
                    onDelete={deleteGoal}
                    onEdit={editGoal}
                />
            ))}

        </div>
    );   

}

export default Goals;