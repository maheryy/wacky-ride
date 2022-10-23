<script setup lang="ts">
// import ChatBox from "./components/ChatBox/ChatBox.vue";
import ChatRoom from "./components/ChatRoom/ChatRoom.vue";
</script>

<template>
  <div class="chat-container">
    <ChatRoom :roomId="2" title="My Super Room 2" />
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
