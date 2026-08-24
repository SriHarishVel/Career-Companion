import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ConfirmModal from "../../components/ConfirmModal";
import FormDialog from "../../components/FormDialog";
import LoadingState from "../../components/LoadingState";

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

  /*
   * Guided setup opens the dialog immediately.
   * Normal Skills page starts with it closed.
   */
  const [showSkillForm, setShowSkillForm] = useState(isGuidedSetup);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  /*
   * Load skills and goals.
   */
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

      const newProgress = Math.min(Number(skill.progress || 0) + 10, 100);

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
      console.error("Failed to update skill progress:", error);
    }
  }

  function goToNextStep() {
    const nextStep = journeyService.getNextStep();

    navigate(nextStep.page, {
      state: {
        fromJourney: true,
        action: nextStep.action,
        title: nextStep.title,
        description: nextStep.description,
      },
    });
  }

  function openAddSkill() {
    setEditingSkillId(null);

    setNewSkill("");
    setNewCategory("Programming");
    setSecondaryGoalId("");
    setNewResource("");

    setResourceId(null);
    setErrorMsg("");

    setShowSkillForm(true);
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
        }

        const updatedSkills = await getSkills();

        setSkills(updatedSkills);

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

      const updatedSkills = await getSkills();

      setSkills(updatedSkills);

      setNewSkill("");
      setNewCategory("Programming");
      setSecondaryGoalId("");
      setNewResource("");
      setResourceId(null);
      setErrorMsg("");

      setShowSkillForm(false);

      if (journeyAction === "createSkill") {
        goToNextStep();
      }
    } catch (error) {
      console.error("Failed to save skill:", error);

      setErrorMsg(
        error.response?.data?.message ||
          "Unable to save the skill. Please try again.",
      );
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

    try {
      const resources = await getResources();

      const resource = resources.find(
        (resource) =>
          resource.skill && resource.skill._id.toString() === skillId,
      );

      if (resource) {
        setResourceId(resource._id);
        setNewResource(resource.url);
      } else {
        setResourceId(null);
        setNewResource("");
      }
    } catch (error) {
      console.error("Failed to load skill resource:", error);

      setResourceId(null);
      setNewResource("");
    }

    setShowSkillForm(true);
  }

  function handleCancelEdit() {
    setEditingSkillId(null);

    setNewSkill("");
    setNewCategory("Programming");
    setSecondaryGoalId("");
    setNewResource("");

    setErrorMsg("");
    setResourceId(null);

    setShowSkillForm(false);
  }

  async function confirmDeleteSkill() {
    try {
      await deleteSkill(selectedSkillId);

      const updatedSkills = await getSkills();

      setSkills(updatedSkills);
    } catch (error) {
      console.error("Failed to delete skill:", error);
    }

    setShowDeleteModal(false);
    setSelectedSkillId(null);
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
      <div className="page-header">
        <h1>{isGuidedSetup ? journeyTitle : "Skills"}</h1>

        {!isGuidedSetup && (
          <button
            type="button"
            className="add-skill-btn"
            onClick={openAddSkill}
          >
            + Add Skill
          </button>
        )}
      </div>

      {isGuidedSetup && <p className="journey-message">{journeyDescription}</p>}

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

      <FormDialog
        isOpen={showSkillForm}
        title={editingSkillId ? "Edit Skill" : "Add a Skill"}
        onClose={handleCancelEdit}
        footer={
          <>
            <button
              type="button"
              className="form-dialog-cancel"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>

            <button
              type="button"
              className="form-dialog-submit"
              onClick={addSkill}
            >
              {editingSkillId ? "Update Skill" : "Add Skill"}
            </button>
          </>
        }
      >
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
        />
      </FormDialog>

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
      </div>

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
  );
}

export default Skills;
