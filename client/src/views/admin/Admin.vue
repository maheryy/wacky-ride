<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive } from "vue";
import { useAuthStore, useRoomStore } from "../../stores";
import { TSocket } from "../../types/socket.io";
import EditableRoom from "../../components/EditableRoom.vue";

const auth = useAuthStore();
const socket = auth.socket as TSocket;
const adminSocket = auth.adminSocket as TSocket;

const roomStore = useRoomStore();
const rooms = computed(() => roomStore.rooms);
const initialRoom = { name: "", limit: 50 };
const room = reactive({ ...initialRoom });

function createRoom() {
  adminSocket.emit("room:create", room);
}

onMounted(() => {
  socket.emit("rooms");

  socket.on("rooms", ({ data, errors }) => {
    if (errors) {
      console.error(errors);

      return;
    }

    roomStore.updateRooms(data.rooms);
  });

  adminSocket.on("room:created", ({ data, errors }) => {
    if (errors) {
      console.error(errors);

      return;
    }

    roomStore.setRoom(data.room);

    Object.assign(room, initialRoom);
  });
});

onUnmounted(() => {
  socket.off("rooms");
  adminSocket.off("room:created");
});
</script>

<template>
  <template v-for="room in rooms" :key="room?.id">
    <EditableRoom v-if="room" :initial-room="room" />
  </template>
  <input type="text" v-model="room.name" />
  <input type="number" v-model="room.limit" />
  <button type="button" @click="createRoom">Create</button>
</template>

