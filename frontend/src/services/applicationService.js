import api from "../api/axios";

export const getApplications = async (params = {}) => {
    const response = await api.get(
        "/applications",
        {
            params,
        }
    );

    return response.data;
};

export const getApplication = async (id) => {
    const response = await api.get(
        `/applications/${id}`
    );

    return response.data;
};

export const createApplication = async (
    applicationData
) => {
    const response = await api.post(
        "/applications",
        applicationData
    );

    return response.data;
};

export const updateApplication = async (
    id,
    applicationData
) => {
    const response = await api.put(
        `/applications/${id}`,
        applicationData
    );

    return response.data;
};

export const addInterviewRound = async (
    applicationId,
    roundData
) => {
    const response = await api.post(
        `/applications/${applicationId}/rounds`,
        roundData
    );

    return response.data;
};

export const updateInterviewRound = async (
    applicationId,
    roundId,
    roundData
) => {
    const response = await api.put(
        `/applications/${applicationId}/rounds/${roundId}`,
        roundData
    );

    return response.data;
};

export const deleteInterviewRound = async (
    applicationId,
    roundId
) => {
    const response = await api.delete(
        `/applications/${applicationId}/rounds/${roundId}`
    );

    return response.data;
};

export const deleteApplication = async (id) => {
    const response = await api.delete(
        `/applications/${id}`
    );

    return response.data;
};