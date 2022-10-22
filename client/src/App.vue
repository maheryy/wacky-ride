<script setup lang="ts">
import ChatBox from "./components/ChatBox/ChatBox.vue";
</script>

<template>
  <div class="chat-container">
    <ChatBox />
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
