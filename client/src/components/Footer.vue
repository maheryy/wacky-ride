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
  <footer class="bg-gray-700">
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
        <ul class="flex flex-row mt-0 mr-6 text-white space-x-8 text-sm font-medium">
          <li>
            Copyright &copy; 2021 Wacky Ride
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
