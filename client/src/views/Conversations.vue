<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";
import { useToast } from "vue-toastification";
import { useAuthStore, useConversationStore } from "../stores";
import { TSocket } from "../types/socket.io";

const store = useConversationStore();
const auth = useAuthStore();
const socket = auth.socket as TSocket;
const toast = useToast();

const hasConversations = computed(
  () => Object.keys(store.conversations).length > 0
);

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

    toast.success("Contact created, an advisor will contact you soon");
  });

  socket.on("contact:pending", ({ errors }) => {
    if (errors) {
      for (const error of errors) {
        toast.error(error.message);
      }

      return;
    }

    toast.info("You already have a pending contact");
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

    toast.warning("There is too many contacts, please try again later");
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
});

function contact() {
  socket.emit("contact:create");
}
</script>

<template>
  <div class="main-container">
    <section id="conversations">
      <header>
        <h3>Conversations</h3>
      </header>
      <ul v-if="hasConversations">
        <li v-for="conversation of store.conversations" :key="conversation?.id">
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
      <button @click="contact" v-if="!auth.isAdmin">Contact</button>
    </section>
  </div>
</template>

<style scoped lang="scss">
#conversations {
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
      height: 3rem;

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
}
</style>

