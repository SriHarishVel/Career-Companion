export function syncPrimaryGoalProgress(goals) {
  return goals.map((goal) => {
    if (goal.goalType !== "Primary") {
      return goal;
    }

    const childGoals = goals.filter(
      (child) => child.parentGoal?._id?.toString() === goal._id.toString(),
    );

    if (childGoals.length === 0) {
      return {
        ...goal,
        progress: 0,
        completed: false,
      };
    }

    const averageProgress = Math.round(
      childGoals.reduce((total, child) => total + child.progress, 0) /
        childGoals.length,
    );

    return {
      ...goal,
      progress: averageProgress,
      completed: averageProgress === 100,
    };
  });
}
