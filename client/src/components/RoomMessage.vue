<script setup lang="ts">
import { TMessage } from "../types/message";
import {useAuthStore} from "../stores";
import {computed} from "vue";

interface MessageProps {
  message: TMessage;
}

const props = defineProps<MessageProps>();

const auth = useAuthStore();

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

</script>

<template>
  <li class="message">
    <div class="message__content">
      {{ message.content }}
    </div>
    <div class="message__meta">
      <RouterLink v-if="canConversate" class="cursor-pointer message__meta__user" :to="{ name: 'conversation', params: { receiverId: message.author?.id } }">
        {{ message.author.username }}
      </RouterLink>
      <span v-else class="message__meta__user">
        {{ message.author.username }}
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
  border-radius: 0.5rem;
  background-color: #f5f5f5;
  margin-bottom: 1rem;
}

.message__content {
  margin-bottom: 0.5rem;
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
