<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores";

const auth = useAuthStore();
const router = useRouter();

const logout = () => {
  auth.logout();
  router.push({ name: "home" });
};

// onscroll, make the navbar
</script>
<template>
  <nav class="bg-gray-700 bg-opacity-50" id="nav_app">
    <div class="px-4 py-3 md:px-6">
      <div class="flex items-center justify-between">
        <ul class="flex flex-row mt-0 mr-6 space-x-8 text-sm font-medium">
          <li>
            <RouterLink
              :to="{ name: 'home' }"
              class="text-white hover:underline text-4xl"
            >
              Wacky Ride
            </RouterLink>
          </li>
        </ul>
        <ul class="flex flex-row mt-0 mr-6 space-x-8 text-sm font-medium">
          <li>
            <RouterLink
              :to="{ name: 'dashboard' }"
              class="text-white hover:underline cursor-pointer text-lg"
            >
              Dashboard
            </RouterLink>
          </li>
          <li>
            <RouterLink
              :to="{ name: 'community' }"
              class="text-white hover:underline"
            >
              Communauté
            </RouterLink>
          </li>
          <li v-if="auth.isAuthenticated && !auth.isAdmin">
            <RouterLink
              :to="{ name: 'chatbot' }"
              class="text-white hover:underline cursor-pointer text-lg"
            >
              Chatbot
            </RouterLink>
          </li>
          <li v-if="auth.isAdmin">
            <RouterLink
              :to="{ name: 'admin' }"
              class="text-white hover:underline cursor-pointer text-lg"
            >
              Admin
            </RouterLink>
          </li>
          <li v-if="auth.isAdmin">
            <RouterLink
              :to="{ name: 'notification' }"
              class="text-white hover:underline cursor-pointer text-lg"
            >
              Notification
            </RouterLink>
          </li>
          <li v-if="auth.isAuthenticated">
            <a
              @click="logout"
              class="text-white hover:underline cursor-pointer text-lg"
            >
              Logout
            </a>
          </li>
          <li v-else>
            <RouterLink
              :to="{ name: 'login' }"
              class="text-white hover:underline cursor-pointer text-lg"
            >
              Login
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

