<script setup lang="ts">
import { computed, inject, ref, watch, onMounted, nextTick } from "vue";
import { TSocket } from "../../types/socket.io";
import Message from "./RoomMessage.vue";
import { socketKey } from "../../providers/keys";
import store from "../../store";
import { IRoom } from "../../types/room";

interface IChatRoomProps {
  roomId: IRoom["id"];
}

const { roomId } = defineProps<IChatRoomProps>();

const message = ref("");
const socket = inject(socketKey) as TSocket;
const room = computed(() => store.rooms[roomId]);
const chatRoomMessages = ref<HTMLUListElement | null>(null);

const messages = computed(() => {
  if (!room.value) {
    return [];
  }

  return room.value.messages;
});

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
watch(messages, async (newMessages, oldMessages) => {
  await nextTick();

  const hasNewMessages = newMessages.length > oldMessages.length;

  if (hasNewMessages) {
    chatRoomMessages.value?.scrollIntoView({ block: "end" });
  }
});

onMounted(() => {
  socket.emit("room:join", roomId);

  socket.on("room:joined", ({ data, errors }) => {
    if (errors) {
      console.error(errors);

      // TODO: have better error handling
      return;
    }

    store.setRoom(data.room);
  });

  socket.on("room:message:received", ({ data, errors }) => {
    if (errors) {
      console.error(errors);

      // TODO: have better error handling
      return;
    }

    messages.value.push(data.message);
  });
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
            v-if="messages.length"
            v-for="message in messages"
            :key="message.id"
            :message="message"
          />
        </ul>
      </div>
      <div class="chat-room__input">
        <input type="text" v-model.trim="message" @keyup.enter="sendMessage" />
        <button @click="sendMessage">Send</button>
      </div>
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
