<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useToast } from "vue-toastification";
import { useAuthStore, useConversationStore } from "../stores";
import { TSocket } from "../types/socket.io";

const store = useConversationStore();
const auth = useAuthStore();
const socket = auth.socket as TSocket;
const toast = useToast();
const isEndedConversationDisplayed = ref(false);
const conversations = computed(() => Object.values(store.conversations));

const filteredConversations = computed(() => {
  if (isEndedConversationDisplayed.value) {
    return conversations.value;
  }

  return conversations.value.filter((conversation) => !conversation?.endedAt);
});

const sortedConversations = computed(() => {
  return filteredConversations.value.sort((a, b) => {
    if (a?.endedAt && b?.endedAt) {
      return 0;
    }

    if (a?.endedAt) {
      return 1;
    }

    if (b?.endedAt) {
      return -1;
    }

    return 0;
  });
});

onMounted(() => {
  socket.emit("conversations");

  socket.on("conversations", ({ data, errors }) => {
    if (errors) {
      for (const error of errors) {
        toast.error(error.message);
      }

      return;
    }

    store.updateConversations(data.conversations);
  });

  socket.on("contact:created", ({ errors }) => {
    if (errors) {
      for (const error of errors) {
        toast.error(error.message);
      }

      return;
    }

    toast.success("Demande envoyée, un conseiller va vous contacter");
  });

  socket.on("contact:pending", ({ errors }) => {
    if (errors) {
      for (const error of errors) {
        toast.error(error.message);
      }

      return;
    }

    toast.info("Vous êtes déjà en attente d'un conseiller");
  });

  socket.on("contact:accepted", ({ data, errors }) => {
    if (errors) {
      for (const error of errors) {
        toast.error(error.message);
      }

      return;
    }

    toast.success("An advisor accepted your contact");
    store.setConversation(data.conversation);
  });

  socket.on("contact:refused", ({ data, errors }) => {
    if (errors) {
      for (const error of errors) {
        toast.error(error.message);
      }

      return;
    }

    toast.warning("Aucun conseiller ne peut vous contacter pour le moment");
  });

  socket.on("conversation:ended", ({ data, errors }) => {
    if (errors) {
      for (const error of errors) {
        toast.error(error.message);
      }

      return;
    }

    store.updateConversation(data.conversation);
  });
});

onUnmounted(() => {
  socket.off("conversations");
  socket.off("contact:created");
  socket.off("contact:pending");
  socket.off("contact:accepted");
  socket.off("contact:refused");
  socket.off("conversation:ended");
});

function contact() {
  socket.emit("contact:create");
}

function toggleIsEndedConversationDisplayed() {
  isEndedConversationDisplayed.value = !isEndedConversationDisplayed.value;
}
</script>

<template>
  <div class="main-container">
    <section id="conversations">
      <header>
        <h3>Conversations</h3>
      </header>
      <ul v-if="conversations.length">
        <li v-for="conversation of sortedConversations" :key="conversation?.id">
          <RouterLink
            :to="{
              name: 'conversation',
              params: { conversationId: conversation?.id },
            }"
          >
            <span>{{ conversation?.receiver?.username }}</span>
            <span class="status" v-if="conversation?.endedAt">Terminé</span>
          </RouterLink>
        </li>
      </ul>
      <div class="show-ended-conversations">
        <input
          v-model="isEndedConversationDisplayed"
          type="checkbox"
          id="ended-conversations"
        />
        <label for="ended-conversations"
          >Afficher les conversations terminées</label
        >
      </div>
      <button @click="contact" v-if="!auth.isAdmin">Contact</button>
    </section>
  </div>
</template>

<style scoped lang="scss">
#conversations {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 500px;
  max-height: 500px;
  background-color: white;
  border: 1px solid black;
  color: black;
  width: 400px;

  header {
    display: grid;
    justify-content: center;
    background: black;
    color: white;

    h3 {
      padding: 0.5rem;
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

  ul {
    display: grid;
    grid-template-rows: repeat(auto-fill, 3rem);
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

    li:nth-child(odd) {
      background-color: #f3f3f3;
    }

    li {
      &:hover {
        background-color: black;
        color: white;
      }

      a {
        display: grid;
        grid-template-columns: 1fr auto;
        text-decoration: none;
        align-items: center;
        height: 100%;
        padding: 0.5rem;
      }
    }
  }

  .show-ended-conversations {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: auto 1fr;
    gap: 1rem;
    padding: 0.5rem;
    border-top: 1px solid black;
    background: black;
    color: white;

    label {
      cursor: pointer;
    }
  }
}
</style>

