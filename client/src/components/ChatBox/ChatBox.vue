<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
import { IUser } from "../../types/user";
import { IMessage } from "../../types/message";
import { IConversation } from "../../types/conversation";
import { IEmitEvents, IListenEvents } from "../../types/socket.io";
import { io, Socket } from "socket.io-client";
import Message from "./ChatBoxMessage.vue";

const sender: IUser = {
  id: 1,
  username: "admin",
  email: "admin@wacky.com",
  status: 1,
  isAdmin: true,
};

const messages = ref<IMessage[]>([]);
const message = ref<string>("");

let socket: Socket<IListenEvents, IEmitEvents>;
let conversation: IConversation;
let targetUser: number = 2;

const sendMessage = () => {
  if (!message.value.trim()) {
    return;
  }

  const messageData: Omit<IMessage, "id"> = {
    content: message.value,
    author: sender,
    conversation: conversation,
  };

  socket.emit("conversation:message:send", messageData);

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
        .getElementById("chat-box-messages")
        ?.scrollIntoView({ block: "end" });
    }
  }
);

onMounted(() => {
  socket = io("http://localhost:3000");
  socket.emit("conversation:open", targetUser);

  socket.on("conversation:load", ({ data, errors }) => {
    if (errors) {
      console.error(errors);

      return;
    }

    const { conversation: conversationRef, messages: messageList } = data;

    messages.value = messageList;
    conversation = conversationRef;
  });

  socket.on("conversation:message:received", ({ data, errors }) => {
    if (errors) {
      console.error(errors);

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
  <div id="chat-box" class="chat-box">
    <h3>{{ "Johnny" }}</h3>
    <div class="chat-box__messages">
      <ul id="chat-box-messages" class="chat-box__messages__container">
        <Message
          v-if="messages.length"
          v-for="message in messages"
          :key="message.id"
          :message="message"
        />
      </ul>
    </div>
    <div class="chat-box__input">
      <input type="text" v-model="message" @keyup.enter="sendMessage" />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat-box {
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

.chat-box__messages {
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

.chat-box__input {
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
