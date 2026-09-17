import api from "../api/axios";

export const getResources = async (params = {}) => {
  const response = await api.get("/resources", {
    params,
  });

  return response.data;
};

export const getResource = async (id) => {
  const response = await api.get(`/resources/${id}`);

  return response.data;
};

export const createResource = async (resourceData) => {
  const response = await api.post("/resources", resourceData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateResource = async (id, resourceData) => {
  const response = await api.put(`/resources/${id}`, resourceData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteResource = async (id) => {
  const response = await api.delete(`/resources/${id}`);

  return response.data;
};