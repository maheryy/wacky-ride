<script setup lang="ts">
import { onMounted, onUnmounted, provide } from "vue";
import { io } from "socket.io-client";
import { TSocket } from "../types/socket.io";
import store from "../store";
import { socketKey } from "./keys";

const socket: TSocket = io("http://localhost:3000", {
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTY3MjY4ODI3MiwiZXhwIjoxNzA0MjQ1ODcyfQ.BFukTNffDBD5nKBp2d_qw5ndI10sYNeCPWssRNyrvnk",
  },
});

onMounted(() => {
  socket.on("user:connected", ({ data, errors }) => {
    if (errors) {
      console.error(errors);

      return;
    }

    const { receiverConversations, senderConversations, rooms } = data.user;

    const conversations = [...receiverConversations, ...senderConversations];

    store.setConversations(conversations);
    store.setRooms(rooms);
  });

  socket.on("connect", () => {
    console.log("Connected");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
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
