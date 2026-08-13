import { getGoals } from "./goalService";
import { getSkills } from "./skillService";
import { getResources } from "./resourceService";
import { getApplications } from "./applicationService";

export const journeyService = {

    async getGoalsData() {

        const response = await getGoals();

        const goals =
            response?.goals ||
            response ||
            [];

        const primaryGoal = goals.find(
            goal => goal.goalType === "Primary"
        );

        const secondaryGoals = goals.filter(
            goal =>
                goal.goalType === "Secondary" &&
                goal.parentGoal?._id === primaryGoal?._id
        );

        return {
            primaryGoal,
            secondaryGoals
        };
    },


    async getJourneyOverview() {

        const {
            primaryGoal,
            secondaryGoals
        } = await this.getGoalsData();

        const [
            skillsResponse,
            resourcesResponse,
            applicationsResponse
        ] = await Promise.all([
            getSkills(),
            getResources(),
            getApplications()
        ]);

        const skills =
            skillsResponse?.skills ||
            skillsResponse ||
            [];

        const resources =
            resourcesResponse?.resources ||
            resourcesResponse ||
            [];

        const applications =
            Array.isArray(applicationsResponse)
                ? applicationsResponse
                : applicationsResponse?.Applications ||
                applicationsResponse?.applications ||
                [];

        const completedSecondaryGoals =
            secondaryGoals.filter(
                goal => goal.completed
            ).length;


        const overallProgress =
            secondaryGoals.length > 0
                ? Math.round(
                    secondaryGoals.reduce(
                        (total, goal) =>
                            total + (goal.progress || 0),
                        0
                    ) / secondaryGoals.length
                )
                : 0;


        //Connect skills to their secondary goals.

        const secondaryGoalsWithSkills =
            secondaryGoals.map(goal => {

                const goalSkills = skills.filter(
                    skill =>
                        skill.secondaryGoal?._id === goal._id
                );

                return {
                    ...goal,
                    skills: goalSkills
                };

            });


        //Connect resources to their skills.

        const skillsWithResources =
            skills.map(skill => {

                const skillResources =
                    resources.filter(
                        resource =>
                            resource.skill?._id === skill._id
                    );

                return {
                    ...skill,
                    resources: skillResources
                };

            });


        //Connect applications to the primary goal.

        const journeyApplications = applications;


        //Find the first incomplete secondary goal.
        
        const todaysFocus =
            secondaryGoalsWithSkills.find(
                goal => !goal.completed
            );

        return {
            primaryGoal,

            secondaryGoals:
                secondaryGoalsWithSkills,

            skills:
                skillsWithResources,

            resources,

            applications:
                journeyApplications,

            completedSecondaryGoals,

            overallProgress,

            todaysFocus
        };
    },


    async getNextStep() {

        const {
            primaryGoal,
            secondaryGoals
        } = await this.getGoalsData();

        const [
            skillsResponse,
            applicationsResponse
        ] = await Promise.all([
            getSkills(),
            getApplications()
        ]);

        const skills =
            skillsResponse?.skills ||
            skillsResponse ||
            [];

        const applications =
            Array.isArray(applicationsResponse)
                ? applicationsResponse
                : applicationsResponse?.Applications ||
                applicationsResponse?.applications ||
                [];

        if (!primaryGoal) {
            return {
                page: "/goals",
                action: "createPrimaryGoal",
                title: "Create Your Primary Goal",
                description:
                    "Start by defining your main career objective."
            };
        }

        if (secondaryGoals.length === 0) {
            return {
                page: "/goals",
                action: "createSecondaryGoal",
                title: "Create Your Secondary Goal",
                description:
                    "Break your primary goal into achievable milestones."
            };
        }

        if (skills.length === 0) {
            return {
                page: "/skills",
                action: "createSkill",
                title: "Add Your First Skill",
                description:
                    "Add a skill that helps you achieve your goals."
            };
        }

        if (applications.length === 0) {
            return {
                page: "/applications",
                action: "addApplication",
                title: "Start Applying",
                description:
                    "Track your first job application."
            };
        }

        return {
            page: "/dashboard",
            action: "viewDashboard",
            title: "Dashboard",
            description:
                "Monitor your overall career journey."
        };
    }

};