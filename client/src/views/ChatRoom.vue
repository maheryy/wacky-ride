<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick } from "vue";
import { TSocket } from "../types/socket.io";
import Message from "../components/RoomMessage.vue";
import { IRoom } from "../types/room";
import { useRoomStore } from "../stores/room";
import dayjs from "dayjs";
import { useAuthStore } from "../stores";
import { useToast } from "vue-toastification";

interface IChatRoomProps {
  roomId: IRoom["id"];
}

const { roomId } = defineProps<IChatRoomProps>();

const message = ref("");
const store = useRoomStore();
const auth = useAuthStore();
const toast = useToast();
const socket = auth.socket as TSocket;
const room = computed(() => store.rooms[roomId]);
const messages = computed(() => room.value?.messages || []);
const bottom = ref<HTMLDivElement | null>(null);
const canSendMessage = ref(false);

const sortedMessages = computed(() =>
  messages.value.slice().sort((a, b) => {
    if (dayjs(a.createdAt).isAfter(dayjs(b.createdAt))) {
      return 1;
    }

    return -1;
  })
);

const sendMessage = () => {
  if (!message.value) {
    return;
  }

  socket.emit("room:message:send", +roomId, message.value);

  message.value = "";
};

onMounted(() => {
  bottom.value?.scrollIntoView({ block: "end" });

  socket.emit("room:join", +roomId);

  socket.on("room:joined", ({ data, errors }) => {
    if (errors) {
      for (const error of errors) {
        toast.error(error.message);
      }

      return;
    }

    canSendMessage.value = true;

    store.updateRoom(data.room);
  });

  socket.on("room:message:received", async ({ data, errors }) => {
    if (errors) {
      for (const error of errors) {
        toast.error(error.message);
      }

      return;
    }

    store.addMessage(roomId, data.message);

    if (data.message.author.id === auth.user?.id) {
      await nextTick();

      bottom.value?.scrollIntoView({ block: "end" });
    }
  });
});

onUnmounted(() => {
  socket.emit("room:leave", +roomId);
  socket.off("room:joined");
  socket.off("room:message:received");
});
</script>

<template>
  <div class="main-container wacky-tile">
    <section id="room" class="community">
      <header>
        <RouterLink to="/rooms" class="back">ᐸ</RouterLink>
        <h3>{{ room?.name }}</h3>
      </header>
      <p class="text-gray-600 text-center italic text-sm">Cliquez sur un utilisateur pour lancer une conversation privée</p>

      <ul v-if="sortedMessages.length" class="messages">
        <Message
          v-for="message in sortedMessages"
          :key="message.id"
          :message="message"
        />
        <div ref="bottom" class="bottom" />
      </ul>
      <div v-else class="no-messages">
        <p>Il n'y a pas de messages</p>
      </div>
      <div v-if="canSendMessage" class="board">
        <input
          type="text"
          v-model.trim="message"
          @keyup.enter="sendMessage"
          autofocus
          maxlength="255"
          minlength="1"
        />
        <button @click="sendMessage">Envoyer</button>
      </div>
      <div v-else class="can-not-send-message">
        <p>Vous ne pouvez envoyer de messages</p>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
#room {
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
    background: black;
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
      background-color: black;
      color: white;
      justify-self: center;
    }
  }

  .messages {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
    padding-bottom: 1rem;

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

    li {
      height: fit-content;
    }
  }

  .no-messages {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }

  .board {
    display: flex;
    align-items: center;

    input {
      flex: 1;
      padding: 0.5em;
      border: none;
      border-top: 1px solid black;
    }

    button {
      padding: 0.5rem;
      border: none;
      border-top: 1px solid black;
      border-left: 1px solid black;
      background-color: black;
      color: white;
      cursor: pointer;
    }
  }
  .can-not-send-message {
    background: black;
    color: white;
    padding: 0.5rem;
    display: grid;
    justify-content: center;
  }
}
</style>

