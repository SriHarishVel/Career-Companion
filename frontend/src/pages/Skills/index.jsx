import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SkillCard from "../../components/SkillCard";
import SearchSortBar from "../../components/SearchSortBar";
import ConfirmModal from "../../components/ConfirmModal";
import { journeyService } from "../../services/journeyService";
import { getGoals } from "../../services/goalService";
import {
    getSkills,
    createSkill,
    updateSkill,
    deleteSkill
} from "../../services/skillService";
import "./index.css";

function Skills() {
    const navigate = useNavigate();
    const location = useLocation();
    const journeyAction = location.state?.action;
    const journeyStep = journeyService.getNextStep();

    const [newSkill, setNewSkill] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [searchSkill, setSearchSkill] = useState("");
    const [sortOption, setSortOption] = useState("default");
    const [newCategory, setNewCategory] = useState("Programming");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [levelFilter, setLevelFilter] = useState("All");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSkillId, setSelectedSkillId] = useState(null);
    const [secondaryGoalId,setSecondaryGoalId] = useState("");
    const [skills, setSkills] = useState([]);
    const [goals, setGoals] = useState([]);

    useEffect(() => {

        async function fetchSkills() {

            try {
                const [skills, goals] = await Promise.all([
                    getSkills(),
                    getGoals()
                ]);

                setSkills(skills);
                setGoals(goals);
            } catch (error) {
                console.error(error);
            }

        }

        fetchSkills();

    }, []);
      

    async function handleProgress(skillId) {

        try {

            const skill = skills.find(
                skill => skill._id === skillId
            );

            if (!skill) {
                return;
            }

            const newProgress = Math.min(
                skill.progress + 10,
                100
            );

            let newLevel = "Beginner";

            if (newProgress >= 80) {
                newLevel = "Advanced";
            } else if (newProgress >= 40) {
                newLevel = "Intermediate";
            }

            await updateSkill(skillId, {
                progress: newProgress,
                level: newLevel
            });

            const updatedSkills = await getSkills();

            setSkills(updatedSkills);

        } catch (error) {
            console.error(error);
        }

    }

    function goToNextStep() {

        const nextStep =
            journeyService.getNextStep();

        navigate(nextStep.page, {
            state: {
                fromJourney: true,
                action: nextStep.action
            }
        });

}

    async function confirmDeleteSkill() {

        try {
            await deleteSkill(selectedSkillId);
            const skills = await getSkills();
            setSkills(skills);
        } catch (error) {
            console.error(error);
        }

        setShowDeleteModal(false);
        setSelectedSkillId(null);
    }

    async function addSkill() {
        if (newSkill.trim() === "") {
            setErrorMsg("Skill cannot be empty.");
            return;
        }

        setErrorMsg("");

        try {

            await createSkill({
                name: newSkill.trim(),
                category: newCategory,
                level: "Beginner",
                progress: 0,
                secondaryGoal: secondaryGoalId || null
            });

            const skills = await getSkills();

            setSkills(skills);

            if (journeyAction === "createSkill") {
                goToNextStep();
            }

            setNewSkill("");
            setNewCategory("Programming");
            setSecondaryGoalId("");

        } catch (error) {
            console.error(error);
        }
    }

    async function editSkill(
        skillId,
        updatedName
    ) {
        if (
            updatedName.trim() === ""
        ) {
            return;
        }

        try {

            await updateSkill(skillId, {
                name: updatedName.trim()
            });

            const skills = await getSkills();

            setSkills(skills);

        } catch (error) {
            console.error(error);
        }
    }
    
    // Build the visible list from the current search, category, and sort choices.
    const filteredSkills = [...skills]
        .filter(skill =>
            skill.name
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
                return a.name.localeCompare(
                    b.name
                );
            }

            if (
                sortOption === "za"
            ) {
                return b.name.localeCompare(
                    a.name
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
                    new Date(b.updatedAt) -
                    new Date(a.updatedAt)
                );
            }

            return 0;
        });
    
    const secondaryGoalOptions =
        goals.filter(
            goal =>
                goal.goalType ===
                "Secondary"
        );
    
    function getGoalTitle(goalId) {
        const goal = goals.find(
            goal => goal._id === goalId
        );

        return goal
            ? goal.title
            : null;
    }

    return (
        <div className="container">

            {/* Page name */}
            <h1>
                {journeyAction
                    ? journeyStep.title
                    : "Skills"}
            </h1>

            {journeyAction && (
                <p className="journey-message">
                    {journeyStep.description}
                </p>
            )}

            {/* Filters SkillCard */}
            <div className="filters-SkillCard">

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
                        <option value="All">All Categories</option>
                        <option value="Programming">Programming</option>
                        <option value="Database">Database</option>
                        <option value="Framework">Framework</option>
                        <option value="Tools">Tools</option>
                        <option value="Soft Skills">Soft Skills</option>
                        <option value="Other">Other</option>
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

            {/* Add Skill SkillCard */}
            <div className="add-skill-SkillCard">

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
                    <option value="Programming">Programming</option>
                    <option value="Database">Database</option>
                    <option value="Framework">Framework</option>
                    <option value="Tools">Tools</option>
                    <option value="Soft Skills">Soft Skills</option>
                    <option value="Other">Other</option>
                </select> 

                {errorMsg && (
                    <p className="error">
                        {errorMsg}
                    </p>
                )}

                <select
                    value={secondaryGoalId}
                    onChange={(e) =>
                        setSecondaryGoalId(
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        Related Goal (Optional)
                    </option>

                    {secondaryGoalOptions.map(
                        goal => (
                            <option
                                key={goal._id}
                                value={goal._id}
                            >
                                {goal.title}
                            </option>
                        )
                    )}
                </select>

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
                        <SkillCard
                            key={skill._id}
                            id={skill._id}
                            name={skill.name}
                            progress={skill.progress}
                            category={skill.category}
                            level={skill.level}
                            onProgress={handleProgress}
                            onDelete={(skillId) => {
                                setSelectedSkillId(skillId);
                                setShowDeleteModal(true);
                            }}
                            onEdit={editSkill}
                            onResources={(skillId) =>
                                navigate("/resources", {
                                    state: { skillId }
                                })
                            }
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
