<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from "vue";
import { TSocket } from "../types/socket.io";
import Message from "../components/ConversationMessage.vue";
import { useAuthStore, useConversationStore } from "../stores";
import dayjs from "dayjs";
import { IUser } from "../types/user";
import { useToast } from "vue-toastification";

interface IConversationProps {
  receiverId: IUser["id"];
}

const { receiverId } = defineProps<IConversationProps>();
const store = useConversationStore();
const toast = useToast();
const auth = useAuthStore();
const conversation = computed(() => store.conversations[receiverId]);
const message = ref("");
const socket = auth.socket as TSocket;
const adminSocket = auth.adminSocket as TSocket;
const conversationMessages = ref<HTMLUListElement | null>(null);

const canSendMessage = computed(() => conversation.value?.endedAt === null);
const canEndConversation = computed(() => canSendMessage.value && auth.isAdmin);

const messages = computed(() => {
  return conversation.value?.messages || [];
});

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

    conversationMessages.value?.scrollIntoView({ block: "end" });
  }
);

onMounted(() => {
  socket.emit("conversation", receiverId);

  socket.on("conversation", ({ data, errors }) => {
    if (errors) {
      for (const error of errors) {
        toast.error(error.message);
      }
      return;
    }

    store.updateConversation(data.conversation);
  });

  socket.on("conversation:message:received", ({ data, errors }) => {
    if (errors) {
      for (const error of errors) {
        toast.error(error.message);
      }

      return;
    }

    store.addMessage(receiverId, data.message);
  });

  socket.on("conversation:ended", ({ data, errors }) => {
    if (errors) {
      for (const error of errors) {
        toast.error(error.message);
      }

      return;
    }

    return store.updateConversation(data.conversation);
  });
});

onUnmounted(() => {
  socket.off("conversation");
  socket.off("conversation:message:received");
  socket.off("conversation:ended");
});

function endConversation() {
  adminSocket.emit("conversation:end", receiverId);
}
</script>

<template>
  <div class="main-container">
    <div id="conversation" class="conversation">
      <div class="conversation__header">
        <h3>{{ conversation?.receiver.username }}</h3>
        <button @click="endConversation" v-if="canEndConversation">
          End conversation
        </button>
      </div>
      <div class="conversation__messages">
        <ul
          id="conversation-messages"
          class="conversation__messages__container"
          ref="conversationMessages"
        >
          <Message
            v-if="sortedMessages.length"
            v-for="message in sortedMessages"
            :key="message.id"
            :message="message"
          />
        </ul>
      </div>
      <div v-if="canSendMessage" class="conversation__input">
        <input type="text" v-model.trim="message" @keyup.enter="sendMessage" />
        <button @click="sendMessage">Send</button>
      </div>
      <div v-else>
        <p>Conversation ended</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.conversation {
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

.conversation__header {
  display: grid;
  grid-template-columns: 1fr auto;
}

.conversation__messages {
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

.conversation__input {
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

