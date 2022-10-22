<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
  onUpdated,
  nextTick,
} from "vue";
import { IUser } from "../../types/user";
import { IMessage } from "../../types/message";
import Message from "./Message.vue";

const recipient: IUser = {
  id: 1,
  username: "John",
  email: "email@example.com",
  isAdmin: true,
};

const sender: IUser = {
  id: 2,
  username: "Jane",
  email: "email.example.com",
  isAdmin: false,
};

const messages = ref<IMessage[]>([
  {
    id: 1,
    user: sender,
    content: "Hello",
    createdAt: new Date(),
  },
  {
    id: 2,
    user: recipient,
    content: "Hi",
    createdAt: new Date(),
  },
  {
    id: 3,
    user: sender,
    content: "How are you?",
    createdAt: new Date(),
  },
  {
    id: 4,
    user: recipient,
    content: "I'm fine, thanks",
    createdAt: new Date(),
  },
  {
    id: 5,
    user: sender,
    content: "What about you?",
    createdAt: new Date(),
  },
  {
    id: 6,
    user: recipient,
    content: "I'm fine too",
    createdAt: new Date(),
  },
  {
    id: 7,
    user: sender,
    content: "Nice to hear that",
    createdAt: new Date(),
  },
  {
    id: 8,
    user: recipient,
    content: "Bye",
    createdAt: new Date(),
  },
  {
    id: 9,
    user: sender,
    content: "Bye",
    createdAt: new Date(),
  },
]);

const message = ref<string>("");

const sendMessage = () => {
  if (!message.value.trim()) {
    return;
  }
  messages.value.push({
    id: messages.value.length + 1,
    user: sender,
    content: message.value,
    createdAt: new Date(),
  });
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
</script>

<template>
  <div id="chat-box" class="chat-box">
    <h3>{{ recipient.username }}</h3>
    <div class="chat-box__messages">
      <ul id="chat-box-messages" class="chat-box__messages__container">
        <Message
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
