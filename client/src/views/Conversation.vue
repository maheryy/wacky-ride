<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
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
const bottom = ref<HTMLDivElement | null>(null);

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

  socket.emit("conversation:message:send", +conversationId, message.value);

  message.value = "";

  bottom.value?.scrollIntoView({ block: "end" });
};

onMounted(() => {
  bottom.value?.scrollIntoView({ block: "end" });

  socket.emit("conversation", +conversationId);

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
  adminSocket.emit("conversation:end", +conversationId);
}
</script>

<template>
  <div class="main-container wacky-tile">
    <section id="conversation" class="community">
      <header>
        <RouterLink to="/conversations" class="back">ᐸ</RouterLink>
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
      <div v-else class="ended">
        <p>La conversation est terminé</p>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
#conversation {
  header {
    display: grid;
    align-items: center;
    background: black;
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
      background-color: black;
      color: white;
      justify-self: center;
    }

    button {
      position: absolute;
      right: 0;
      padding: 0.5rem;
      color: white;
      outline: 1px solid black;
      height: calc(100% - 1px);

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

    li {
      height: fit-content;
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

  .ended {
    background: black;
    color: white;
    padding: 0.5rem;
    display: grid;
    justify-content: center;
  }
}
</style>

