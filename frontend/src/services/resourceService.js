import api from "../api/axios";

/* Resources */

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
  const response = await api.post("/resources", resourceData);

  return response.data;
};

export const updateResource = async (id, resourceData) => {
  const response = await api.put(`/resources/${id}`, resourceData);

  return response.data;
};

export const deleteResource = async (id) => {
  const response = await api.delete(`/resources/${id}`);

  return response.data;
};

/* Resource Items */

export const addResourceItem = async (resourceId, itemData) => {
  const response = await api.post(`/resources/${resourceId}/items`, itemData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateResourceItem = async (resourceId, itemId, itemData) => {
  const response = await api.put(
    `/resources/${resourceId}/items/${itemId}`,
    itemData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

export const deleteResourceItem = async (resourceId, itemId) => {
  const response = await api.delete(`/resources/${resourceId}/items/${itemId}`);

  return response.data;
};