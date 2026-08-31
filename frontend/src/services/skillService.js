import api from "../api/axios";

export const getSkills = async (params = {}) => {
  const response = await api.get("/skills", {
    params,
  });

  return response.data;
};

export const getSkill = async (skillId) => {
  const response = await api.get(`/skills/${skillId}`);

  return response.data;
};

export const createSkill = async (skillData) => {
  const response = await api.post("/skills", skillData);

  return response.data;
};

export const updateSkill = async (skillId, skillData) => {
  const response = await api.put(`/skills/${skillId}`, skillData);

  return response.data;
};

export const deleteSkill = async (skillId) => {
  const response = await api.delete(`/skills/${skillId}`);

  return response.data;
};
