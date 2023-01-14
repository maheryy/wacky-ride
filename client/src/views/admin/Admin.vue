<script setup lang="ts">
import { computed, inject, onMounted, reactive } from "vue";
import { adminSocketKey, socketKey } from "../../providers/keys";
import { useRoomStore } from "../../stores";
import { TSocket } from "../../types/socket.io";
import EditableRoom from "../../components/EditableRoom.vue";

const socket = inject(socketKey) as TSocket;
const roomStore = useRoomStore();
const rooms = computed(() => roomStore.rooms);
const room = reactive({ name: "", limit: 50 });
const adminSocket = inject(adminSocketKey) as TSocket;

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
  });
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

