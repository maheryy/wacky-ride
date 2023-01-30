<script setup lang="ts">
import { useRouter } from "vue-router";
import { reactive } from "vue";
import { useAuthStore } from "../stores";
import { AxiosError } from "axios";
import {useToast} from "vue-toastification";

const router = useRouter();
const auth = useAuthStore();
const toast = useToast();


const form = reactive({
  email: "",
  password: "",
});

const onSubmit = async () => {
  try {
    await auth.login(form);
    router.push({ name: auth.isAdmin ? "admin" : "home" });
  } catch (error: unknown) {
    if ((error as AxiosError).response?.status === 401) {
      toast.error("Nom d'utilisateur ou mot de passe incorrect");
    } else {
      toast.error("Une erreur est survenue");
    }
  }
};
</script>

<template>
  <div class="main-container">
    <div class="form-wrapper w-80">
      <h1 class="text-center text-3xl text-gray-600">Login</h1>
      <form @submit.prevent="onSubmit" class="flex flex-col gap-4 py-8">
        <input
          type="text"
          placeholder="email"
          name="email"
          class="px-2 py-2 rounded-md text-black border-2 border-gray-300"
          v-model="form.email"
          required
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          class="px-2 py-2 rounded-md text-black border-2 border-gray-300"
          v-model="form.password"
          required
        />
        <button
          type="submit"
          class="px-2 py-2 rounded-md bg-blue-500 text-white"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<style></style>

