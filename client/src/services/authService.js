import api from "@/lib/axios";

export const login = async (credentials) => {
  return await api.post("/auth/login", credentials);
};

export const register = async (userData) => {
  return await api.post("/auth/register", userData);
};

export const logout = async () => {
  return await api.post("/auth/logout", {}, { withCredentials: true });
};
