import { useState, useEffect } from "react";
import GoalCard from "../../components/GoalCard";
import initialSkills from "../../data/skills";
import "./index.css";

function Skills() {
    const [newSkill, setNewSkill] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [searchSkill, setSearchSkill] = useState("");
    const [sortOption, setSortOption] = useState("default");

    const [skills, setSkills] = useState(() => {
        const savedSkills = localStorage.getItem("skills");

        if (savedSkills) {
            return JSON.parse(savedSkills);
        }

        return initialSkills;
    });

    useEffect(() => {
        localStorage.setItem(
            "skills",
            JSON.stringify(skills)
        );
    }, [skills]);

    function handleProgress(skillId) {
        setSkills(prevSkills =>
            prevSkills.map(skill => {
                if (skill.id === skillId) {
                    return {
                        ...skill,
                        progress: Math.min(
                            skill.progress + 10,
                            100
                        ),
                        lastUpdated: Date.now()
                    };
                }

                return skill;
            })
        );
    }

    function deleteSkill(skillId) {
        setSkills(prevSkills =>
            prevSkills.filter(
                skill => skill.id !== skillId
            )
        );
    }

    function addSkill() {
        if (newSkill.trim() === "") {
            setErrorMsg(
                "Skill cannot be empty."
            );
            return;
        }

        setErrorMsg("");

        setSkills(prevSkills => [
            ...prevSkills,
            {
                id: Date.now(),
                name: newSkill.trim(),
                progress: 0,
                lastUpdated: Date.now()
            }
        ]);

        setNewSkill("");
    }

    const filteredSkills = [...skills]
        .filter(skill =>
            skill.name
                .toLowerCase()
                .includes(
                    searchSkill.toLowerCase()
                )
        )
        .sort((a, b) => {
            if (sortOption === "az") {
                return a.name.localeCompare(
                    b.name
                );
            }

            if (sortOption === "za") {
                return b.name.localeCompare(
                    a.name
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
                type="text"
                placeholder="Search Skills"
                value={searchSkill}
                onChange={(e) =>
                    setSearchSkill(
                        e.target.value
                    )
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
                placeholder="Add Skill"
                value={newSkill}
                onChange={(e) => {
                    setNewSkill(
                        e.target.value
                    );
                    setErrorMsg("");
                }}
            />

            {errorMsg && (
                <p>{errorMsg}</p>
            )}

            <button onClick={addSkill}>
                Add Skill
            </button>

            {filteredSkills.map(skill => (
                <GoalCard
                    key={skill.id}
                    id={skill.id}
                    title={skill.name}
                    progress={
                        skill.progress
                    }
                    onProgress={
                        handleProgress
                    }
                    onDelete={
                        deleteSkill
                    }
                />
            ))}
        </div>
    );
}

export default Skills;