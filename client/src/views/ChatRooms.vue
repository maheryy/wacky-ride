<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoomStore } from "../stores/room";
import { TSocket } from "../types/socket.io";
import { useAuthStore } from "../stores";
import { useToast } from "vue-toastification";

const store = useRoomStore();
const toast = useToast();
const hasRooms = computed(() => Object.keys(store.rooms).length > 0);
const auth = useAuthStore();
const socket = auth.socket as TSocket;

onMounted(() => {
  socket.emit("rooms");

  socket.on("rooms", ({ data, errors }) => {
    if (errors) {
      for (const error of errors) {
        toast.error(error.message);
      }

      return;
    }

    store.updateRooms(data.rooms);
  });
});
</script>

<template>
  <ul id="chat-rooms">
    <li
        class="chat-room"
        v-if="hasRooms"
        v-for="room of store.rooms"
        :key="room?.id"
    >
      <RouterLink :to="{ name: 'room', params: { roomId: room?.id } }">
        {{ room?.name }}
      </RouterLink>
    </li>
  </ul>
</template>

<style scoped>
.chat-room {
  color: white;
}
</style>

