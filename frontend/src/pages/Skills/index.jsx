import {useState, useEffect} from "react";
import GoalCard from "../../components/GoalCard";
import initialSkills from "../../data/skills";
import "./index.css"

function Skills() {
    const [newSkill, setNewSkill] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [skills, setSkills] = useState(() => {
        const savedSkills = localStorage.getItem("skills");

        if (savedSkills) {
            return JSON.parse(savedSkills);
        }

        return initialSkills;
    });

    useEffect(() =>{
        localStorage.setItem("skills",JSON.stringify(skills));
    }, [skills]);

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
        <div className="container">
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
        </div>
    );   

}

export default Skills;