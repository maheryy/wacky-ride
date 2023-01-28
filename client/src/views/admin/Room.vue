<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive } from "vue";
import { useAuthStore, useRoomStore } from "../../stores";
import { TSocket } from "../../types/socket.io";
import EditableRoom from "./EditableRoom.vue";
import { IRoom, TRoomUpdate } from "../../types/room";
import { useToast } from "vue-toastification";

const auth = useAuthStore();
const socket = auth.socket as TSocket;
const adminSocket = auth.adminSocket as TSocket;

const roomStore = useRoomStore();
const toast = useToast();
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

function restoreRoom(roomId: IRoom["id"]) {
  adminSocket.emit("room:restore", roomId);
}

onMounted(() => {
  socket.emit("rooms");

  socket.on("rooms", ({ data, errors }) => {
    if (errors) {
      for (const error of errors) {
        toast.error(error.message);
      }

      return;
    }

    roomStore.updateRooms(data.rooms);
  });

  adminSocket.on("room:created", ({ data, errors }) => {
    if (errors) {
      for (const error of errors) {
        toast.error(error.message);
      }

      return;
    }

    roomStore.setRoom(data.room);
    toast.success("Room created");
    Object.assign(room, initialRoom);
  });

  adminSocket.on("room:updated", ({ data, errors }) => {
    if (errors) {
      for (const error of errors) {
        toast.error(error.message);
      }

      return;
    }

    roomStore.updateRoom(data.room);
    toast.success("Room updated");
  });

  adminSocket.on("room:deleted", ({ data, errors }) => {
    if (errors) {
      for (const error of errors) {
        toast.error(error.message);
      }

      return;
    }

    roomStore.deleteRoom(data.id);

    toast.success("Room deleted, click to restore", {
      timeout: 6000,
      onClick() {
        restoreRoom(data.id);
      },
    });
  });

  adminSocket.on("room:restored", ({ data, errors }) => {
    if (errors) {
      for (const error of errors) {
        toast.error(error.message);
      }

      return;
    }

    roomStore.setRoom(data.room);
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

