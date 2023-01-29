<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useToast } from "vue-toastification";
import { useAuthStore } from "../../stores";
import { TSocket } from "../../types/socket.io";
import { translatedUserStatus, UserStatus } from "../../types/user";

const auth = useAuthStore();
const toast = useToast();
const status = ref(auth.user?.status);
const adminSocket = auth.adminSocket as TSocket;

watch(status, (status) => {
  if (status) {
    adminSocket.emit("admin:status:update", status);
  }
});

onMounted(() => {
  adminSocket.on("admin:status:updated", ({ data, errors }) => {
    if (errors) {
      for (const error of errors) {
        toast.error(error.message);
      }

      return;
    }

    auth.setStatus(data.status);
    toast.success("Status updated");
  });
});

onUnmounted(() => {
  adminSocket.off("admin:status:updated");
});
</script>

<template>
  <section id="status">
    <label for="status-select">Status</label>
    <select v-if="status" v-model="status" id="status-select">
      <option v-for="status in UserStatus" :key="status" :value="status">
        {{ translatedUserStatus[status] }}
      </option>
    </select>
  </section>
</template>

<style scoped lang="scss">
#status {
  display: grid;
  grid-template-columns: min-content min-content;
  align-items: center;
  justify-content: end;
  gap: 1rem;
  padding: 1rem;

  select {
    cursor: pointer;
    padding: 0.5rem;
    background: white;
    border: 1px solid black;
  }
}
</style>

