import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import LoadingState from "../../components/LoadingState";
import useQueryParams from "../../hooks/useQueryParams";

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
  const queryClient = useQueryClient();

  const { getParam, setParams, clearParams } = useQueryParams();

  const journeyAction = location.state?.action;
  const journeyTitle = location.state?.title;
  const journeyDescription = location.state?.description;

  const isGuidedSetup = journeyAction === "createSkill";

  const urlSearch = getParam("search") || "";
  const urlSort = getParam("sort") || "default";
  const urlCategory = getParam("category") || "All";
  const urlLevel = getParam("level") || "All";

  const [searchSkill, setSearchSkill] = useState(urlSearch);
  const [sortOption, setSortOption] = useState(urlSort);
  const [categoryFilter, setCategoryFilter] = useState(urlCategory);
  const [levelFilter, setLevelFilter] = useState(urlLevel);

  const [newSkill, setNewSkill] = useState("");
  const [newCategory, setNewCategory] = useState("Programming");
  const [secondaryGoalId, setSecondaryGoalId] = useState("");
  const [newResource, setNewResource] = useState("");

  const [learningAreas, setLearningAreas] = useState([]);
  const [practicalRequirements, setPracticalRequirements] = useState([]);

  const [showSkillForm, setShowSkillForm] = useState(isGuidedSetup);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    data: skills = [],
    isLoading: skillsLoading,
    error: skillsError,
  } = useQuery({
    queryKey: [
      "skills",
      {
        search: urlSearch || undefined,
        category: urlCategory === "All" ? undefined : urlCategory,
        level: urlLevel === "All" ? undefined : urlLevel,
        sort: urlSort === "default" ? undefined : urlSort,
      },
    ],
    queryFn: () =>
      getSkills({
        search: urlSearch || undefined,
        category: urlCategory === "All" ? undefined : urlCategory,
        level: urlLevel === "All" ? undefined : urlLevel,
        sort: urlSort === "default" ? undefined : urlSort,
      }),
  });

  const { data: goals = [], error: goalsError } = useQuery({
    queryKey: ["goals", "all"],
    queryFn: () => getGoals(),
  });

  const createSkillMutation = useMutation({
    mutationFn: async () => {
      const createdSkill = await createSkill({
        name: newSkill.trim(),
        category: newCategory,
        level: "Beginner",
        learningAreas,
        practicalRequirements,
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

      return createdSkill;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["skills"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["resources"],
      });

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
    },

    onError: (error) => {
      console.error("Failed to create skill:", error);

      setErrorMsg(
        error.response?.data?.message ||
          "Unable to create the skill. Please try again.",
      );
    },
  });

  function applyFilters() {
    setParams({
      search: searchSkill || "",
      sort: sortOption === "default" ? "" : sortOption,
      category: categoryFilter === "All" ? "" : categoryFilter,
      level: levelFilter === "All" ? "" : levelFilter,
    });
  }

  function clearFilters() {
    setSearchSkill("");
    setSortOption("default");
    setCategoryFilter("All");
    setLevelFilter("All");

    clearParams(["search", "sort", "category", "level"]);
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
    setNewSkill("");
    setNewCategory("Programming");
    setSecondaryGoalId("");
    setNewResource("");

    setLearningAreas([]);
    setPracticalRequirements([]);

    setErrorMsg("");
    setShowSkillForm(true);
  }

  function addSkill() {
    if (createSkillMutation.isPending) {
      return;
    }

    if (!newSkill.trim()) {
      setErrorMsg("Skill cannot be empty.");
      return;
    }

    setErrorMsg("");

    createSkillMutation.mutate();
  }

  const secondaryGoalOptions = goals.filter(
    (goal) => goal.goalType === "Secondary",
  );

  const loading = skillsLoading;

  const displayedError =
    errorMsg ||
    (skillsError
      ? skillsError.response?.data?.message ||
        "Unable to load your skills. Please try again."
      : "") ||
    (goalsError
      ? goalsError.response?.data?.message ||
        "Unable to load your goals. Please try again."
      : "");

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
          <button type="button" className="btn-primary" onClick={openAddSkill}>
            + Add Skill
          </button>
        )}
      </div>

      {isGuidedSetup && <p className="journey-message">{journeyDescription}</p>}

      {displayedError && (
        <div className="skill-error-message" role="alert">
          {displayedError}
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
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
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
        setPracticalRequirements={practicalRequirements}
        errorMsg={errorMsg}
        saving={createSkillMutation.isPending}
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