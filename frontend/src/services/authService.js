import api from "../api/axios";

const saveAuthData = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
};

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);

  return response.data;
};

export const login = async (userData) => {
  const response = await api.post("/auth/login", userData);

  saveAuthData(response.data);

  return response.data;
};

export const googleLogin = async (credential) => {
  const response = await api.post("/auth/google", {
    credential,
  });

  saveAuthData(response.data);

  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", {
    email,
  });

  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await api.post(`/auth/reset-password/${token}`, {
    newPassword,
  });

  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getToken = () => {
  return localStorage.getItem("token");
};