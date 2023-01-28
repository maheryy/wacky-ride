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
  <ul v-if="hasConversations">
    <li v-for="conversation of store.conversations" :key="conversation?.id">
      <RouterLink
        :to="{
          name: 'conversation',
          params: { receiverId: conversation.receiver?.id },
        }"
      >
        {{ conversation?.receiver?.username }}
      </RouterLink>
      <span v-if="conversation?.endedAt">Ended</span>
    </li>
  </ul>
  <button @click="contact" v-if="!auth.isAdmin">Contact</button>
</template>

