<script setup lang="ts">
import { inject, ref, watch, onMounted, nextTick, computed } from "vue";
import { TSocket } from "../../types/socket.io";
import Message from "./ChatBoxMessage.vue";
import { socketKey } from "../../providers/keys";
import { useConversationStore } from "../../stores";
import { IConversation } from "../../types/conversation";
import dayjs from "dayjs";

const store = useConversationStore();
const conversationId = ref<IConversation["id"] | null>(null);

const messages = computed(() => {
  if (conversationId.value) {
    return store.conversations[conversationId.value]?.messages || [];
  }

  return [];
});

const message = ref("");
const socket = inject(socketKey) as TSocket;
const receiverId = 12;
const chatBoxMessages = ref<HTMLUListElement | null>(null);

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

  // TODO: remove hard coded receiver id
  socket.emit("conversation:message:send", receiverId, message.value);

  // TODO ? : add directly messageData to messages
  // Implying that we cannot edit the inserted message without the newly created id from the database

  message.value = "";
};

/* Scroll to the bottom for each new message */
watch(
  () => messages.value.length,
  async () => {
    await nextTick();

    chatBoxMessages.value?.scrollIntoView({ block: "end" });
  }
);

onMounted(() => {
  socket.emit("conversation", receiverId);

  socket.on("conversation", ({ data, errors }) => {
    if (errors) {
      console.error(errors);

      return;
    }

    conversationId.value = data.conversation.id;

    store.updateConversation(data.conversation);
  });

  socket.on("conversation:message:received", ({ data, errors }) => {
    if (errors) {
      console.error(errors);

      return;
    }

    if (!conversationId.value) {
      return;
    }

    store.addMessage(conversationId.value, data.message);
  });
});
</script>

<template>
  <div class="main-container">
    <div id="chat-box" class="chat-box">
      <h3>TODO</h3>
      <div class="chat-box__messages">
        <ul
          id="chat-box-messages"
          class="chat-box__messages__container"
          ref="chatBoxMessages"
        >
          <Message
            v-if="sortedMessages.length"
            v-for="message in sortedMessages"
            :key="message.id"
            :message="message"
          />
        </ul>
      </div>
      <div class="chat-box__input">
        <input type="text" v-model.trim="message" @keyup.enter="sendMessage" />
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
