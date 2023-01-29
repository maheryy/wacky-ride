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
  <section id="room">
    <h2>Salons de discussion</h2>
    <div id="new-room">
      <input
        type="text"
        v-model="room.name"
        placeholder="Retour d’expérience"
        minlength="2"
        maxlength="50"
      />
      <input type="number" v-model="room.limit" min="2" max="50" />
      <button type="button" @click="createRoom">Créer</button>
    </div>
    <div id="rooms">
      <template v-for="room in rooms" :key="room?.id">
        <EditableRoom
          v-if="room"
          :initial-room="room"
          :updateRoom="updateRoom"
          :deleteRoom="deleteRoom"
        />
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
#room {
  display: grid;
  gap: 1rem;
  grid-auto-flow: row;
}

#new-room {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;

  input {
    padding: 0.5rem;
    border: 1px solid black;

    &:invalid {
      color: red;
    }
  }

  button {
    padding: 0.5rem;
    border: 1px solid black;
    background-color: white;
    cursor: pointer;

    &:hover {
      background-color: black;
      color: white;
    }
  }
}

#rooms {
  display: grid;
  gap: 1rem;
  align-items: center;

  @media (min-width: 768px) {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>

