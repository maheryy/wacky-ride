<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
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

  bottom.value?.scrollIntoView({ block: "end" });
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

  socket.on("room:message:received", ({ data, errors }) => {
    if (errors) {
      for (const error of errors) {
        toast.error(error.message);
      }

      return;
    }

    store.addMessage(roomId, data.message);
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
      <ul v-if="sortedMessages.length" class="messages">
        <Message
          v-for="message in sortedMessages"
          :key="message.id"
          :message="message"
        />
        <div ref="bottom" />
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
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 500px;
  max-height: 500px;
  background: linear-gradient(to bottom right, #5f8efd, #bd4b4b);
  color: #262626;
  width: 600px;
  border-radius:20px;

  header {
    display: grid;
    align-items: center;
    background:#5f8efd;
    border-radius:20px 20px 0 0;
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
      background-color: #5f8efd;
      color: white;
      justify-self: center;
    }
  }

  .messages {
    padding: 20px 10px 0 10px;
    display: grid;
    gap: 1rem;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 0.5rem;
    }

    &::-webkit-scrollbar-track {
      background-color: #f1f1f1;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #5f8efd;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: #2758ce;
    }

    li {
      height: fit-content;
      border-radius: 25px;
      background-color: rgba(252, 252, 252, 0.45);
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
      background-color: rgba(95, 142, 253, 0.56);
      color: white;
      flex: 1;
      padding: 0.5em;
      border-radius: 20px 0 0 20px ;
      border: none;
      border-top: 2px solid #2758ce;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      color: white;
      background-color: #2758ce;
      cursor: pointer;
      border-top: 2px solid #2758ce;
      border-radius:0 0 20px 0;

      &:hover {
        background-color: #f3f3f3;
        color: #2758ce;
      }
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

