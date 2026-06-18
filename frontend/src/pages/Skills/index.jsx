import { useState, useEffect } from "react";
import Card from "../../components/Card";
import initialSkills from "../../data/skills";
import SearchSortBar from "../../components/SearchSortBar";
import "./index.css";

function Skills() {
    const [newSkill, setNewSkill] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [searchSkill, setSearchSkill] = useState("");
    const [sortOption, setSortOption] = useState("default");

    const [skills, setSkills] = useState(() => {
        // Use saved skills when available, otherwise start with sample skills.
        const savedSkills = localStorage.getItem("skills");

        if (savedSkills) {
            return JSON.parse(savedSkills);
        }

        return initialSkills;
    });

    useEffect(() => {
        // Save skill changes so progress is not lost on refresh.
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
                title: newSkill.trim(),
                progress: 0,
                lastUpdated: Date.now()
            }
        ]);

        setNewSkill("");
    }

    function editSkill(skillId, updatedTitle) {
        if (updatedTitle.trim() === "") {
            return;
        }

        setSkills(prevSkills =>
            prevSkills.map(skill => {
                if (skill.id === skillId) {
                    return {
                        ...skill,
                        title: updatedTitle.trim(),
                        lastUpdated: Date.now()
                    };
                }

                return skill;
            })
        );
    }

    // Apply search and sorting before rendering the skill cards.
    const filteredSkills = [...skills]
        .filter(skill =>
            skill.title
                .toLowerCase()
                .includes(
                    searchSkill.toLowerCase()
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
        <div classtitle="container">
            {/* Search and sort controls */}
            <SearchSortBar
                searchValue={searchSkill}
                onSearchChange={
                    setSearchSkill
                }
                sortValue={sortOption}
                onSortChange={
                    setSortOption
                }
                searchPlaceholder="Search Skills"
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
            </SearchSortBar>

            {/* New skill form */}
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

            {/* Skill cards */}
            {filteredSkills.map(skill => (
                <Card
                    key={skill.id}
                    id={skill.id}
                    title={skill.title}
                    progress={
                        skill.progress
                    }
                    onProgress={
                        handleProgress
                    }
                    onDelete={
                        deleteSkill
                    }
                    onEdit={ 
                        editSkill
                    }
                />
            ))}
        </div>
    );
}

export default Skills;
