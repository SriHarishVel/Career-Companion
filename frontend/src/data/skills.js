// Starting skills used when the user has not saved their own list yet.
const initialSkills = [
    {
        id: 1,
        title: "React",
        category: "Frontend",
        level: "Beginner",
        progress: 20,
        secondaryGoalId: null,
        lastUpdated: Date.now()
    },
    {
        id: 2,
        title: "Node",
        category: "Backend",
        level: "Intermediate",
        progress: 40,
        secondaryGoalId: null,
        lastUpdated: Date.now()
    },
    {
        id: 3,
        title: "Gen AI",
        category: "AI",
        level: "Beginner",
        progress: 10,
        secondaryGoalId: null,
        lastUpdated: Date.now()
    }
];

export default initialSkills;
