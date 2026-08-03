import api from "../api/axios";

export const register = async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
};

export const login = async (userData) => {
    const response = await api.post("/auth/login", userData);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
    );

    return response.data;
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export const getToken = () => {
    return localStorage.getItem("token");
};