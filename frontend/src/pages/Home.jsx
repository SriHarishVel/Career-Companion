import {useState} from "react";
import GoalCard from "../components/GoalCard";

function Home() {
    const [showMessage, setShowMessage] = useState(true);
    const [newGoal, setNewGoal] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [goals, setGoals] = useState([
        {
            id: 1,
            title: "Learn React",
            progress: 20
        },
        {
            id: 2,
            title: "Practice DSA",
            progress: 40
        },
        {
            id: 3,
            title: "Build Portfolio",
            progress: 10
        }
    ]);

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
        <>
            <h1>Career Companion</h1>
            {showMessage && <p>Welcome to Career Companion!</p>}
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
            <button
                onClick={() => setShowMessage(prev => !prev)}
            >
                {showMessage ? "Hide Message" : "Show Message"}
            </button>
        </>
    );   

}

export default Home;