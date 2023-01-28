import { defineStore } from "pinia";
import { ref, readonly, watch, computed } from "vue";
import { IUser, IUserCredentials } from "../types/user";
import axios from "axios";
import { TSocket } from "../types/socket.io";
import { io } from "socket.io-client";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(null);
  const user = ref<IUser | null>(null);
  const socket = ref<TSocket | null>(null);
  const adminSocket = ref<TSocket | null>(null);

  // Init socket.io client on user authenticated
  // NB: Depending on the user role, the client socket uses a different namespace (see server-side namespace registration)
  watch(user, (newUser) => {
    if (newUser) {
      socket.value = io(import.meta.env.VITE_API_URL, {
        auth: { token: token.value },
      });

      if (newUser.isAdmin) {
        adminSocket.value = io(import.meta.env.VITE_API_URL + "/admin", {
          auth: { token: token.value },
        });
      }
    } else {
      socket.value?.disconnect();
      adminSocket.value?.disconnect();
    }
  });

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  const isAdmin = computed(() => user.value?.isAdmin ?? false);

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

  function setStatus(status: IUser["status"]) {
    if (user.value) {
      user.value.status = status;
    }
  }

  return {
    user: readonly(user),
    socket,
    adminSocket,
    login,
    logout,
    attempt,
    isAuthenticated,
    isAdmin,
    setStatus,
  };
});

export type TStoreAuth = ReturnType<typeof useAuthStore>;

