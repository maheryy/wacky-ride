<script setup lang="ts">
import { computed, ref, watch, onMounted, nextTick, onUnmounted } from "vue";
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
const chatRoomMessages = ref<HTMLUListElement | null>(null);
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

  socket.emit("room:message:send", roomId, message.value);

  // TODO ? : add directly messageData to messages
  // Implying that we cannot edit the inserted message without the newly created id from the database

  message.value = "";
};

/* Scroll to the bottom for each new message */
watch(
  () => messages.value.length,
  async () => {
    await nextTick();

    chatRoomMessages.value?.scrollIntoView({ block: "end" });
  }
);

onMounted(() => {
  socket.emit("room:join", roomId);

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
  socket.emit("room:leave", roomId);
  socket.off("room:joined");
  socket.off("room:message:received");
});
</script>

<template>
  <div class="main-container">
    <div id="chat-room" class="chat-room">
      <h3>{{ room?.name }}</h3>
      <div class="chat-room__messages">
        <ul
          id="chat-room-messages"
          class="chat-room__messages__container"
          ref="chatRoomMessages"
        >
          <Message
            v-if="sortedMessages.length"
            v-for="message in sortedMessages"
            :key="message.id"
            :message="message"
          />
        </ul>
      </div>
      <div class="chat-room__input" v-if="canSendMessage">
        <input type="text" v-model.trim="message" @keyup.enter="sendMessage" />
        <button @click="sendMessage">Send</button>
      </div>
      <div v-else>You cannot send messages in this room</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat-room {
  display: flex;
  flex-direction: column;
  height: 500px;
  max-height: 500px;
  background-color: #fff;
  border: #999 solid 1px;
  border-radius: 0.3em;
  color: black;
  width: 400px;

  h3 {
    padding: 0.5em;
    background-color: #999;
    color: white;
  }
}

.chat-room__messages {
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0.5em;
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
}

.chat-room__input {
  display: flex;
  align-items: center;

  input {
    flex: 1;
    padding: 0.5em;
    border: none;
    border-top: #999 solid 1px;
  }

  button {
    padding: 0.5em;
    border: none;
    border-top: #999 solid 1px;
    border-left: #999 solid 1px;
    background-color: gray;
    cursor: pointer;
  }
}
</style>

