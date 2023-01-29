<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from "vue";
import { TSocket } from "../types/socket.io";
import Message from "../components/ConversationMessage.vue";
import { useAuthStore, useConversationStore } from "../stores";
import dayjs from "dayjs";
import { IUser } from "../types/user";
import { useToast } from "vue-toastification";

interface IConversationProps {
  conversationId: IUser["id"];
}

const { conversationId } = defineProps<IConversationProps>();
const store = useConversationStore();
const toast = useToast();
const auth = useAuthStore();
const conversation = computed(() => store.conversations[conversationId]);
const message = ref("");
const socket = auth.socket as TSocket;
const adminSocket = auth.adminSocket as TSocket;
const bottom = ref<HTMLUListElement | null>(null);

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

  socket.emit("conversation:message:send", conversationId, message.value);

  message.value = "";
};

/* Scroll to the bottom for each new message */
watch(
  () => messages.value.length,
  async () => {
    await nextTick();

    bottom.value?.scrollIntoView({ block: "end" });
  }
);

onMounted(() => {
  socket.emit("conversation", conversationId);

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

    store.addMessage(conversationId, data.message);
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
  adminSocket.emit("conversation:end", conversationId);
}
</script>

<template>
  <div class="main-container">
    <section id="conversation">
      <header>
        <h3>{{ conversation?.receiver.username }}</h3>
        <button @click="endConversation" v-if="canEndConversation">
          Terminer
        </button>
      </header>

      <ul v-if="sortedMessages.length" class="messages">
        <Message
          v-for="message in sortedMessages"
          :key="message.id"
          :message="message"
        />
        <div ref="bottom" />
      </ul>
      <div v-else>
        <p>No messages yet</p>
      </div>
      <div v-if="canSendMessage" class="board">
        <input
          type="text"
          v-model.trim="message"
          @keyup.enter="sendMessage"
          autofocus
        />
        <button @click="sendMessage">Envoyer</button>
      </div>
      <div v-else>
        <p>Conversation ended</p>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
#conversation {
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
    grid-template-columns: 1fr auto;

    h3 {
      padding: 0.5rem;
      background-color: black;
      color: white;
    }

    button {
      padding: 0.5rem;
      background-color: black;
      color: white;
      border-bottom: 1px solid black;

      &:hover {
        background-color: white;
        color: black;
      }
    }
  }

  .messages {
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
      background-color: #888;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: #555;
    }
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
}
</style>

