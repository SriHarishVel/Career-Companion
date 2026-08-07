import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SkillCard from "../../components/SkillCard";
import SearchSortBar from "../../components/SearchSortBar";
import ConfirmModal from "../../components/ConfirmModal";
import { journeyService } from "../../services/journeyService";
import { getGoals } from "../../services/goalService";
import { 
    createResource, 
    updateResource,
    getResources
} from "../../services/resourceService";
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
    const [editingSkillId, setEditingSkillId] = useState(null);
    const [newResource, setNewResource] = useState("");
    const [resourceId, setResourceId] = useState(null);

    const skillFormRef = useRef(null);

    useEffect(() => {

        async function fetchSkills() {

            try {

                const [skills, goals] = await Promise.all([
                    getSkills({
                        search: searchSkill,
                        category:
                            categoryFilter === "All"
                                ? undefined
                                : categoryFilter,
                        level:
                            levelFilter === "All"
                                ? undefined
                                : levelFilter,
                        sort:
                            sortOption === "default"
                                ? undefined
                                : sortOption,
                    }),
                    getGoals(),
                ]);

                setSkills(skills);
                setGoals(goals);

            } catch (error) {

                console.error(error);

            }

        }

        fetchSkills();

    }, [
        searchSkill,
        categoryFilter,
        levelFilter,
        sortOption,
    ]);
      

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

            if (editingSkillId) {

                await updateSkill(editingSkillId, {
                    name: newSkill.trim(),
                    category: newCategory,
                    secondaryGoal: secondaryGoalId || null
                });

                if (newResource.trim()) {

                    if (resourceId) {

                        await updateResource(resourceId, {
                            title: `${newSkill.trim()} Resource`,
                            url: newResource.trim(),
                            skill: editingSkillId
                        });

                    } else {

                        await createResource({
                            title: `${newSkill.trim()} Resource`,
                            type: "Article",
                            url: newResource.trim(),
                            skill: editingSkillId
                        });

                    }

                } else if (resourceId) {

                    await updateResource(resourceId, {
                        title: `${newSkill.trim()} Resource`,
                        url: ""
                    });

                }

                const skills = await getSkills();

                setSkills(skills);

                handleCancelEdit();

                if (journeyAction === "createSkill") {
                    goToNextStep();
                }

                return;
            }

            const createdSkill = await createSkill({
                name: newSkill.trim(),
                category: newCategory,
                level: "Beginner",
                progress: 0,
                secondaryGoal: secondaryGoalId || null
            });

            if (newResource.trim()) {

                await createResource({
                    title: `${newSkill.trim()} Resource`,
                    type: "Article",
                    url: newResource.trim(),
                    skill: createdSkill._id
                });

            }

            const skills = await getSkills();

            setSkills(skills);

            if (journeyAction === "createSkill") {
                goToNextStep();
            }

            setNewSkill("");
            setNewCategory("Programming");
            setSecondaryGoalId("");
            setErrorMsg("");
            setNewResource("");

        } catch (error) {
            console.error(error);
        }
    }
    
    async function handleEditSkill(skillId) {

        const skill = skills.find(
            skill => skill._id === skillId
        );

        if (!skill) {
            return;
        }

        setEditingSkillId(skill._id);

        setNewSkill(skill.name);
        setNewCategory(skill.category);
        setSecondaryGoalId(
            skill.secondaryGoal?._id || ""
        );

        setErrorMsg("");

        const resources = await getResources();

        const resource = resources.find(
            resource =>
                resource.skill &&
                resource.skill._id.toString() === skillId
        );

        if (resource) {

            setResourceId(resource._id);
            setNewResource(resource.url);

        } else {

            setResourceId(null);
            setNewResource("");

        }

        skillFormRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

    function handleCancelEdit() {

        setEditingSkillId(null);
        setNewSkill("");
        setNewCategory("Programming");
        setSecondaryGoalId("");
        setNewResource("");
        setErrorMsg("");
        setResourceId(null);
        setNewResource("");

    }
    
    const secondaryGoalOptions =
        goals.filter(
            goal =>
                goal.goalType ===
                "Secondary"
        );

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

                    <option value="progressHigh">
                        Highest Progress
                    </option>

                    <option value="progressLow">
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
                    Showing {skills.length} skills
                </p>

            </div>

            {/* Add Skill SkillCard */}
            <div className="add-skill-SkillCard" ref={skillFormRef}>

                <h3>
                    {editingSkillId
                        ? "Edit Skill"
                        : "Add Skill"}
                </h3>

                <input
                    type="text"
                    placeholder={
                        editingSkillId
                            ? "Edit Skill"
                            : "Add Skill"
                    }
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
                
                <input
                    type="url"
                    placeholder="Learning Resource URL (Optional)"
                    value={newResource}
                    onChange={(e) =>
                        setNewResource(e.target.value)
                    }
                />

                <button
                    onClick={addSkill}
                >
                    {editingSkillId
                        ? "Update Skill"
                        : "Add Skill"}
                </button>

                {editingSkillId && (
                    <button
                        className="cancel-btn"
                        onClick={handleCancelEdit}
                    >
                        Cancel Edit
                    </button>
                )}

            </div>

            {/* Skills Grid */}
            <div className="skills-grid">

                {skills.length > 0 ? (
                    skills.map(skill => (
                        <SkillCard
                            key={skill._id}
                            id={skill._id}
                            name={skill.name}
                            progress={skill.progress}
                            category={skill.category}
                            level={skill.level}
                            relatedGoalTitle={skill.secondaryGoal?.title}
                            onProgress={handleProgress}
                            onDelete={(skillId) => {
                                setSelectedSkillId(skillId);
                                setShowDeleteModal(true);
                            }}
                            onEdit={handleEditSkill}
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
