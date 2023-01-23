<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useAuthStore } from "../../stores";
import { TSocket } from "../../types/socket.io";
import { UserStatus } from "../../types/user";

const auth = useAuthStore();
const status = ref(auth.user?.status);
const adminSocket = auth.adminSocket as TSocket;

watch(status, (status) => {
  debugger;

  if (status) {
    adminSocket.emit("admin:status:update", status);
  }
});

onMounted(() => {
  adminSocket.on("admin:status:updated", ({ data, errors }) => {
    if (errors) {
      console.error(errors);

      return;
    }

    auth.setStatus(data.status);
  });
});

onUnmounted(() => {
  adminSocket.off("admin:status:updated");
});
</script>

<template>
  <div>
    <select v-if="status" v-model="status">
      <option v-for="status in UserStatus" :key="status" :value="status">
        {{ status }}
      </option>
    </select>
  </div>
</template>

