export function syncSkillProgress(skill, resources = []) {
  const learningAreas = skill.learningAreas || [];
  const practicalRequirements = skill.practicalRequirements || [];

  /* Resources */

  const completedResources = resources.filter(
    (resource) => resource.completed,
  ).length;

  const resourceProgress =
    resources.length > 0
      ? Math.round((completedResources / resources.length) * 100)
      : 0;

  /* Learning Areas */

  const hasLearningAreas = learningAreas.length > 0;

  const completedLearningAreas = learningAreas.filter(
    (area) => area.completed,
  ).length;

  const learningAreaProgress = hasLearningAreas
    ? Math.round((completedLearningAreas / learningAreas.length) * 100)
    : 0;

  /* Practical Requirements */

  const hasPracticalRequirements = practicalRequirements.length > 0;

  const completedPracticalRequirements = practicalRequirements.filter(
    (requirement) => requirement.completed,
  ).length;

  const practicalProgress = hasPracticalRequirements
    ? Math.round(
        (completedPracticalRequirements / practicalRequirements.length) * 100,
      )
    : 0;

  /* Overall Progress */

  const progressComponents = [];

  if (hasLearningAreas) {
    progressComponents.push(learningAreaProgress);
  }

  if (hasPracticalRequirements) {
    progressComponents.push(practicalProgress);
  }

  const progress =
    progressComponents.length > 0
      ? Math.round(
          progressComponents.reduce((total, value) => total + value, 0) /
            progressComponents.length,
        )
      : resourceProgress;

  /* Development Status */

  const hasRequirements = hasLearningAreas || hasPracticalRequirements;

  const developmentStatus = hasRequirements
    ? progress === 100
      ? "Established"
      : "In Progress"
    : resources.length > 0 && resourceProgress === 100
      ? "Established"
      : "In Progress";

  return {
    ...skill,
    progress,
    resourceProgress,
    developmentStatus,
  };
}
