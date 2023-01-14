<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { useRoomStore, TStoreRoom, useAuthStore } from "../stores";
import { TSocket } from "../types/socket.io";

interface EditableRoomProps {
  initialRoom: TStoreRoom;
}

const { initialRoom } = defineProps<EditableRoomProps>();
const roomStore = useRoomStore();
const auth = useAuthStore();
const socket = auth.socket as TSocket;
const room = reactive(initialRoom);

function updateRoom() {
  socket.emit("room:update", room);
}

function deleteRoom() {
  socket.emit("room:delete", room.id);
}

onMounted(() => {
  socket.on("room:updated", ({ data, errors }) => {
    if (errors) {
      console.error(errors);

      return;
    }

    roomStore.updateRoom(data.room);
  });

  socket.on("room:deleted", ({ data, errors }) => {
    if (errors) {
      console.error(errors);

      return;
    }

    roomStore.deleteRoom(data.id);
  });
});
</script>

<template>
  <div>
    <input type="text" v-model="room.name" />
    <input type="number" v-model="room.limit" />
    <button type="button" @click="updateRoom">Update</button>
    <button type="button" @click="deleteRoom">Delete</button>
  </div>
</template>
