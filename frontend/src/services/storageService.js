const get = (key, fallback = []) => {
    try {
        const value = localStorage.getItem(key);

        return value
            ? JSON.parse(value)
            : fallback;
    } catch {
        return fallback;
    }
};

const set = (key, value) => {
    localStorage.setItem(
        key,
        JSON.stringify(value)
    );
};

export const storageService = {

    getGoals: () => get("goals"),

    saveGoals: goals =>
        set("goals", goals),

    getSkills: () => get("skills"),

    saveSkills: skills =>
        set("skills", skills),

    getResources: () =>
        get("resources"),

    saveResources: resources =>
        set("resources", resources),

    getApplications: () =>
        get("applications"),

    saveApplications: applications =>
        set("applications", applications),

    clearGoals: () =>
        localStorage.removeItem("goals"),

    clearSkills: () =>
        localStorage.removeItem("skills"),

    clearResources: () =>
        localStorage.removeItem("resources"),

    clearApplications: () =>
        localStorage.removeItem("applications")
};