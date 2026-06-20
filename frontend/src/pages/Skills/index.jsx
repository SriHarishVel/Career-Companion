import { useState, useEffect } from "react";
import Card from "../../components/Card";
import initialSkills from "../../data/skills";
import SearchSortBar from "../../components/SearchSortBar";
import ConfirmModal from "../../components/ConfirmModal";
import "./index.css";

function Skills() {
    const [newSkill, setNewSkill] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [searchSkill, setSearchSkill] = useState("");
    const [sortOption, setSortOption] = useState("default");
    const [newCategory, setNewCategory] = useState("Frontend");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [levelFilter, setLevelFilter] = useState("All");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSkillId, setSelectedSkillId] = useState(null);
    const [skills, setSkills] = useState(() => {
        // Load saved skills first so user changes stay after refresh.
        const savedSkills =
            localStorage.getItem("skills");

        if (savedSkills) {
            return JSON.parse(savedSkills);
        }

        return initialSkills;
    });

    useEffect(() => {
        // Keep localStorage in sync whenever the skills list changes.
        localStorage.setItem(
            "skills",
            JSON.stringify(skills)
        );
    }, [skills]);

    function handleProgress(skillId) {
        // Increase progress in small steps without going past 100%.
        setSkills(prevSkills =>
            prevSkills.map(skill => {
                const newProgress = Math.min( skill.progress + 10, 100 );

                let newLevel =
                    "Beginner";

                if (newProgress >= 80) {
                    newLevel = "Advanced";
                } else if (
                    newProgress >= 40
                ) {
                    newLevel =
                        "Intermediate";
                }
                if (skill.id === skillId) {
                    return {
                        ...skill,
                        progress: newProgress,
                        level: newLevel,
                        lastUpdated: Date.now()
                    };
                }

                return skill;
            })
        );
    }

    function confirmDeleteSkill() {
        setSkills(prevSkills =>
            prevSkills.filter(
                skill =>
                    skill.id !==
                    selectedSkillId
            )
        );

        setShowDeleteModal(false);
        setSelectedSkillId(null);
    }

    function addSkill() {
        // Stop empty skills from being added to the tracker.
        if (newSkill.trim() === "") {
            setErrorMsg(
                "Skill cannot be empty."
            );
            return;
        }

        setErrorMsg("");

        // Add the new skill with a default level and starting progress.
        setSkills(prevSkills => [
            ...prevSkills,
            {
                id: Date.now(),
                title: newSkill.trim(),
                category: newCategory,
                level: "Beginner",
                progress: 0,
                lastUpdated: Date.now()
            }
        ]);

        setNewSkill("");
        setNewCategory("Frontend");
    }

    function editSkill(
        skillId,
        updatedTitle
    ) {
        // Ignore blank edits so existing skill names are not erased.
        if (
            updatedTitle.trim() === ""
        ) {
            return;
        }

        setSkills(prevSkills =>
            prevSkills.map(skill => {
                if (
                    skill.id === skillId
                ) {
                    return {
                        ...skill,
                        title:
                            updatedTitle.trim(),
                        lastUpdated:
                            Date.now()
                    };
                }

                return skill;
            })
        );
    }

    // Build the visible list from the current search, category, and sort choices.
    const filteredSkills = [...skills]
        .filter(skill =>
            skill.title
                .toLowerCase()
                .includes(
                    searchSkill.toLowerCase()
                )
        )
        .filter(skill =>
            categoryFilter ===
            "All" ? true
                : skill.category ===
                  categoryFilter
        )
        .filter(skill =>
            levelFilter === "All"
                ? true
                : skill.level ===
                levelFilter
        )
        .sort((a, b) => {
            if (
                sortOption === "az"
            ) {
                return a.title.localeCompare(
                    b.title
                );
            }

            if (
                sortOption === "za"
            ) {
                return b.title.localeCompare(
                    a.title
                );
            }

            if (
                sortOption ===
                "high"
            ) {
                return (
                    b.progress -
                    a.progress
                );
            }

            if (
                sortOption ===
                "low"
            ) {
                return (
                    a.progress -
                    b.progress
                );
            }

            if (
                sortOption ===
                "recent"
            ) {
                return (
                    b.lastUpdated -
                    a.lastUpdated
                );
            }

            return 0;
        });

    return (
        <div className="container">

            {/* Page Title */}
            <h1>Skills</h1>

            {/* Filters Card */}
            <div className="filters-card">

                <h3>Filters</h3>

                <SearchSortBar
                    searchValue={
                        searchSkill
                    }
                    onSearchChange={
                        setSearchSkill
                    }
                    sortValue={
                        sortOption
                    }
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

                <div className="filter-group">

                    <label>
                        Category
                    </label>

                    <select
                        value={
                            categoryFilter
                        }
                        onChange={(e) =>
                            setCategoryFilter(
                                e.target.value
                            )
                        }
                    >
                        <option value="All">
                            All Categories
                        </option>

                        <option value="Frontend">
                            Frontend
                        </option>

                        <option value="Backend">
                            Backend
                        </option>

                        <option value="Database">
                            Database
                        </option>

                        <option value="AI">
                            AI
                        </option>

                        <option value="Tools">
                            Tools
                        </option>
                    </select>

                    <label>Levels</label>

                    <select
                        value={
                            levelFilter
                        }
                        onChange={(e) =>
                            setLevelFilter(e.target.value)
                        }
                    >
                        <option value="All">
                            All Levels
                        </option>

                        <option value="Beginner">
                            Beginner
                        </option>

                        <option value="Intermediate">
                            Intermediate
                        </option>

                        <option value="Advanced">
                            Advanced
                        </option>
                    </select>

                </div>

                <p className="skill-counter">
                    Showing {filteredSkills.length} of {skills.length} skills
                </p>

            </div>

            {/* Add Skill Card */}
            <div className="add-skill-card">

                <h3>Add Skill</h3>

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

                <select
                    value={
                        newCategory
                    }
                    onChange={(e) =>
                        setNewCategory(
                            e.target.value
                        )
                    }
                >
                    <option value="Frontend">
                        Frontend
                    </option>

                    <option value="Backend">
                        Backend
                    </option>

                    <option value="Database">
                        Database
                    </option>

                    <option value="AI">
                        AI
                    </option>

                    <option value="Tools">
                        Tools
                    </option>
                </select> 

                {errorMsg && (
                    <p className="error">
                        {errorMsg}
                    </p>
                )}

                <button
                    onClick={
                        addSkill
                    }
                >
                    Add Skill
                </button>

            </div>

            {/* Skills Grid */}
            <div className="skills-grid">

                {filteredSkills.length > 0 ? (
                    filteredSkills.map(skill => (
                        <Card
                            key={skill.id}
                            id={skill.id}
                            title={skill.title}
                            progress={skill.progress}
                            category={skill.category}
                            level={skill.level}
                            onProgress={handleProgress}
                            onDelete={(skillId) => {
                                setSelectedSkillId(skillId);
                                setShowDeleteModal(true);
                            }}
                            onEdit={editSkill}
                        />
                    ))
                ) : (
                    <div className="empty-state">
                        <h3>No skills found</h3>

                        <p>
                            Add a skill or adjust
                            your filters.
                        </p>
                    </div>
                )}

                <ConfirmModal
                    isOpen={showDeleteModal}
                    title="Delete Skill"
                    message="Are you sure you want to delete this skill?"
                    onConfirm={confirmDeleteSkill}
                    onCancel={() => {
                        setShowDeleteModal(false);
                        setSelectedSkillId(null);
                    }}
                />
            </div>

        </div>
    );
}

export default Skills;
