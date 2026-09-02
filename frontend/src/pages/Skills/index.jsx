import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import LoadingState from "../../components/LoadingState";

import SkillCard from "./components/SkillCard";
import SkillFilters from "./components/SkillFilters";
import SkillForm from "./components/SkillForm";

import { journeyService } from "../../services/journeyService";
import { getGoals } from "../../services/goalService";

import { createResource } from "../../services/resourceService";

import { getSkills, createSkill } from "../../services/skillService";

import "./index.css";

function Skills() {
  const navigate = useNavigate();
  const location = useLocation();

  const journeyAction = location.state?.action;
  const journeyTitle = location.state?.title;
  const journeyDescription = location.state?.description;

  const isGuidedSetup = journeyAction === "createSkill";

  /* FORM STATE */

  const [newSkill, setNewSkill] = useState("");
  const [newCategory, setNewCategory] = useState("Programming");
  const [secondaryGoalId, setSecondaryGoalId] = useState("");
  const [newResource, setNewResource] = useState("");

  const [learningAreas, setLearningAreas] = useState([]);
  const [practicalRequirements, setPracticalRequirements] = useState([]);

  /* FILTER STATE */

  const [searchSkill, setSearchSkill] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");

  /* DATA */

  const [skills, setSkills] = useState([]);
  const [goals, setGoals] = useState([]);

  /* FORM */

  const [showSkillForm, setShowSkillForm] = useState(isGuidedSetup);

  /* REQUEST STATE */

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  /* LOAD SKILLS */

  useEffect(() => {
    async function fetchSkills() {
      try {
        setLoading(true);
        setErrorMsg("");

        const skillData = await getSkills({
          search: searchSkill,
          category: categoryFilter === "All" ? undefined : categoryFilter,
          level: levelFilter === "All" ? undefined : levelFilter,
          sort: sortOption === "default" ? undefined : sortOption,
        });

        setSkills(skillData);
      } catch (error) {
        console.error("Failed to load skills:", error);

        setErrorMsg(
          error.response?.data?.message ||
            "Unable to load your skills. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, [searchSkill, categoryFilter, levelFilter, sortOption]);

  /* LOAD GOALS */

  useEffect(() => {
    async function fetchGoals() {
      try {
        const goalData = await getGoals();

        setGoals(goalData);
      } catch (error) {
        console.error("Failed to load goals:", error);

        setErrorMsg(
          error.response?.data?.message ||
            "Unable to load your goals. Please try again.",
        );
      }
    }

    fetchGoals();
  }, []);

  /* REFRESH SKILLS */

  async function refreshSkills() {
    const updatedSkills = await getSkills({
      search: searchSkill,
      category: categoryFilter === "All" ? undefined : categoryFilter,
      level: levelFilter === "All" ? undefined : levelFilter,
      sort: sortOption === "default" ? undefined : sortOption,
    });

    setSkills(updatedSkills);
  }

  /* JOURNEY */

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

  /* OPEN ADD FORM */

  function openAddSkill() {
    setNewSkill("");
    setNewCategory("Programming");
    setSecondaryGoalId("");
    setNewResource("");

    setLearningAreas([]);
    setPracticalRequirements([]);

    setErrorMsg("");
    setShowSkillForm(true);
  }

  /* ADD SKILL */

  async function addSkill() {
    if (saving) {
      return;
    }

    if (newSkill.trim() === "") {
      setErrorMsg("Skill cannot be empty.");
      return;
    }

    setErrorMsg("");
    setSaving(true);

    try {
      const createdSkill = await createSkill({
        name: newSkill.trim(),
        category: newCategory,
        level: "Beginner",
        learningAreas,
        practicalRequirements,
        secondaryGoal: secondaryGoalId || null,
      });

      /* OPTIONAL RESOURCE */

      if (newResource.trim()) {
        await createResource({
          title: `${newSkill.trim()} Resource`,
          type: "Article",
          url: newResource.trim(),
          skill: createdSkill._id,
        });
      }

      await refreshSkills();

      setNewSkill("");
      setNewCategory("Programming");
      setSecondaryGoalId("");
      setNewResource("");

      setLearningAreas([]);
      setPracticalRequirements([]);

      setErrorMsg("");
      setShowSkillForm(false);

      if (journeyAction === "createSkill") {
        goToNextStep();
      }
    } catch (error) {
      console.error("Failed to create skill:", error);

      setErrorMsg(
        error.response?.data?.message ||
          "Unable to create the skill. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  const secondaryGoalOptions = goals.filter(
    (goal) => goal.goalType === "Secondary",
  );

  /* LOADING */

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

      {errorMsg && (
        <div className="skill-error-message" role="alert">
          {errorMsg}
        </div>
      )}

      <SkillFilters
        searchSkill={searchSkill}
        setSearchSkill={setSearchSkill}
        sortOption={sortOption}
        setSortOption={setSortOption}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        levelFilter={levelFilter}
        setLevelFilter={setLevelFilter}
      />

      <SkillForm
        isOpen={showSkillForm}
        onClose={() => {
          setShowSkillForm(false);
          setErrorMsg("");
        }}
        title="Add Skill"
        onSubmit={addSkill}
        submitLabel="Add Skill"
        newSkill={newSkill}
        setNewSkill={setNewSkill}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        secondaryGoalId={secondaryGoalId}
        setSecondaryGoalId={setSecondaryGoalId}
        secondaryGoalOptions={secondaryGoalOptions}
        newResource={newResource}
        setNewResource={setNewResource}
        learningAreas={learningAreas}
        setLearningAreas={setLearningAreas}
        practicalRequirements={practicalRequirements}
        setPracticalRequirements={setPracticalRequirements}
        errorMsg={errorMsg}
        saving={saving}
      />

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
            />
          ))
        ) : (
          <div className="empty-state">
            <h3>No skills found</h3>

            <p>Add a skill or adjust your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Skills;
