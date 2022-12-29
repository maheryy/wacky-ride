<script setup lang="ts">
import Nav from "./components/common/Nav.vue";
</script>

<template>
  <Nav />
  <div class="chat-container">
    <RouterView />
  </div>
</template>

<style lang="scss">
.chat-container {
  width: 100%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
