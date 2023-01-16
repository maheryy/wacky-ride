<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores";

const auth = useAuthStore();
const router = useRouter();

const logout = () => {
  auth.logout();
  router.push({ name: "home" });
};
</script>
<template>
  <nav class="bg-gray-700">
    <div class="max-w-screen-xl px-4 py-3 mx-auto md:px-6">
      <div class="flex items-center">
        <ul class="flex flex-row mt-0 mr-6 space-x-8 text-sm font-medium">
          <li>
            <RouterLink
              :to="{ name: 'home' }"
              class="text-white hover:underline"
            >
              Home
            </RouterLink>
          </li>
          <li>
            <RouterLink
              :to="{ name: 'dashboard' }"
              class="text-white hover:underline"
            >
              Dashboard
            </RouterLink>
          </li>
          <li>
            <RouterLink
              :to="{ name: 'conversations' }"
              class="text-white hover:underline"
            >
              Conversations
            </RouterLink>
          </li>
          <li>
            <RouterLink
              :to="{ name: 'rooms' }"
              class="text-white hover:underline"
            >
              Rooms
            </RouterLink>
          </li>
          <li>
            <RouterLink
              :to="{ name: 'chatbot' }"
              class="text-white hover:underline"
            >
              Chatbot
            </RouterLink>
          </li>
          <li>
            <RouterLink
              :to="{ name: 'admin' }"
              class="text-white hover:underline"
            >
              Admin
            </RouterLink>
          </li>
          <li>
            <RouterLink
              :to="{ name: 'login' }"
              class="text-white hover:underline"
            >
              Login
            </RouterLink>
          </li>
          <li>
            <a
              @click="logout"
              class="text-white hover:underline cursor-pointer"
            >
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
