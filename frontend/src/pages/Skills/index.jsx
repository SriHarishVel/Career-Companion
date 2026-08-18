import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/ConfirmModal";
import SkillCard from "./components/SkillCard";
import SkillFilters from "./components/SkillFilters";
import SkillForm from "./components/SkillForm";
import { journeyService } from "../../services/journeyService";
import { getGoals } from "../../services/goalService";
import {
  createResource,
  updateResource,
  getResources,
} from "../../services/resourceService";
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../../services/skillService";
import LoadingState from "../../components/LoadingState";
import "./index.css";

function Skills() {
  const navigate = useNavigate();
  const location = useLocation();

  const journeyAction = location.state?.action;
  const journeyTitle = location.state?.title;
  const journeyDescription = location.state?.description;

  const isGuidedSetup = journeyAction === "createSkill";

  const [newSkill, setNewSkill] = useState("");
  const [newCategory, setNewCategory] = useState("Programming");

  const [secondaryGoalId, setSecondaryGoalId] = useState("");

  const [newResource, setNewResource] = useState("");
  const [resourceId, setResourceId] = useState(null);

  const [searchSkill, setSearchSkill] = useState("");
  const [sortOption, setSortOption] = useState("default");

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");

  const [skills, setSkills] = useState([]);
  const [goals, setGoals] = useState([]);

  const [editingSkillId, setEditingSkillId] = useState(null);
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const skillFormRef = useRef(null);

  useEffect(() => {
    async function fetchSkills() {
      try {
        setLoading(true);

        const [skills, goals] = await Promise.all([
          getSkills({
            search: searchSkill,

            category: categoryFilter === "All" ? undefined : categoryFilter,

            level: levelFilter === "All" ? undefined : levelFilter,

            sort: sortOption === "default" ? undefined : sortOption,
          }),

          getGoals(),
        ]);

        setSkills(skills);
        setGoals(goals);
      } catch (error) {
        console.error("Failed to load skills:", error);

        setErrorMsg("Unable to load your skills. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, [searchSkill, categoryFilter, levelFilter, sortOption]);

  async function handleProgress(skillId) {
    try {
      const skill = skills.find((skill) => skill._id === skillId);

      if (!skill) {
        return;
      }

      const newProgress = Math.min(skill.progress + 10, 100);

      let newLevel = "Beginner";

      if (newProgress >= 80) {
        newLevel = "Advanced";
      } else if (newProgress >= 40) {
        newLevel = "Intermediate";
      }

      await updateSkill(skillId, {
        progress: newProgress,
        level: newLevel,
      });

      const updatedSkills = await getSkills();

      setSkills(updatedSkills);
    } catch (error) {
      console.error(error);
    }
  }

  async function goToNextStep() {
    const nextStep = await journeyService.getNextStep();

    navigate(nextStep.page, {
      state: {
        fromJourney: true,
        action: nextStep.action,
        title: nextStep.title,
        description: nextStep.description,
      },
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
          secondaryGoal: secondaryGoalId || null,
        });

        if (newResource.trim()) {
          if (resourceId) {
            await updateResource(resourceId, {
              title: `${newSkill.trim()} Resource`,
              url: newResource.trim(),
              skill: editingSkillId,
            });
          } else {
            await createResource({
              title: `${newSkill.trim()} Resource`,
              type: "Article",
              url: newResource.trim(),
              skill: editingSkillId,
            });
          }
        } else if (resourceId) {
          await updateResource(resourceId, {
            title: `${newSkill.trim()} Resource`,
            url: "",
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
        secondaryGoal: secondaryGoalId || null,
      });

      if (newResource.trim()) {
        await createResource({
          title: `${newSkill.trim()} Resource`,
          type: "Article",
          url: newResource.trim(),
          skill: createdSkill._id,
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
    const skill = skills.find((skill) => skill._id === skillId);

    if (!skill) {
      return;
    }

    setEditingSkillId(skill._id);

    setNewSkill(skill.name);
    setNewCategory(skill.category);
    setSecondaryGoalId(skill.secondaryGoal?._id || "");

    setErrorMsg("");

    const resources = await getResources();

    const resource = resources.find(
      (resource) => resource.skill && resource.skill._id.toString() === skillId,
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
      block: "start",
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

  const secondaryGoalOptions = goals.filter(
    (goal) => goal.goalType === "Secondary",
  );

  if (loading) {
    return (
      <div className="container">
        <h1>Skills</h1>

        <LoadingState message="Loading your skills..." />
      </div>
    );
  }

  return (
    <div className="container">
      {/* Page name */}
      <h1>{isGuidedSetup ? journeyTitle : "Skills"}</h1>

      {isGuidedSetup && <p className="journey-message">{journeyDescription}</p>}

      {/* Skill Filters */}
      <SkillFilters
        searchSkill={searchSkill}
        setSearchSkill={setSearchSkill}
        sortOption={sortOption}
        setSortOption={setSortOption}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        levelFilter={levelFilter}
        setLevelFilter={setLevelFilter}
        skillCount={skills.length}
      />

      {/* Add Skill SkillCard */}
      <SkillForm
        editingSkillId={editingSkillId}
        newSkill={newSkill}
        setNewSkill={(value) => {
          setNewSkill(value);
          setErrorMsg("");
        }}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        secondaryGoalId={secondaryGoalId}
        setSecondaryGoalId={setSecondaryGoalId}
        secondaryGoalOptions={secondaryGoalOptions}
        newResource={newResource}
        setNewResource={setNewResource}
        errorMsg={errorMsg}
        addSkill={addSkill}
        handleCancelEdit={handleCancelEdit}
        skillFormRef={skillFormRef}
      />

      {/* Skills Grid */}
      <div className="skills-grid">
        {skills.length > 0 ? (
          skills.map((skill) => (
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
                  state: { skillId },
                })
              }
            />
          ))
        ) : (
          <div className="empty-state">
            <h3>No skills found</h3>

            <p>Add a skill or adjust your filters.</p>
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
