<script setup lang="ts">
import { computed, inject, onMounted } from "vue";
import { socketKey } from "../providers/keys";
import { useRoomStore } from "../stores/room";
import { TSocket } from "../types/socket.io";

const store = useRoomStore();
const hasRooms = computed(() => Object.keys(store.rooms).length > 0);
const socket = inject(socketKey) as TSocket;

onMounted(() => {
  socket.emit("rooms");

  socket.on("rooms", ({ data, errors }) => {
    if (errors) {
      console.error(errors);

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

