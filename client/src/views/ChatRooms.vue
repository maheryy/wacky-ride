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
  <div class="main-container">
    <section id="rooms" class="community">
      <header>
        <RouterLink to="/community" class="back">ᐸ</RouterLink>
        <h3>Salons de discussion</h3>
      </header>
      <ul>
        <li v-if="hasRooms" v-for="room of store.rooms" :key="room?.id">
          <RouterLink :to="{ name: 'room', params: { roomId: room?.id } }">
            {{ room?.name }}
          </RouterLink>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped lang="scss">
#rooms {
  display: flex;
  flex-direction: column;
  height: 500px;
  max-height: 500px;
  background-color: white;
  border: 1px solid black;
  color: black;
  width: 400px;

  header {
    display: grid;
    align-items: center;
    justify-content: center;
    background: black;
    color: white;
    position: relative;
    .back {
      position: absolute;
      left: 0.5rem;
      font-size: 1rem;
      text-decoration: none;
      color: white;
    }

    h3 {
      padding: 0.5rem;
    }

    button {
      padding: 0.5rem;
      background-color: black;
      color: white;
      border-bottom: 1px solid black;

      &:hover {
        background-color: white;
        color: black;
      }
    }
  }

  ul {
    display: grid;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 0.5rem;
    }

    &::-webkit-scrollbar-track {
      background-color: #f1f1f1;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #888;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: #555;
    }

    li:nth-child(odd) {
      background-color: #f3f3f3;
    }

    li {
      height: 3rem;

      &:hover {
        background-color: black;
        color: white;
      }

      a {
        display: grid;
        grid-template-columns: 1fr auto;
        text-decoration: none;
        align-items: center;
        height: 100%;
        padding: 0.5rem;
      }
    }
  }
}
</style>

