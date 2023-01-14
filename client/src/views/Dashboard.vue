<script setup lang="ts">
import { useAuthStore } from "../stores";

const store = useAuthStore();
const user = store.user;

</script>
<template>
  <div class="main-container text-white">
    <h1 class="font-bold text-3xl">Dashboard de {{ user?.username }}</h1>
  </div>
</template>
