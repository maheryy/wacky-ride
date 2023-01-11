<script setup lang="ts">
import { onMounted, onUnmounted, provide } from "vue";
import { io } from "socket.io-client";
import { TSocket } from "../types/socket.io";
import { useConversationStore, useRoomStore } from "../stores";
import { adminSocketKey, socketKey } from "./keys";

const roomStore = useRoomStore();
const conversationStore = useConversationStore();

const socket: TSocket = io("http://localhost:3000", {
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTY3MjY4ODI3MiwiZXhwIjoxNzA0MjQ1ODcyfQ.BFukTNffDBD5nKBp2d_qw5ndI10sYNeCPWssRNyrvnk",
  },
});

const adminSocket: TSocket = io("http://localhost:3000/admin", {
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY3MzI3MTUyMiwiZXhwIjoxNzA0ODI5MTIyfQ.U-LBTPIgap-vGgmuZIeQCQvmdM1ktWwUzn8tX_J5IFE",
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

    conversationStore.setConversations(conversations);
    roomStore.setRooms(rooms);
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
provide(adminSocketKey, adminSocket);
</script>

<template>
  <slot />
</template>
