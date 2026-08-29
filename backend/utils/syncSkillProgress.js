export function syncSkillProgress(skill, resources = []) {
  const learningAreas = skill.learningAreas || [];

  const practicalRequirements = skill.practicalRequirements || [];

  const completedResources = resources.filter(
    (resource) => resource.completed,
  ).length;

  const completedLearningAreas = learningAreas.filter(
    (area) => area.completed,
  ).length;

  const completedPracticalRequirements = practicalRequirements.filter(
    (requirement) => requirement.completed,
  ).length;

  /* Learning progress */

  const resourceProgress =
    resources.length > 0
      ? Math.round((completedResources / resources.length) * 100)
      : 0;

  const learningAreaProgress =
    learningAreas.length > 0
      ? Math.round((completedLearningAreas / learningAreas.length) * 100)
      : 0;

  const learningProgress =
    learningAreas.length > 0 ? learningAreaProgress : resourceProgress;

  /* Practical progress */

  const practicalProgress =
    practicalRequirements.length > 0
      ? Math.round(
          (completedPracticalRequirements / practicalRequirements.length) * 100,
        )
      : 0;

  /* Learning level */

  const learningComplete =
    learningAreas.length > 0
      ? learningAreaProgress === 100
      : resources.length > 0 && resourceProgress === 100;

  /* Practical level */

  const practicalComplete =
    practicalRequirements.length > 0 && practicalProgress === 100;

  /* Overall progress */

  const progress =
    learningComplete && practicalComplete
      ? 100
      : Math.round((learningProgress + practicalProgress) / 2);

  /* Development status */

  const developmentStatus =
    learningComplete && practicalComplete ? "Established" : "In Progress";

  return {
    ...skill,

    progress,
    developmentStatus,
  };
}
