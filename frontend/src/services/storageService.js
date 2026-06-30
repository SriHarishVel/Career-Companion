const get = (key, fallback = []) => {
    return JSON.parse(localStorage.getItem(key)) || fallback;
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
        set("applications", applications)

};