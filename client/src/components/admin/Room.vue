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
  adminSocket.emit("room:delete", +roomId);
}

function restoreRoom(roomId: IRoom["id"]) {
  adminSocket.emit("room:restore", +roomId);
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

    toast.success("Salon supprimé, cliquez ici pour annuler", {
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
    <h2 class="text-2xl sub_title">Ajouter un salon de discussion : </h2>
    <div id="new-room" class="flex flex-col ml-10">
      <div class="row">
        <input
            type="text"
            v-model="room.name"
            placeholder="Nom du salon"
            minlength="2"
            maxlength="50"
        />
      </div>
      <div class="mt-5">
        <input type="number" v-model="room.limit" min="2" max="50" class="mr-5"/>
        <button type="button" @click="createRoom" >Créer</button>
      </div>
    </div>
    <div class="flex justify-center">
      <hr class="w-1/2"/>
    </div>
    <h2 class="text-2xl sub_title">Liste des salons de discussion : </h2>
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
  display: flex;

  input {
    padding: 0.5rem;
    border: 1px solid #a1a1a1;
    border-radius: 0.5rem;

    &:invalid {
      color: red;
    }
  }

  button {
    padding: 0.5rem 1rem;
    border: 1px solid #2758ce;
    border-radius: 5px;
    background: white;
    cursor: pointer;

    &:hover {
      background-color: #2758ce;
      color: white;
    }
  }
}

#rooms {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 1rem 0;

  @media (min-width: 768px) {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>

