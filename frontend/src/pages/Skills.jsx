import {useState} from "react";
import GoalCard from "../components/GoalCard";

function Skills() {
    const [newSkill, setNewSkill] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [skills, setSkills] = useState([
        {
            id: 1,
            name: "React",
            progress: 20
        },
        {
            id: 2,
            name: "Node",
            progress: 40
        },
        {
            id: 3,
            name: "Gen AI",
            progress: 10
        }
    ]);

    function handleProgress(skillId) {
        setSkills(prevSkills => prevSkills.map(skill => {
            if (skill.id === skillId) {
                return {...skill, progress: Math.min(skill.progress + 10, 100)};
            }
            return skill;
        }));
    }

    function deleteSkill(skillId) {
        setSkills(prevSkills => prevSkills.filter(skill => skill.id !== skillId));
    }

    function addSkill() {
        if (newSkill.trim() === "") {
            setErrorMsg("Skill cannot be empty.");
            return;
        }
        setErrorMsg("");
        setSkills(prevSkills => [...prevSkills, {
            id: Date.now(),
            name: newSkill.trim(),
            progress: 0
        }]);
        setNewSkill("");
    }
    return (
        <>
        <input type="text" placeholder="Add Skill" value={newSkill} onChange={(e) => { setNewSkill(e.target.value); setErrorMsg(""); }} />
        {errorMsg && <p>{errorMsg}</p>}
        <button onClick={addSkill}>Add Skill</button>
            {skills.map((skill) => (
                <GoalCard
                    key={skill.id}
                    id={skill.id}
                    title={skill.name}
                    progress={skill.progress}
                    onProgress={handleProgress}
                    onDelete={deleteSkill}
                />
            ))}
        </>
    );   

}

export default Skills;