<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useAuthStore, useConversationStore } from "../stores";
import { TSocket } from "../types/socket.io";

const store = useConversationStore();
const auth = useAuthStore();
const socket = auth.socket as TSocket;
const toast = useToast();
const router = useRouter();

onMounted(() => {
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

    toast.success(
      "Un conseiller à accepter votre demande, cliquez ici pour rejoindre la conversation",
      {
        onClick: () => {
          router.push({
            name: "conversation",
            params: { conversationId: data.conversation.id },
          });
        },
      }
    );
    store.setConversation(data.conversation);
  });

  socket.on("contact:refused", ({ errors }) => {
    if (errors) {
      for (const error of errors) {
        toast.error(error.message);
      }

      return;
    }

    toast.warning("Aucun conseiller ne peut vous contacter pour le moment");
  });
});

onUnmounted(() => {
  socket.off("conversations");
  socket.off("contact:created");
  socket.off("contact:pending");
  socket.off("contact:accepted");
  socket.off("contact:refused");
});

function contact() {
  socket.emit("contact:create");
}
</script>

<template>
  <div class="main-container wacky-tile">
    <section id="community" class="community">
      <header>
        <h3>Communauté</h3>
      </header>
      <ul>
        <li><RouterLink to="rooms">Salons de discussion</RouterLink></li>
        <li><RouterLink to="conversations">Conversations</RouterLink></li>
        <li @click="contact" v-if="!auth.isAdmin">
          <span>Contacter un conseiller</span>
        </li>
        <li v-if="!auth.isAdmin">
          <RouterLink to="chatbot">Wacky bot</RouterLink>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped lang="scss">
#community {
  header {
    display: grid;
    justify-content: center;
    background: black;
    color: white;

    h3 {
      padding: 0.5rem;
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
      cursor: pointer;

      &:hover {
        background-color: black;
        color: white;
      }

      * {
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

