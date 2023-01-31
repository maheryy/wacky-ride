<script setup lang="ts">
import { TMessage } from "../types/message";
import { useAuthStore } from "../stores";
import { computed } from "vue";
import { IUser } from "../types/user";
import { TSocket } from "../types/socket.io";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

interface MessageProps {
  message: TMessage;
}

const props = defineProps<MessageProps>();
const toast = useToast();
const auth = useAuthStore();
const socket = auth.socket as TSocket;
const router = useRouter();

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const withLeadingZero = (n: number) => (n < 10 ? "0" + n : n);
  return `${withLeadingZero(hours)}:${withLeadingZero(minutes)}`;
};

const canConversate = computed(() => {
  if (props.message.author.isAdmin) {
    return false;
  }

  return auth.user?.id !== props.message.author.id;
});

function conversate(receiverId: IUser["id"]) {
  if (!canConversate.value) {
    return;
  }

  socket.emit("conversation:conversate", +receiverId);

  socket.once("conversation", ({ data, errors }) => {
    if (errors) {
      for (const error of errors) {
        toast.error(error.message);
      }

      return;
    }

    router.push({
      name: "conversation",
      params: { conversationId: data.conversation.id },
    });
  });
}
</script>

<template>
  <li class="message">
    <div class="message__content">
      {{ message.content }}
    </div>
    <div class="message__meta">
      <span
        :class="{ message__meta__user: true, talkableUser: canConversate }"
        @click="conversate(message.author.id)"
      >
        {{ message.author.username }} {{ message.author.isAdmin ? "(Conseiller)" : "" }}
      </span>
      <span class="message__meta__date" v-if="message.createdAt">
        {{ formatDate(message.createdAt as unknown as string) }}
      </span>
    </div>
  </li>
</template>

<style>
.message {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem;
  background-color: #f5f5f5;
}

.pointer {
  cursor: pointer;
}

.message__content {
  margin-bottom: 0.5rem;
  word-break: break-word;
}

.message__meta {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
}

.message__meta__user {
  font-weight: bold;
  margin-right: 0.5rem;
}

.message__meta__date {
  color: #999;
}

.message__meta__date::before {
  content: "•";
  margin: 0 0.5rem;
}

.message__meta__date::after {
  content: "•";
  margin: 0 0.5rem;
}
</style>

