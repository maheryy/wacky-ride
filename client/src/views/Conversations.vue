<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useAuthStore, useConversationStore } from "../stores";
import { TSocket } from "../types/socket.io";

const store = useConversationStore();
const auth = useAuthStore();
const socket = auth.socket as TSocket;

const hasConversations = computed(
  () => Object.keys(store.conversations).length > 0
);

onMounted(() => {
  socket.emit("conversations");

  socket.on("conversations", ({ data, errors }) => {
    if (errors) {
      console.error(errors);

      return;
    }

    store.updateConversations(data.conversations);
  });
});
</script>

<template>
  <ul>
    <li
      v-if="hasConversations"
      v-for="conversation of store.conversations"
      :key="conversation?.id"
    >
      <RouterLink
        :to="{
          name: 'conversation',
          params: { conversationId: conversation?.id },
        }"
      >
        {{ conversation?.receiver?.username }}
      </RouterLink>
    </li>
  </ul>
</template>
