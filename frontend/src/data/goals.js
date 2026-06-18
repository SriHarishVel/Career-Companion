// Default goals shown before the user adds or saves their own goals.
const initialGoals = [
    {
        id: 1,
        title: "Learn React",
        category: "Learning",
        priority: "Medium",
        progress: 20,
        deadline: "",
        lastUpdated: Date.now()
    },
    {
        id: 2,
        title: "Practice DSA",
        category: "Career",
        priority: "High",
        progress: 40,
        deadline: "",
        lastUpdated: Date.now()
    },
    {
        id: 3,
        title: "Build Portfolio",
        category: "Career",
        priority: "Low",
        progress: 10,
        deadline: "",
        lastUpdated: Date.now()
    }
];

export default initialGoals;
