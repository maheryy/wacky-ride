<script setup lang="ts">
import Nav from "./components/common/Nav.vue";
</script>

<template>
  <Nav />
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
