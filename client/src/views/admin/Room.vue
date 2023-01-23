<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive } from "vue";
import { useAuthStore, useRoomStore } from "../../stores";
import { TSocket } from "../../types/socket.io";
import EditableRoom from "./EditableRoom.vue";
import { IRoom, TRoomUpdate } from "../../types/room";

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

function updateRoom(room: TRoomUpdate) {
  adminSocket.emit("room:update", room);
}

function deleteRoom(roomId: IRoom["id"]) {
  adminSocket.emit("room:delete", roomId);
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

  adminSocket.on("room:updated", ({ data, errors }) => {
    if (errors) {
      console.error(errors);

      return;
    }

    roomStore.updateRoom(data.room);
  });

  adminSocket.on("room:deleted", ({ data, errors }) => {
    if (errors) {
      console.error(errors);

      return;
    }

    roomStore.deleteRoom(data.id);
  });
});

onUnmounted(() => {
  socket.off("rooms");
  adminSocket.off("room:created");
  adminSocket.off("room:updated");
  adminSocket.off("room:deleted");
});
</script>

<template>
  <template v-for="room in rooms" :key="room?.id">
    <EditableRoom
      v-if="room"
      :initial-room="room"
      :updateRoom="updateRoom"
      :deleteRoom="deleteRoom"
    />
  </template>
  <input type="text" v-model="room.name" />
  <input type="number" v-model="room.limit" />
  <button type="button" @click="createRoom">Create</button>
</template>

