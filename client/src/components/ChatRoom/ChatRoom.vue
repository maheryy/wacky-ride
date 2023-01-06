<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
import { TMessage } from "../../types/message";
import { IEmitEvents, IListenEvents } from "../../types/socket.io";
import { io, Socket } from "socket.io-client";
import Message from "./RoomMessage.vue";
import { IRoom } from "../../types/room";

interface ChatBoxProps {
  roomId: number;
  title: string;
}

const { roomId, title } = defineProps<ChatBoxProps>();

const messages = ref<TMessage[]>([]);
const message = ref<string>("");

let socket: Socket<IListenEvents, IEmitEvents>;
let room: IRoom;

const sendMessage = () => {
  if (!message.value.trim()) {
    return;
  }

  socket.emit("room:message:send", room.id, message.value);

  // TODO ? : add directly messageData to messages
  // Implying that we cannot edit the inserted message without the newly created id from the database

  message.value = "";
};

/* Scroll to the bottom for each new message */
watch(
  () => [...messages.value],
  async (newMessages, oldMessages) => {
    await nextTick();
    if (newMessages.length > oldMessages.length) {
      document
        .getElementById("chat-room-messages")
        ?.scrollIntoView({ block: "end" });
    }
  }
);

onMounted(() => {
  socket = io("http://localhost:3000");
  socket.emit("room:join", roomId);

  socket.on("room:joined", ({ data, errors }) => {
    if (errors) {
      console.error(errors);

      // TODO: have better error handling
      return;
    }

    const { room: roomRef } = data;

    messages.value = roomRef.messages;
    room = roomRef;
  });

  socket.on("room:message:received", ({ data, errors }) => {
    if (errors) {
      console.error(errors);

      // TODO: have better error handling
      return;
    }

    const { message } = data;

    messages.value.push(message);
  });

  socket.on("connect", () => {
    console.log("connected");
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});
</script>

<template>
  <div class="main-container">
    <div id="chat-room" class="chat-room">
      <h3>{{ title }}</h3>
      <div class="chat-room__messages">
        <ul id="chat-room-messages" class="chat-room__messages__container">
          <Message
            v-if="messages.length"
            v-for="message in messages"
            :key="message.id"
            :message="message"
          />
        </ul>
      </div>
      <div class="chat-room__input">
        <input type="text" v-model="message" @keyup.enter="sendMessage" />
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
