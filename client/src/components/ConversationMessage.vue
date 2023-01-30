<script setup lang="ts">
import { TMessage } from "../types/message";

interface MessageProps {
  message: TMessage;
}

defineProps<MessageProps>();

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const withLeadingZero = (n: number) => (n < 10 ? "0" + n : n);
  return `${withLeadingZero(hours)}:${withLeadingZero(minutes)}`;
};
</script>

<template>
  <li class="message">
    <div class="message__content">
      {{ message.content }}
    </div>
    <div class="message__meta">
      <span class="message__meta__user">{{ message.author.username }}</span>
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
  color: #2758ce;
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

