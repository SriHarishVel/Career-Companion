import { storageService } from "./storageService";

export const journeyService = {

    getNextStep() {

        const goals = storageService.getGoals();

        const primaryGoal = goals.find(
            goal => goal.goalType === "Primary"
        );

        const secondaryGoals = goals.filter(
            goal => goal.goalType === "Secondary"
        );

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