import api from "../api/axios";

export const journeyService = {
  async getJourney() {
    const response = await api.get("/home");

    const data = response.data;

    const primaryGoal = data.primaryGoal || null;

    const secondaryGoals = data.secondaryGoals || [];

    const skills = data.skills || [];

    const resources = data.resources || [];

    const applications = data.applications || [];

    let nextStep;

    /*
     * STEP 1
     * No Primary Goal
     */

    if (!primaryGoal) {
      nextStep = {
        page: "/goals",
        action: "createPrimaryGoal",
        title: "Create Your Primary Goal",
        description: "Start by defining your main career objective.",
      };
    } else if (secondaryGoals.length === 0) {

    /*
     * STEP 2
     * Primary Goal exists,
     * but no Secondary Goals
     */
      nextStep = {
        page: "/goals",
        action: "createSecondaryGoal",
        title: "Create Your Secondary Goal",
        description: "Break your primary goal into achievable milestones.",
      };
    } else if (skills.length === 0) {

    /*
     * STEP 3
     * Goals exist,
     * but no Skills
     */
      nextStep = {
        page: "/skills",
        action: "createSkill",
        title: "Add Your First Skill",
        description: "Add a skill that helps you achieve your goals.",
      };
    } else if (applications.length === 0) {

    /*
     * STEP 4
     * Goals and Skills exist,
     * but no Applications
     */
      nextStep = {
        page: "/applications",
        action: "addApplication",
        title: "Start Applying",
        description: "Track your first job application.",
      };
    } else {

    /*
     * STEP 5
     * Career journey is established
     */
      nextStep = {
        page: "/dashboard",
        action: "viewDashboard",
        title: "Dashboard",
        description: "Monitor your overall career journey.",
      };
    }

    return {
      primaryGoal,

      secondaryGoals,

      skills,

      resources,

      applications,

      completedSecondaryGoals: data.completedSecondaryGoals || 0,

      overallProgress: data.overallProgress || 0,

      todaysFocus: data.todaysFocus || null,

      nextStep,
    };
  },
};
