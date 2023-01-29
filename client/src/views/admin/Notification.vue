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
    <form @submit.prevent="onSubmit">
      <input type="text" v-model="message" />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>
