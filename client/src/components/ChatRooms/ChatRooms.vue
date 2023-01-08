<script setup lang="ts">
import { computed } from "vue";
import store from "../../store";

const hasRooms = computed(() => Object.keys(store.rooms).length > 0);
</script>

<template>
  <ul id="chat-rooms">
    <li
      class="chat-room"
      v-if="hasRooms"
      v-for="room of store.rooms"
      :key="room?.id"
    >
      <RouterLink :to="{ name: 'room', params: { roomId: room?.id } }">
        {{ room?.name }}
      </RouterLink>
    </li>
  </ul>
</template>

<style scoped>
.chat-room {
  color: white;
}
</style>
