import { storageService } from "./storageService";

export const journeyService = {

    getGoalsData() {

        const goals = storageService.getGoals();

        const primaryGoal = goals.find(
            goal => goal.goalType === "Primary"
        );

        const secondaryGoals = goals.filter(
            goal =>
                goal.goalType === "Secondary" &&
                goal.parentGoalId === primaryGoal?.id
        );

        return {
            primaryGoal,
            secondaryGoals
        };

    },

    getJourneyOverview() {
        const {
            primaryGoal,
            secondaryGoals
        } = this.getGoalsData();

        const skills = storageService.getSkills();
        const resources = storageService.getResources();
        const applications = storageService.getApplications();

        const completedSecondaryGoals =
            secondaryGoals.filter(
                goal => goal.completed
            ).length;

        const overallProgress =
            secondaryGoals.length > 0
                ? Math.round(
                    secondaryGoals.reduce(
                        (total, goal) => total + goal.progress,
                        0
                    ) / secondaryGoals.length
                )
                : 0;
        const todaysFocus =
            secondaryGoals.find(
                goal => !goal.completed
            );
        return {
            primaryGoal,
            secondaryGoals,
            skills,
            resources,
            applications,
            completedSecondaryGoals,
            overallProgress,
            todaysFocus
        };
    },

    getNextStep() {

        const {
            primaryGoal,
            secondaryGoals
        } = this.getGoalsData();

        const skills = storageService.getSkills();
        const applications = storageService.getApplications();

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