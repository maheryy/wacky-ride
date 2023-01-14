<script setup lang="ts">
import { IChatbotMessage } from "../types/message";

interface MessageProps {
  message: IChatbotMessage;
}

defineProps<MessageProps>();
</script>

<template>
  <li class="message">
    <div class="message__content">
      {{ message.content }}
    </div>
    <div class="message__meta" v-if="message.isBotMessage">
      <span class="message__meta__user">JohnnyBot</span>
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
</style>
