import {useState, useEffect} from "react";
import GoalCard from "../../components/GoalCard";
import initialGoals from "../../data/goals";
import "./index.css"

function Goals() {
    const [newGoal, setNewGoal] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
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
                return {...goal, progress: Math.min(goal.progress + 10, 100)};
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
        setGoals(prevGoals => [...prevGoals, {
            id: Date.now(),
            title: newGoal.trim(),
            progress: 0
        }]);
        setNewGoal("");
    }
    return (
        <div className="container">
        <input type="text" placeholder="Add Goal" value={newGoal} onChange={(e) => { setNewGoal(e.target.value); setErrorMsg(""); }} />
        {errorMsg && <p>{errorMsg}</p>}
        <button onClick={addGoal}>Add Goal</button>
            {goals.map((goal) => (
                <GoalCard
                    key={goal.id}
                    id={goal.id}
                    title={goal.title}
                    progress={goal.progress}
                    onProgress={handleProgress}
                    onDelete={deleteGoal}
                />
            ))}
        </div>
    );   

}

export default Goals;