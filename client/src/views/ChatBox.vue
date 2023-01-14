<script setup lang="ts">
import { inject, ref, watch, onMounted, nextTick } from "vue";
import { TMessage } from "../types/message";
import { TSocket } from "../types/socket.io";
import Message from "../components/ChatBoxMessage.vue";
import { socketKey } from "../providers/keys";

const messages = ref<TMessage[]>([]);
const message = ref("");
const socket = inject(socketKey) as TSocket;
const receiverId = 2;

const sendMessage = () => {
  if (!message.value.trim()) {
    return;
  }

  // TODO: remove hard coded receiver id
  socket.emit("conversation:message:send", receiverId, message.value);

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
  // TODO: Add endpoint to get conversation by id
  // @ts-ignore
  socket.on("conversation:load");

  socket.on("conversation:message:received", ({ data, errors }) => {
    if (errors) {
      console.error(errors);

      return;
    }

    const { message } = data;

    messages.value.push(message);
  });
});
</script>

<template>
  <div class="main-container">
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
