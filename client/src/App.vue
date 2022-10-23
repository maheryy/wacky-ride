<script setup lang="ts">
import ChatBox from "./components/ChatBox/ChatBox.vue";
import ChatRoom from "./components/ChatRoom/ChatRoom.vue";

</script>

<template>
  <div class="chat-container">
    <!-- <ChatBox /> -->
    <ChatRoom :roomId="1" title="My Super Room 1" />
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
