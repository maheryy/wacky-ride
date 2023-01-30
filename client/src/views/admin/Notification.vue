<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();
const message = ref("");

const onSubmit = async () => {
  try {
    await axios.post("admin/notifications", { message: message.value });
    toast.success("Notification envoyée");
  } catch (err) {
    toast.error("Une erreur est survenue");
  }
};
</script>

<template>
  <div>
    <h1 class="text-4xl text-center mt-10 title_color">Envoyer une notification</h1>
    <section class="text-center mt-20 justify-center flex flex-vertical">
      <form @submit.prevent="onSubmit">
        <div class="input_container">
          <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Intitulé de la notification</label>
          <input v-model="message" type="text" id="message" class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
        </div>
        <button class="submit_btn" type="submit">Envoyer</button>
      </form>
    </section>
  </div>
</template>

<style scoped>
  .title_color {
    color: #5f8efd;
  }

  .input_container {
    margin-bottom: 1rem;
    min-width: 600px;
  }

  .submit_btn{
    background-color: #5f8efd;
    color: white;
    border: none;
    border-radius: 10px;
    padding: 10px 20px;
    margin-top: 10px;
  }
</style>
