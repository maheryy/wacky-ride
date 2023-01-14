<script setup lang="ts">
import Nav from "./components/Nav.vue";
import SocketProvider from "./providers/SocketProvider.vue";
</script>

<template>
  <SocketProvider>
    <Nav />
    <main>
      <RouterView />
    </main>
  </SocketProvider>
</template>

<style scoped>
main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
