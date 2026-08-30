export function syncSecondaryGoalProgress(goals, skills = []) {
  return goals.map((goal) => {
    if (goal.goalType !== "Secondary") {
      return goal;
    }

    const relatedSkills = skills.filter(
      (skill) => skill.secondaryGoal?.toString() === goal._id.toString(),
    );

    if (relatedSkills.length === 0) {
      return {
        ...goal,
        progress: 0,
        completed: false,
      };
    }

    const averageProgress = Math.round(
      relatedSkills.reduce(
        (total, skill) => total + (Number(skill.progress) || 0),
        0,
      ) / relatedSkills.length,
    );

    return {
      ...goal,
      progress: averageProgress,
      completed: averageProgress === 100,
    };
  });
}
