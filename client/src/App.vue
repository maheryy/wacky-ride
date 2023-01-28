<script setup lang="ts">
import Nav from "./components/Nav.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <Nav />
  <main>
    <RouterView />
  </main>
  <Footer />
</template>

<style scoped>
main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
