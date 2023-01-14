import { defineStore } from "pinia";
import { ref, readonly } from "vue";
import { IUser, IUserCredentials } from "../types/user";
import axios from "axios";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(null);
  const user = ref<IUser | null>(null);

  const isAuthenticated = (): boolean => !!(token.value && user.value);

  const isAdmin = (): boolean => user.value?.isAdmin || false;

  const login = async (credentials: IUserCredentials): Promise<void> => {
    try {
      const response = await axios.post("auth/login", credentials);
      await attempt(response.data.token);
    } catch (e) {
      throw e;
    }
  };

  const attempt = async (
    accessToken: string,
    userData?: IUser
  ): Promise<void> => {
    if (!accessToken) return;

    if (userData) {
      user.value = userData;
    }

    token.value = accessToken;
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    localStorage.setItem("token", accessToken);

    try {
      const response = await axios.get("auth/me");
      user.value = response.data.user;
    } catch (e) {
      clearAll();
    }
  };

  const logout = () => clearAll();

  const clearAll = () => {
    token.value = null;
    user.value = null;
    axios.defaults.headers.common["Authorization"] = null;
    localStorage.removeItem("token");
  };

  return {
    user: readonly(user),
    login,
    logout,
    attempt,
    isAuthenticated,
    isAdmin,
  };
});

export type TStoreAuth = ReturnType<typeof useAuthStore>;
