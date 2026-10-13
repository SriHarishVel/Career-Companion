import api from "../api/axios";

export const getTargetRoles = async () => {
  const response = await api.get("/target-roles");

  return response.data;
};

export const getTargetRole = async (roleId) => {
  const response = await api.get(`/target-roles/${roleId}`);

  return response.data;
};

export const createTargetRole = async (roleData) => {
  const response = await api.post("/target-roles", roleData);

  return response.data;
};

export const updateTargetRole = async (roleId, roleData) => {
  const response = await api.put(`/target-roles/${roleId}`, roleData);

  return response.data;
};

export const deleteTargetRole = async (roleId) => {
  const response = await api.delete(`/target-roles/${roleId}`);

  return response.data;
};

export const getTargetRoleReadiness = async (roleId) => {
  const response = await api.get(`/target-roles/${roleId}/readiness`);

  return response.data;
};