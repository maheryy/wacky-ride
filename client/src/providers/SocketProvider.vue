<script setup lang="ts">
import { onMounted, onUnmounted, provide } from "vue";
import { io } from "socket.io-client";
import { socketKey } from "./keys";

const socket = io("http://localhost:3000", {
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTY3MjY4ODI3MiwiZXhwIjoxNzA0MjQ1ODcyfQ.BFukTNffDBD5nKBp2d_qw5ndI10sYNeCPWssRNyrvnk",
  },
});

onMounted(() => {
  socket.on("connect", () => {
    console.log("connected");
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});

onUnmounted(() => {
  socket.disconnect();
});

provide(socketKey, socket);
</script>

<template>
  <slot />
</template>
