// Default goals shown before the user adds or saves their own goals.
const initialGoals = [
    {
        id: 1,
        title: "Get Software Developer Job (8+ LPA)",
        category: "Career",
        priority: "High",
        goalType: "Primary",
        progress: 20,
        completed: false,
        deadline: "",
        lastUpdated: Date.now()
    },
    {
        id: 2,
        title: "Practice DSA",
        category: "Career",
        priority: "High",
        goalType: "Secondary",
        parentGoalId: 1,
        completed: false,
        progress: 40,
        deadline: "",
        lastUpdated: Date.now()
    },
    {
        id: 3,
        title: "Build Portfolio",
        category: "Career",
        priority: "Medium",
        goalType: "Secondary",
        parentGoalId: 1,
        completed: false,
        progress: 10,
        deadline: "",
        lastUpdated: Date.now()
    }
];

export default initialGoals;
